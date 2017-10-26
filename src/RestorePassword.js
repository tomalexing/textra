import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import formSerialize from 'form-serialize';
import {TxRest} from './services/Api.js';

export default class RestorePassword extends React.Component {
  constructor(p){
    super(p)
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this._isMounted = false;
  }

  state={
    email: '',
    redirectToReferrer: false,
    showOk: false,
    showNotOf : false,
    notOkMessage: ''
  }

  componentDidMount() {
    this._isMounted = true;
    window.scrollTo(0, 0);
  }

  onInput({target:{value}}){
    if(!this._isMounted) return
    this.setState({email:value})
  }

  onSubmit(e){
    e.preventDefault();
    let _self = this;
    let { email } = formSerialize(e.target, { hash: true, empty: true });
    TxRest.getDataByID('resetPassword', {email})
        .then(data => {

          if(data.message)
            _self.setState({ showOk: false, showNotOk: true, notOkMessage: data.message});

          if(!data.message) {
            _self.setState({ showOk: true, showNotOk: false});
            setTimeout(() => _self.setState({ redirectToReferrer: true}), 5000);
          }
        })
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    let {email, redirectToReferrer, showOk, showNotOk, notOkMessage} = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } }        
    return (
    (redirectToReferrer) ? <Redirect to={from} /> :
    <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-2 f-gap-5 u-mt-10">
            <h1 className="h2 text-header">Восстановление пароля</h1>
            <p>Для восстановления вашего доступа к сервису Textra.com, пожалуйста, введите полный адрес электронной почты (email), который вы используете для входа на портал.</p>
            <form onSubmit={this.onSubmit}>
              <h3 className="h3 u-mt-4 u-mb-2">Введите email * </h3>
              <input name="email" type="text" style={{width: "100%"}} onChange={this.onInput} value={email} placeholder="Введите email в формате name@textra.com" />
              <input type="submit" value='Восстановить' style={{float: "right"}} className={'submit-post btn btn-primiry  u-my-4  btn-mini'}/>
              </form>
        </div>
        { showOk && 
            <div className={'f f-align-2-2 u-mx-2 page-layout-info '}>
              <div className={'f f-align-2-2 page-layout-info__exclamation info__exclamation--info'}>i</div>
              <div className={'f f-align-1-2  page-layout-info__message '}>{`
                  Вам отправлено письмо с новым паролем на указаный Вами email.
                `}
              </div>
            </div>
        }
        { showNotOk &&
          <div className={'f f-align-2-2  u-mx-2 page-layout-info '}>
            <div className={'f f-align-2-2 page-layout-info__exclamation info__exclamation--caution'}>i</div>
            <div className={'f f-align-1-2 page-layout-info__message '}>{`${notOkMessage}`}</div>
          </div>
        }
        <Footer/>
    </div>)
  }
}
