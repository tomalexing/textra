// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import {Bundle} from './utils';

// ====================================
// ========= Lazy loadin ==============
// ====================================

const Login = () => (
  <Bundle load={'./Login'}>
    {<div className='loading__screen'>loading</div>}
  </Bundle>
)

const Registration = () => (
  <Bundle load={'./Registration'}>
    {<div className='loading__screen'>loading</div>}
  </Bundle>
)
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
    <div>
      {/*<AuthButton />
      <ul>
        <li><Link to="/public">Public Page</Link></li>
        <li><Link to="/registration">registration</Link></li>
      </ul>*/}
      
      <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
      >
        <PrivateRoute exact path="/" component={Protected} />
        <Route path="/registration" component={Registration} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/protected" component={Protected} />
       </ReactCSSTransitionGroup>
    </div>
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


ReactDOM.render(  
  <App />,
  document.getElementById('tx')
);
