
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
import Auth from './store/AuthStore.js';



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
// ====================================
// ========= Lazy loadin end ==========
// ====================================



const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class App extends React.Component {
  
   componentWillMount() {
    Auth.init();
    //Auth.refreshToken();
    Store.loadSession()
    if (typeof window === 'undefined') return
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  handleBeforeUnload() {
    //Auth.refreshToken();
    Store.saveSession();
  }

  render(){
    return(<Router>
            <Route render={({ location }) => (
                    <ReactCSSTransitionGroup
                      transitionName="fade"
                      transitionEnterTimeout={300}
                      transitionLeaveTimeout={300}
                    >
                      <ToDashBoard exact path="/" key={getUniqueKey()}/>
                      <PrivateRoute path="/dashboard" component={DashBoard} location={location} role={['user','dev']} key={getUniqueKey()}/>
                      <PrivateRoute path="/translator" component={Translator} location={location} role={['translator','dev']} key={getUniqueKey()}/>
                      <PrivateRoute path="/admin" component={Admin} location={location} role={['user','dev']} key={getUniqueKey()}/>
                      <Route path="/signup" component={SignUp} location={location}  key={getUniqueKey()}/>
                      <Route path="/login" component={Login} location={location}  key={getUniqueKey()} />
                      <PrivateRoute exact path="/test" component={Test} location={location} role={['dev']}key={getUniqueKey()} />
                      <PrivateRoute path="/protected" component={PrivateRoute} location={location}  key={getUniqueKey()}/>
                    </ReactCSSTransitionGroup>

            )}/>
          </Router>)
  }
}


const AuthButton = withRouter(({ history }) => (
  
  Auth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        Auth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
      <p>You are not logged in.</p>
    )
))

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
  <Route exact {...rest} render={props => (
      <Redirect to={'/dashboard'} />
    ) 
  } />
)

ReactDOM.render(  
  <App />,
  document.getElementById('tx')
);
