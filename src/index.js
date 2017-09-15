
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { createBrowserHistory } from 'history'
import  { Lazy, getUniqueKey, dump, addClass } from './utils';
import Store from './store/Store.js';
import UserStore from './store/UserStore.js';
import FeedStore from './store/FeedStore.js';
import Auth from './store/AuthStore.js';
import {TxRest} from './services/Api.js';
import './polyfill';
//import DashBoard from './Dashboard.js';

// Chech for safari privat mode
if (typeof localStorage === 'object') {
  try {
      localStorage.setItem('localStorage', 1);
      localStorage.removeItem('localStorage');
  } catch (e) {
      Storage.prototype._setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {};
      alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
  }
}

injectTapEventPlugin();

if (navigator.userAgent.indexOf('Safari') != -1 &&  navigator.userAgent.indexOf('Chrome') == -1) {
    addClass(document.body, "safari");
}


// ====================================
// ========= Lazy loadin ==============
// ====================================

// import Login from './Login' ;
// import Registration from './Registration';

  // eslint-disable-next-line
const SignUp = (props) => <Lazy {...props} load={() => import('./SignUp')}/>

  // eslint-disable-next-line
const Login = (props) => <Lazy {...props} load={() => import('./Login')}/>

  // eslint-disable-next-line
const DashBoard = (props) => <Lazy {...props} load={() => import('./Dashboard')}/>

  // eslint-disable-next-line
const Test = (props) => <Lazy {...props} load={() => import('./Test')}/>

  // eslint-disable-next-line
const Translator = (props) => <Lazy  {...props} load={() => import('./Translator')}/>

  // eslint-disable-next-line
const Admin = (props) => <Lazy {...props} load={() => import('./Admin')}/>

  // eslint-disable-next-line
const Landing = (props) => <Lazy {...props} load={() => import('./Landing')}/>

  // eslint-disable-next-line
const Private = (props) => <Lazy {...props} load={() => import('./Private')}/>

  // eslint-disable-next-line
const Term = (props) => <Lazy {...props} load={() => import('./Term')}/>

// eslint-disable-next-line
const Support = (props) => <Lazy {...props} load={() => import('./Support')}/>

// eslint-disable-next-line
const RestorePassword = (props) => <Lazy {...props} load={() => import('./RestorePassword')}/>

// ====================================
// ========= Lazy loadin end ==========
// ====================================



class App extends React.Component {
  
   componentWillMount() {
    //Auth.refreshToken();
    Auth.init();
    TxRest.initSocket();
    TxRest.initLiqPay();

    if(!Auth.isAuthenticated){
      if( Auth.loadSession){
        Store.loadSession()
        FeedStore.loadSession()
        UserStore.loadSession()
      }else{
        Store.clearSession()
        UserStore.clearSession()
        FeedStore.clearSession()
      }
    }

    if (typeof window === 'undefined') return
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  handleBeforeUnload() {
    Store.saveSession();
    UserStore.saveSession();
    FeedStore.saveSession();
  }

  render(){
    return(<Router>
            <Route render={({ location }) => (
                    <ReactCSSTransitionGroup
                      transitionName="fade"
                      transitionEnterTimeout={300}
                      transitionLeaveTimeout={300}
                    >
                      <ToDashBoard exact path="/"  key={getUniqueKey()}/>
                      <PrivateRoute path="/dashboard" component={DashBoard} location={location} role={['user','dev']} key={getUniqueKey()}/>
                      <PrivateRoute path="/translator" component={Translator} location={location} role={['translator','dev']} key={getUniqueKey()}/>
                      <PrivateRoute path="/admin" component={Admin} location={location} role={['controller','admin','dev']} key={getUniqueKey()}/>
                      <Route path="/signup" component={SignUp} location={location}  key={getUniqueKey()}/>
                      <Route path="/login" component={Login} location={location}  key={getUniqueKey()} />
                      <Route exact path="/test" component={Test} location={location}  key={getUniqueKey()} />
                      <PrivateRoute path="/protected" component={PrivateRoute} location={location}  key={getUniqueKey()}/>
                      <Route path="/private" component={Private} location={location}  key={getUniqueKey()} />
                      <Route path="/term-of-use" component={Term} location={location}  key={getUniqueKey()} />
                      <Route path="/help" component={Support} location={location}  key={getUniqueKey()} />
                      <Route path="/restorepassword" component={RestorePassword} location={location}  key={getUniqueKey()} />

                    </ReactCSSTransitionGroup>

            )}/>
          </Router>)
  }
}


const PrivateRoute =  ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isAuthenticated && rest.role.includes(Auth.role) ? (
       <Component currentRole={Auth.role} {...rest}/>
    ) : (
        Auth.isAuthenticated ?
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
        :
         <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
)


const ToDashBoard = ({ component: Component, ...rest }) => (
  <Route exact {...rest} render={props => {
    if(!Auth.isAuthenticated) return  <Landing {...props}/>
    switch (Auth.role) {
    case 'admin':
        return   <Redirect to={'/admin'} />
        break;
    case 'controller':
        return   <Redirect to={'/admin'} />
         break;
    case 'translator':
        return  <Redirect to={'/translator'} />
        break;
    case 'user':
        return   <Redirect to={'/dashboard'} />
        break;
    default:
        return  <Landing {...props}/>
        break;
    }
    }
  } />
)

ReactDOM.render(  
  <App />,
  document.getElementById('tx')
);
