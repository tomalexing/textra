
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
const Login = () => <Lazy load={() => import('./Login')}/>

  // eslint-disable-next-line
const DashBoard = () => <Lazy load={() => import('./Dashboard')}/>

const Test = () => <Lazy load={() => import('./Test')}/>

// ====================================
// ========= Lazy loadin end ==========
// ====================================


export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
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
            <Route path="/dashboard" component={DashBoard} location={location}  key={getUniqueKey()}/>
            <Route path="/registration" component={Registration} location={location}  key={getUniqueKey()}/>
            <Route path="/login" component={Login} location={location}  key={getUniqueKey()} />
            <Route exact path="/test" component={Test} location={location}  key={getUniqueKey()} />
            <PrivateRoute path="/protected" component={PrivateRoute} location={location}  key={getUniqueKey()}/>


            </ReactCSSTransitionGroup>

     )}/>
  </Router>

)


const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
      <p>You are not logged in.</p>
    )
))
 
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
        <Component {...props} />
    ) : (
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
