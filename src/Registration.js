import React from 'react';
import {fakeAuth} from './index';
import mainbg from './assets/main.png';
import logo from './logo.svg';
import fb from './assets/fb.svg';
import google from './assets/google.svg';

import TxInput from './components/TxInput';
import TxForm from './components/TxForm';
import { getUniqueKey } from './utils'
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
    console.log('registretion')
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }
  

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const bgPic = {
      backgroundImage : `url(${mainbg})`
    }
    let ukey = getUniqueKey('for-input');
    return (
      (this.state.redirectToReferrer) ? <Redirect to={from} /> :
      <div className="f outer">
        <div className="f f-align-2-2 main" style={bgPic}>
            <div className="f f-col main-regist__form">
              <p className="u-mb-1" >Войти</p>
              <div className="f f-gap-2 registform-regist__social">
                <button onClick={this.loginFb} className="btn btn-primiry btn-normal btn-block fb-color"><img src={fb} alt="fb"/></button>
                <button onClick={this.loginVk} className="btn btn-primiry btn-normal btn-block google-color"><img className="f f-align-1-2  u-mx-auto"  src={google} alt="google"/></button>
              </div>
                <div className="registform-delimiter " ><span>или</span></div>

               {/* Login Form */}
                <TxForm submit={this.login} >
                  <TxInput tabIndex='1' type="email" name="email" validate={['email', 'required']}  setFocusToInput={true}  className="field-block u-mb-3" placeholder="Email"/>
                  <TxInput tabIndex='1' type="password" name="password" validate={[{'minLength':6}, 'required', {'emit': `${ukey}-password`} ]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Пароль"/>
                  <TxInput tabIndex='1' type="password" validate={[{'minLength':6}, 'required', {'listen': `${ukey}-password`}]} ukey={`${ukey}-password`} className="field-block  u-my-3" placeholder="Повторить пароль"/>
                  <TxInput tabIndex='1' type="submit" autoValidate={false} className="btn btn-primiry btn-normal btn-block"   value="Зарегистрироваться"/>
                </TxForm>

              <div className="u-mt-1 registform-textlink">Регистрируясь, вы принимаете <Link to='/' className="registform-textlink__blue u-text-undecor" >пользовательское соглашение</Link></div>
            </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Login); 