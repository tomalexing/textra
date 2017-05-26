
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
import  { Lazy, getUniqueKey } from './utils';


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
         <div style={styles.fill}>
            {/*<AuthButton />
            <ul>
              <li><Link to="/public">Public Page</Link></li>
              <li><Link to="/registration">registration</Link></li>
            </ul>*/}
              <ul style={styles.nav}>
                <NavLink to="/10/90/50">Red</NavLink>
                <NavLink to="/120/100/40">Green</NavLink>
                <NavLink to="/200/100/40">Blue</NavLink>
                <NavLink to="/310/100/50">Pink</NavLink>
                <NavLink to="/registration">registration</NavLink>
                <NavLink to="/login">login</NavLink>
                <NavLink to="/public">public</NavLink>
                <NavLink to="/protected">Protected</NavLink>
          
              </ul>
              <div style={styles.content}>
                  <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                  >
                  <PrivateRoute exact path="/" component={Protected} location={location}  key={getUniqueKey()}/>
                  <Route path="/registration" component={Registration} location={location}  key={getUniqueKey()}/>
                  <Route path="/login" component={Login} location={location}  key={getUniqueKey()} />
                  <PrivateRoute path="/protected" component={PrivateRoute} location={location}  key={getUniqueKey()}/>

                  <Route  location={location}
                          key={location.key}
                          path="/:h/:s/:l"
                          component={HSL}/>
                  </ReactCSSTransitionGroup>
            </div>
      </div>
     )}/>
  </Router>

)

const NavLink = (props) => (
  <li style={styles.navItem}>
    <Link {...props} style={{ color: 'inherit' }}/>
  </li>
)

const HSL = ({ match: { params } }) => (
  <div style={{
    ...styles.fill,
    ...styles.hsl,
    background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`
  }}>hsl({params.h}, {params.s}%, {params.l}%)</div>
)
const styles = {}

styles.fill = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
}

styles.content = {
  ...styles.fill,
  top: '40px',
  textAlign: 'center'
}

styles.nav = {
  padding: 0,
  margin: 0,
  position: 'absolute',
  top: 0,
  height: '40px',
  width: '100%',
  display: 'flex',
  overflowX: 'auto'
}

styles.navItem = {
  textAlign: 'center',
  flex: 1,
  listStyleType: 'none',
  padding: '10px'
}

styles.hsl  = {
  ...styles.fill,
  color: 'white',
  paddingTop: '20px',
  fontSize: '30px'
}

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
