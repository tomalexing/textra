import React from 'react';
import {fakeAuth} from './index';
import mainbg from './assets/main.png';
import logo from './logo.svg';
import fb from './assets/fb.svg';
import vk from './assets/vk.svg';
import {
//   BrowserRouter as Router,
//   Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { dump } from './utils'
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
    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }
    return (
      <div className="f outer">
        <div className="f f-align-2-2 main" style={bgPic}>
            <div className="f f-col main-regist__form">
              <p className="u-mb-1" >Войти</p>
              <div className="f f-gap-2 registform-regist__social">
                <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img src={fb} alt="fb"/></button>
                <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block vk-color"><img src={vk} alt="vk"/></button>
              </div>
                <div className="registform-delimiter " ><span>или</span></div>
              <form onSubmit={this.login} className="registform-regist__inputs ">
                <input type="email" name="email" className="field-block u-mb-3" placeholder="Email"/>
                <input type="password" name="password" className="field-block  u-my-3" placeholder="Пароль"/>
                <input type="password" name="password" className="field-block  u-my-3" placeholder="Повторить пароль"/>
                <input tabIndex='1' type="submit" className="btn btn-primiry btn-normal btn-block" onClick={this.login} ref={(s) => { this.submit = s; }}  value="Войти"/>
              </form>
              <div className="u-mt-1 registform-textlink">Регистрируясь, вы принимаете <Link to='/' className="registform-textlink__blue u-text-undecor" >пользовательское соглашение</Link></div>
            </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Login); 