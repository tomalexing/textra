import React from 'react';
import {fakeAuth} from './index';
import mainbg from './assets/main.png';
import logo from './assets/logo.png';
import fb from './assets/fb.svg';
import vk from './assets/vk.svg';
import {
//   BrowserRouter as Router,
//   Route,
     Link,
    Redirect,
    withRouter
} from 'react-router-dom';

class Login extends React.Component {

  componentDidMount(){
    this.submit.focus(); // press Enter to pass
  }
  state = {
    redirectToReferrer: false
  }

  login = (e) => {
    e.preventDefault();
    console.log('form login');
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })

  }
  loginVk = () => {

  }

  loginFb = () => {
    
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }

    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }

    return (
      <div className="f outer">
        <div className="f sidebar">
            <div className="f f-align-2-2 sidebar-regist__logo">
              <Link to={'/'} ><img src={logo} alt="Textra"/> </Link>
            </div>
            <div className="f f-col sidebar-regist__form registform">
              <p className="u-mb-1" >Войти</p>
              <div className="f f-gap-2 registform-regist__social">
                <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img src={fb} alt="fb"/></button>
                <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block vk-color"><img src={vk} alt="vk"/></button>
              </div>
               <div className="registform-delimiter " ><span>или</span></div>
              <form onSubmit={this.login} className="registform-regist__inputs ">
                <input type="email" name="email" className="field-block u-mb-3" placeholder="Email"/>
                <input type="password" name="password" className="field-block  u-my-3" placeholder="Пароль"/>
                <input tabIndex='1' type="submit" className="btn btn-primiry btn-normal btn-block" onClick={this.login} ref={(s) => { this.submit = s; }}  value="Войти"/>
              </form>
              <p className="f f-align-3-3 u-mt-1">Забыли пароль?</p>
            </div>
        </div>
        <Link to={'/registration'}className="main f f-col f-fill f-align-2-2 u-text-undecor"  style={bgPic}>
           <div className="main-toregister">
                <div className="main-regist__mini" >
                  <h1 className="h3 u-mb-1" >
                      Нет аккаунта? <br/>
                      Присоединяйтесь к нам!
                  </h1>
                  <p className="u-mb-1">После регистрации у вас будет возможность получать быстрые переводы </p>
                  <button  className="btn btn-primiry btn-block btn-normal">Зарегистрироваться</button>
                 </div>
           </div>
        </Link>
      </div>
    )
  }
}
export default withRouter(Login); 