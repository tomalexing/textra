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

class SignUp extends React.Component {
  constructor(p){
    super(p);
    this.errorField = null;
    this.errorFieldIn = null;
    this._getErrorField = this._getErrorField.bind(this)
  }

  state = {
    redirectToReferrer: false
  }

  login = async (e, _ , form) => {
        let data = await TxRest.getDataByID('signUp', form)
        if(data.errors){
          let errors = Object.values(data.errors).reduce((acc, item) =>
            acc.concat( item.map(value => `<p><img src=${warningMark} alt='warning'/> ${value.message}</p>`))
          ,[])
          if(this.errorFieldIn) this.errorFieldIn.parentNode.innerHTML = ''; // clean UP
          this.errorFieldIn = this.errorField.insertAdjacentElement('beforeend' , document.createElement('div'));
          this.errorFieldIn.innerHTML = errors; // new Error from Server
        }else{
          if(this.errorFieldIn) this.errorFieldIn.innerHTML = ''; // clean UP
          Auth.authorize(() => {
            this.setState({ redirectToReferrer: true })
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
  
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }
    let ukey = getUniqueKey('for-input');
    return (
      (this.state.redirectToReferrer) ? <Redirect to={from} /> :
      <div className="f outer signup-layout">
        <div className="f f-align-2-2 main" style={bgPic}>
            <div className="f f-col main-regist__form">
              <p className="u-mb-1" >Войти</p>
              <div className="f f-gap-2 registform-regist__social">
                <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img src={fb} alt="fb"/></button>
                <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block google-color"><img className="f f-align-1-2  u-mx-auto"  src={google} alt="google"/></button>
              </div>
                <div className="registform-delimiter " ><span>или</span></div>

               {/* Login Form */}
                <TxForm submit={this.login} getErrorField={this._getErrorField} >
                  <TxInput tabIndex='1' type="text" name="first_name" validate={['required']}  setFocusToInput={true}  className="field-block u-mb-3" placeholder="Ваше Имя"/>
                   <TxInput tabIndex='1' type="text" name="last_name" validate={['required']}    className="field-block u-mb-3" placeholder="Ваша Фамилия"/>
                  <TxInput tabIndex='1' type="email" name="email" validate={['email', 'required']}    className="field-block u-mb-3" placeholder="Email"/>
                  <TxInput tabIndex='1' type="password" name="password" validate={[{'minLength':6}, 'lettercontain', 'numbercontain', 'required', {'emit': `${ukey}-password`} ]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput tabIndex='1' type="password" name="confirmPassword" validate={['required', {'listen': `${ukey}-password`}]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Повторить пароль"/>
                  <TxInput tabIndex='1' type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Зарегистрироваться"/>
                </TxForm>

              <div className="u-mt-1 registform-textlink">Регистрируясь, вы принимаете <Link to='/' className="registform-textlink__blue u-text-undecor" >пользовательское соглашение</Link></div>
            </div>
        </div>
      </div>
    )
  }
}
export default withRouter(SignUp); 