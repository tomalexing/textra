import React from 'react';
import Auth from './store/AuthStore.js';
import mainbg from './assets/main.png';
import logo from './assets/logo.png';
import fb from './assets/fb.svg';
import google from './assets/google.svg';
import warningMark  from './assets/warning.svg';
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
import FacebookLogin from './components/FacebookLogin';
import GoogleLogin from './components/GoogleLogin';
import {TxRest} from './services/Api.js'

class Login extends React.Component {

  constructor(props){
    super(props);
    this.removeMe = [];
    this.doAtDidMount = [];
    this.login = this.login.bind(this);
    this.loginGoog = this.loginGoog.bind(this);
    this.loginFb = this.loginFb.bind(this);
    this.errorField = null;
    this.errorFieldIn = null;
    this._getErrorField = this._getErrorField.bind(this)
  }

  componentWillMount(){
    console.log( process.env.NODE_ENV )
  }

  state = {
    redirectToReferrer: false,
    isTablet: false
  }

  componentDidMount(){
    this.removeMe.push(
          listener(window, 'resize', debounce((e) => {
            let isTablet = e.target.innerWidth <= 768 ? true : false;
            if(this.state.isTablet !==  isTablet ) this.setState({isTablet})
          }, 200, false), false)
        );
    if(window.innerWidth <= 768) {
      console.log('768')
      this.setState({ isTablet: true })
    }
    this.doAtDidMount.forEach(func => func());

  }

  setSubmit(input){
    this.doAtDidMount.push();
  }

  componentWillUnmount(){ 
    this.removeMe.forEach(removeEventListener => removeEventListener())
  }

  login = async (e, _ , form) => {
    let data = await TxRest.getDataByID('signIn', form)
    if(data.errors){
      let errors = Object.values(data.errors).reduce((acc, item) => {
        return Array.isArray(item)?
        acc.concat( item.map(value => `<p><img src=${warningMark} alt='warning'/> ${value.message}</p>`))
        : 
        acc.concat( `<p><img src=${warningMark} alt='warning'/> ${item}</p>`)
      },[])
      if(this.errorFieldIn) this.errorFieldIn.parentNode.innerHTML = ''; // clean UP
      this.errorFieldIn = this.errorField.insertAdjacentElement('beforeend' , document.createElement('div'));
      this.errorFieldIn.innerHTML = errors; // new Error from Server
    }else{
      if(this.errorFieldIn) this.errorFieldIn.innerHTML = ''; // clean UP
      let _self = this;
      Auth.authenticate(() => {
        _self.setState({ redirectToReferrer: true })
      }, data)
    }
  }

  _getErrorField(errorField){
    this.errorField = errorField;
  }

  switchPanel = (e) => {
    !hasClass(this.toggleElem, 'toggled') ? addClass(this.toggleElem, 'toggled'): removeClass(this.toggleElem, 'toggled');
  }

  loginGoog = (info) => {

    // try {
    //   fetch('/login', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(info)
    //   }).then(response => {
    //     return response.json();
    //   }).then(data => {
    //     if (data.err) throw Error(data.err);
    //   })
    // }
    // catch (err) {
    //   console.trace(err.stack)
    // }

    console.log(info);

  }

  loginFb = (info) => {

        // try {
        //   fetch('/login', {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(info)
        //   }).then(response => {
        //     return response.json();
        //   }).then(data => {
        //     if (data.err) throw Error(data.err);
        //   })
        // }
        // catch (err) {
        //   console.trace(err.stack)
        // }
  

      console.log(info);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }

    return (
      (redirectToReferrer) ? <Redirect to={from} /> :
      <div className="f outer login-layout">
        <div className="f f-align-2-2 outer-left">
          <div className="f sidebar">
              <div className="f f-align-2-2 sidebar-regist__logo">
                <Link to={'/'} ><img src={logo} alt="Textra"/> </Link>
              </div>
              <div className="f f-col registform">
                <h3 className="u-mb-5 u-text-center" >Войти</h3>
                <p className="u-mb-4"> Нужен акакаунт? {(
                  this.state.isTablet ? (
                      <button className="btn btn-flat" onClick={debounce(this.switchPanel.bind(this),500,false)} > Создать аккаунт</button>
                    ):(
                      <Link to="/registration" className="btn btn-flat"> Создать аккаунт</Link>
                    )
                )}</p>
                <div className="f f-gap-2 registform-regist__social"> 
                  {/* <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img className="f f-align-1-2 u-mx-auto"  src={fb} alt="fb"/></button> */}
                  <FacebookLogin
                    appId={ process.env.NODE_ENV == 'development' ? "761774717317607" : "1658887587468539" }  // for localhost and textra.iondigi.com
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="public_profile,email,user_birthday"
                    callback={this.loginFb}
                    textButton={''}
                    cssClass="btn btn-primiry btn-normal btn-block fb-color"
                    icon={<img className="f f-align-1-2 u-mx-auto"  src={fb} alt="fb"/>}
                  />

                  <GoogleLogin
                    clientId={ process.env.NODE_ENV == 'development'
                      ? "960245280639-apkq5ilofburuimjtte66313b9r41a44.apps.googleusercontent.com" 
                      : "592190753761-7h6mnscbc9vjlegb899ikgm07agdh8lv.apps.googleusercontent.com"} // for localhost and textra.iondigi.com
                    autoLoad={false}
                    cookiePolicy={'none'}
                    onSuccess={this.loginGoog}
                    textButton={''}
                    hostedDomain={''}
                    onFailure={this.loginGoog}
                    cssClass="btn btn-primiry btn-normal btn-block google-color"
                    icon={<img className="f f-align-1-2  u-mx-auto"  src={google} alt="google"/>}
                  />
                  {/* <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block google-color"><img className="f f-align-1-2  u-mx-auto"  src={google} alt="google"/></button> */}
                </div>
                <div className="registform-delimiter " ><span>или</span></div>

                {/* Login Form */}
                <TxForm submit={this.login} getErrorField={this._getErrorField}>
                  <TxInput ref='name' tabIndex='1' setFocusToInput={true} type="email" name="email" validate={['email', 'required']}   className="field-block u-mb-3" placeholder="Email"/>
                  <TxInput type="password"tabIndex='1' name="password" validate={[{'minLength':6}, 'required']}  className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Войти"/>
                </TxForm>

                <p className="f f-align-3-3 u-mt-1">Забыли пароль?</p>
                <div id="status"></div>
              </div>
          </div>
        </div>
        <div className="f outer-right" ref={n => this.toggleElem = n}>
          <Link to={'/signup'}className="main f f-col f-fill f-align-2-2 u-text-undecor"  style={bgPic}>
            <div className="main-toregister">
                  <div className="main-regist__mini" >
                    <h1 className="h3 u-mb-1" >
                        Нет аккаунта? <br/>
                        Присоединяйтесь к нам!
                    </h1>
                    <p className="u-mb-2">После регистрации у вас будет возможность получать быстрые переводы </p>
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