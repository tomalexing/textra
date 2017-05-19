import React from 'react';
import {fakeAuth} from './index';

import mainbg from './assets/main.png';
import logo from './assets/logo.png';
import fb from './assets/fb.svg';
import vk from './assets/vk.svg';

import { findDOMNode } from 'react-dom';
import { hasClass, addClass , removeClass, debounce, listener} from './utils';
import {
//   BrowserRouter as Router,
//   Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';

const TxForm = (props) => (
    <form onSubmit={props.login} className="registform-regist__inputs ">
      <input type="email" name="email" className="field-block u-mb-3" placeholder="Email"/>
      <input type="password" name="password" className="field-block  u-my-3" placeholder="Пароль"/>
      <input tabIndex='1' type="submit" className="btn btn-primiry btn-normal btn-block" onClick={props.login} ref={(s) => { props.submit = s; }}  value="Войти"/>
    </form>
)

class Login extends React.Component {

 constructor(props){
   super(props);
   this.removeMe = [];
 }

  componentDidMount(){
    this.submit.focus(); // press Enter to pass
    this.removeMe.push(
          listener(window, 'resize', debounce((e) => {
            let isTablet = e.target.innerWidth < 768 ? true : false;
            if(this.state.isTablet !==  isTablet ) this.setState({isTablet})
          }, 200, false), false)
        )
  }

  componentWillUnmount(){ 
    removeClass(this.toggleElem, 'toggled');
    this.removeMe.forEach(removeEventListener => removeEventListener())
  }

  state = {
    redirectToReferrer: false,
    isTablet: false
  }

  login = (e) => {
    e.preventDefault();
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    }) 

  }

  switchPanel = (e) => {

    !hasClass(this.toggleElem, 'toggled') ? addClass(this.toggleElem, 'toggled'): removeClass(this.toggleElem, 'toggled');

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
        <div className="f f-align-2-2 outer-left">
          <div className="f sidebar">
              <div className="f f-align-2-2 sidebar-regist__logo">
                <Link to={'/'} ><img src={logo} alt="Textra"/> </Link>
              </div>
              <div className="f f-col sidebar-regist__form registform">
                <h3 className="u-mb-5" >Войти</h3>
                <p className="u-mb-4"> Нужен акакаунт? {(
                  this.state.isTablet ? (
                      <button className="btn btn-flat" onClick={debounce(this.switchPanel.bind(this),500,false)} > Создать аккаунт</button>
                    ):(
                      <Link to="/registration" className="btn btn-flat"> Создать аккаунт</Link>
                    )
                )}</p>
                <div className="f f-gap-2 registform-regist__social"> 
                  <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img src={fb} alt="fb"/></button>
                  <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block vk-color"><img src={vk} alt="vk"/></button>
                </div>
                <div className="registform-delimiter " ><span>или</span></div>
                <TxForm login={this.login} submit={this.submit}/>
                <p className="f f-align-3-3 u-mt-1">Забыли пароль?</p>
              </div>
          </div>
        </div>
        <div className="f outer-right" ref={n => this.toggleElem = n}>
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
      </div>
    )
  }
}
export default withRouter(Login); 