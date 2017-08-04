
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
import  { Lazy, getUniqueKey, dump } from './utils';
injectTapEventPlugin();
// ====================================
// ========= Lazy loadin ==============
// ====================================

// import Login from './Login' ;
// import Registration from './Registration';

  // eslint-disable-next-line
const Registration = () => <Lazy load={() => import('./Registration')}/>

  // eslint-disable-next-line
const Login = () => <Lazy  load={() => import('./Login')}/>

  // eslint-disable-next-line
const DashBoard = () => <Lazy  load={() => import('./Dashboard')}/>

  // eslint-disable-next-line
const Test = (props) => <Lazy {...props} load={() => import('./Test')}/>

  // eslint-disable-next-line
const Translator = () => <Lazy load={() => import('./Translator')}/>

  // eslint-disable-next-line
const Admin = (props) => <Lazy {...props} load={() => import('./Admin')}/>
// ====================================
// ========= Lazy loadin end ==========
// ====================================


export const Auth = {
  isAuthenticated: true,
  role: 'dev',
  authenticate(cb, role) {
    this.isAuthenticated = true;
    this.role = role;
    if(this.isAuthenticated!= null && this.role!= null){
        window.localStorage.setItem('isLoggedIn', this.isAuthenticated);
        window.localStorage.setItem('userId', this.isAuthenticated)
    }
    cb();
  },
  signout(cb) {
    this.isAuthenticated = false;
    this.role = undefined;
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('userId');
    cb();
  }
}
if(Auth.role == undefined){
  
  // TODO: Make Ajax request to server for obtain role of the user 
  // I Should keep role only in App because it can be malfunction

}


const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

const App = () => (
  
  <Router>
     <Route render={({ location }) => (
       
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              <ToDashBoard exact path="/" key={getUniqueKey()}/>
              <Route path="/dashboard" component={DashBoard} location={location} role={['user','dev']} key={getUniqueKey()}/>
              <PrivateRoute path="/translator" component={Translator} location={location} role={['translator','dev']} key={getUniqueKey()}/>
              <PrivateRoute path="/admin" component={Admin} location={location} role={['admin','dev']} key={getUniqueKey()}/>
              <Route path="/registration" component={Registration} location={location}  key={getUniqueKey()}/>
              <Route path="/login" component={Login} location={location}  key={getUniqueKey()} />
              <PrivateRoute exact path="/test" component={Test} location={location} role={['dev']}key={getUniqueKey()} />
              <PrivateRoute path="/protected" component={PrivateRoute} location={location}  key={getUniqueKey()}/>
            </ReactCSSTransitionGroup>

     )}/>
  </Router>

)


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
