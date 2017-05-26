import React from 'react';
import {fakeAuth} from './index';

import mainbg from './assets/main.png';
import logo from './assets/logo.png';
import fb from './assets/fb.svg';
import google from './assets/google.svg';

import TxInput from './components/TxInput';
import TxForm from './components/TxForm';
import { hasClass, addClass , removeClass, debounce, listener} from './utils';
import {
//   BrowserRouter as Router,
//   Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';

class Login extends React.Component {

 constructor(props){
   super(props);
   this.removeMe = [];
   this.doAtDidMount = [];
 }

  componentDidMount(){
    this.removeMe.push(
          listener(window, 'resize', debounce((e) => {
            let isTablet = e.target.innerWidth < 768 ? true : false;
            if(this.state.isTablet !==  isTablet ) this.setState({isTablet})
          }, 200, false), false)
        );
    this.doAtDidMount.forEach(func => func());
  }

  setSubmit(input){
    this.doAtDidMount.push();
  }

  componentWillUnmount(){ 
    this.removeMe.forEach(removeEventListener => removeEventListener())
  }

  state = {
    redirectToReferrer: false,
    isTablet: false
  }

  login = (e) => {
    console.log(e);
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

    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }

    return (
      (redirectToReferrer) ? <Redirect to={from} /> :
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
                  <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img className="f f-align-1-2 u-mx-auto"  src={fb} alt="fb"/></button>
                  <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block google-color"><img className="f f-align-1-2  u-mx-auto"  src={google} alt="google"/></button>
                </div>
                <div className="registform-delimiter " ><span>или</span></div>

                {/* Login Form */}
                <TxForm submit={this.login} >
                  <TxInput ref='name' tabIndex='1' setFocusToInput={true} type="email" name="email" validate={['email', 'required']}   className="field-block u-mb-3" placeholder="Email"/>
                  <TxInput type="password" name="password" validate={[{'minLength':6}, 'required']}  className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Войти"/>
                </TxForm>

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