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
    console.log( process.env )
  }

  state = {
    redirectToReferrer: false,
    isTablet: false
  }

  componentWillMount(){
    if(Auth.isAuthenticated) this.setState({redirectToReferrer: true})
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
    if(data.message){
      let errors = `<p><img src=${warningMark} alt='warning'/> ${data.message}</p>`;
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

  loginGoog = async (info) => {
    let {accessToken, googleId, profileObj: { givenName, familyName, email, imageUrl } = {givenName:'', familyName:'', email: '', imageUrl: ''}} = info;
    if(!accessToken) return
    imageUrl = imageUrl.replace(/s\d{2,3}-c/,'s200-c');
    let form = {access_token: accessToken,
                google_id: googleId, 
                email, 
                first_name: givenName,
                last_name: familyName,
                image: imageUrl};

    let data = await TxRest.getDataByID('signInGoogle', form)
    if(data.message){
      let errors = `<p><img src=${warningMark} alt='warning'/> ${data.message}</p>`;
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

  loginFb = async (info) => {
    let {accessToken, userID, name, email} = info;
    if(!accessToken) return
    let form = {access_token: accessToken,
                facebook_id: userID, 
                email,
                first_name: name,
                image: 'https://graph.facebook.com/' + userID + '/picture?type=large'};
    let data = await TxRest.getDataByID('signInFacebook', form);
    if(data.message){
      let errors = `<p><img src=${warningMark} alt='warning'/> ${data.message}</p>`;
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
                <h3 className="h1 u-mb-5 u-text-center" >Войти</h3>
                <p className="u-mb-4"> Нужен акакаунт? {(
                    <Link to="/signup" className="btn btn-flat"> Создать аккаунт</Link>
                )}</p>
                <div className="f f-gap-2 registform-regist__social"> 
                  {/* <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img className="f f-align-1-2 u-mx-auto"  src={fb} alt="fb"/></button> */}
                  <FacebookLogin
                    appId={ process.env.NODE_ENV == 'development' ? "761774717317607" : "495884620782080" }  // for localhost and textra.iondigi.com
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
                  <TxInput type="password" tabIndex='1' name="password" validate={[{'minLength':6}, 'required']}  className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Войти"/>
                </TxForm>

                <Link to={'/restorepassword'} className="f f-align-3-3 registform__forgotpassword">Забыли пароль?</Link>
                <div id="status"></div>
              </div>
          </div>
        </div>
        <div className="f outer-right" ref={n => this.toggleElem = n}>
          <Link to={'/signup'} className="main f f-col f-fill f-align-2-2 u-text-undecor"  style={bgPic}>
            <div className="main-toregister">
                  <div className="main-regist__mini" >
                    <h1 className="h3 u-mb-2" >
                        Нет аккаунта? <br/>
                        Присоединяйтесь к нам!
                    </h1>
                    <p className="h4 u-mb-2">После регистрации у вас будет возможность получать быстрые переводы </p>
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