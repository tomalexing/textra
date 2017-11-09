import React from 'react';
import Auth from './store/AuthStore.js';
import mainbg from './assets/main.png';
import logo from './logo.svg';
import fb from './assets/fb.svg';
import google from './assets/google.svg';
import warningMark  from './assets/warning.svg'
import TxInput from './components/TxInput';
import TxForm from './components/TxForm';
import { getUniqueKey, hasClass, addClass, removeClass } from './utils';
import {
//   BrowserRouter as Router,
//   Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { dump } from './utils';
import {TxRest} from './services/Api.js';
import FacebookLogin from './components/FacebookLogin';
import GoogleLogin from './components/GoogleLogin';

class SignUp extends React.Component {
  constructor(p){
    super(p);
    this.errorField = null;
    this.errorFieldIn = null;
    this._getErrorField = this._getErrorField.bind(this);
    this.loginGoog = this.loginGoog.bind(this);
    this.loginFb = this.loginFb.bind(this);
  }

  state = {
    redirectToReferrer: false
  }

  login = async (e, _ , form) => {
        let data = await TxRest.getDataByID('signUp', form)
        if(data.message){
          let errors = `<p><img src=${warningMark} alt='warning'/> ${data.message}</p>`;
          if(this.errorFieldIn) this.errorFieldIn.parentNode.innerHTML = ''; // clean UP
          this.errorFieldIn = this.errorField.insertAdjacentElement('beforeend' , document.createElement('div'));
          this.errorFieldIn.innerHTML = errors; // new Error from Server
        }else{
          if(this.errorFieldIn) this.errorFieldIn.innerHTML = ''; // clean UP
          let _self = this;
          Auth.authorize(() => {
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

  componentWillUnmount(){
    this.errorField = null;
    this.errorFieldIn = null;
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
    let [first_name, arrayLastName ] = name.split(' ');
    let form = {access_token: accessToken,
                facebook_id: userID, 
                email,
                first_name,
                last_name: '' + arrayLastName,
                image: 'https://graph.facebook.com/' + userID + '/picture'};
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
    const { from } = this.props.location.state || { from: { pathname: '/login' } }
    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }
    let ukey = getUniqueKey('for-input');
    return (
      (this.state.redirectToReferrer) ? <Redirect to={from} /> :
      <div className="f outer signup-layout">
        <div className="f f-align-13-2 main" style={bgPic}>
            <div className="f f-col main-regist__form">
              <p className="h3 u-mb-3" >Регистрация</p>
              <p className="u-mb-4">У Вас уже есть аккаунт?{(
                    <Link tabIndex="1" to="/login" className="btn btn-flat">Войти</Link>
              )}</p>
              <div className="f f-gap-2 registform-regist__social">
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
              </div>
                <div className="registform-delimiter " ><span>или</span></div>

               {/* SignUp Form */}
                <TxForm submit={this.login} getErrorField={this._getErrorField} >
                  <TxInput tabIndex='1' type="text" name="first_name" validate={['required']}  setFocusToInput={true}  className="field-block u-mb-3" placeholder="Ваше Имя"/>
                   <TxInput tabIndex='1' type="text" name="last_name" validate={['required']}    className="field-block u-mb-3" placeholder="Ваша Фамилия"/>
                  <TxInput tabIndex='1' type="email" name="email" validate={['email', 'required']}    className="field-block u-mb-3" placeholder="Email"/>
                  <TxInput tabIndex='1' type="password" name="password" validate={[{'minLength':6}, 'lettercontain', 'numbercontain', 'required', {'emit': `${ukey}-password`} ]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput tabIndex='1' type="password" name="confirm_password" validate={['required', {'listen': `${ukey}-password`}]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Повторить пароль"/>
                  <TxInput tabIndex='1' type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Зарегистрироваться"/>
                </TxForm>

              <div className="registform-textlink">Регистрируясь, вы принимаете <Link tabIndex="1" to='/' className="registform-textlink__blue u-text-undecor" >пользовательское соглашение</Link></div>
            </div>
        </div>
      </div>
    )
  }
}
export default withRouter(SignUp); 