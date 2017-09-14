import React, { Component } from "react";
import { Link } from "react-router-dom";
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
    email: ''
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

  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    let {email} = this.state;
    return (
    <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-2 f-gap-15 u-mt-10">
            <h1 className="h2 text-header">Восстановление пароля</h1>
            <p>Для восстановления вашего доступа к сервису Textra.com, пожалуйста, введите полный адрес электронной почты (email), который вы используете для входа на портал.</p>
            <form onSubmit={this.onSubmit}>
              <h3 className="h3 u-mt-4 u-mb-2">Введите email * </h3>
              <input name="email" type="text" style={{width: "100%"}} onChange={this.onInput} value={email} placeholder="Введите email в формате name@textra.com" />
              <input type="submit" value='Восстановить' style={{float: "right"}} className={'submit-post btn btn-primiry  u-my-4  btn-mini'}/>
              </form>
        </div>
        <Footer/>
    </div>)
  }
}
