import React from 'react';
import {fakeAuth} from './index';
import mainbg from './assets/main.png';
import logo from './logo.svg';
import {
//   BrowserRouter as Router,
//   Route,
//   Link,
  Redirect,
  withRouter
} from 'react-router-dom';

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    var Tds = () => 
          Object.entries( process ).map(function(i) {
          return <tr key={i}>{i+""}</tr>;
        });
    return (
      
      <div>
            <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
        </p>
    </div>
        <p>You must log in to view the page at {from.pathname} </p>
        { Tds() }
       
      </div>
    )
  }
}
export default withRouter(Login); 