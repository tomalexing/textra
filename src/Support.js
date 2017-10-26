import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import formSerialize from 'form-serialize';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import icon_arrow from './assets/arrow-down.png';
import {TxRest} from './services/Api.js';
import TxInput from './components/TxInput.js';
import TxForm from './components/TxForm.js';
import Auth from './store/AuthStore.js';

export default class Support extends React.Component {
  constructor(p){
    super(p)
    this.updateValue = this.updateValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this._isMounted = false;
    this.isAuthenticated =  Auth && Auth.isAuthenticated;
  }
  state={
    value: undefined,
    options: [{
      value: 0,
      label: 'Стать переводчиком'
    },{
      value: 1,
      label: 'Отзыв'
    },{
      value: 2,
      label: 'Прочее'
    }
    ],
    redirectToReferrer: false
  }
  componentDidMount() {
    this._isMounted = true;
    window.scrollTo(0, 0);
  }

  updateValue(value){
    if(!this._isMounted) return
    this.setState({value})
  }

  onSubmit(e, _ ,form){

    e.preventDefault();
    let _self = this, additionalRoute = '';
    let {comment, option, email} = form;

    if(email) additionalRoute = '/unauthorized';

    TxRest.putData(`request${additionalRoute}`, {
      type: option && option.toString() || '2',
      message: comment,
      email
    }).then(_ => {
        _self.setState({ redirectToReferrer: true})
    })

  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  onMessage({target: {value}}){
    if(!this._isMounted) return
    this.setState({comment:value})
  }

  arrowElementLangs({ isOpen }) {
    if (isOpen)
      return <img style={{ transform: 'rotate(-90deg)' }} src={icon_arrow} />
    else
      return <img style={{ transform: 'rotate(90deg)' }} src={icon_arrow} />
  }

  render() {
    let {value, clearComment, options, redirectToReferrer} = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } }    
    return (
    (redirectToReferrer) ? <Redirect to={from} /> :
    <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-2 f-gap-5 u-mt-10">
            <h1 className="h1-big u-my-5 u-text-center">Как мы можем помочь Вам?</h1>
            <h1 className="h2 text-header">Оставьте заявку или задайте нам вопрос</h1>
            <p>Если Вы желаете стать переводчиком нашего сервиса, то можете оставить заявку. Мы обязательно рассмотрим ее в кротчайшие сроки и свяжемся с Вами. Если же Вы хотите оставить отзыв или задать вопрос, то можете сделать это в поле ниже. Мы с радостью поможем Вам.</p>
            {this.isAuthenticated &&
              <TxForm submit={this.onSubmit} innerErrorFielsType={true} formClass=""> 

                <h3 className="h3 u-mt-4 u-mb-2">Выберите тип заявки *</h3>
                <Select
                  name="option"
                  placeholder="Выбрать"
                  autofocus
                  options={options}
                  disabled={false}
                  simpleValue
                  value={value}
                  onChange={this.updateValue}
                  searchable={false}
                  autosize={true}
                  clearable={false}
                  arrowRenderer={this.arrowElementLangs} />

                  <h3 className="h3 u-mt-4 u-mb-2">Опишите детально Ваш вопрос *</h3>
                  {/* <textarea name="comment" type="text" onChange={this.onMessage} value={comment} placeholder="Комментарий пользователя">
                  </textarea> */}
                  <TxInput tag="textarea" type="text" name="comment" validate={[{'minLength':1},'required']}  className="field-block" placeholder="Комментарий пользователя"/>
                
                <TxInput type="submit" autoValidate={false}  value='Отправить' style={{float: "right"}} className={'submit-post btn btn-primiry btn-mini'}/>
              </TxForm>}

            {!this.isAuthenticated &&
              <TxForm submit={this.onSubmit} innerErrorFielsType={true} formClass=""> 

                  <h3 className="h3 u-mt-4 u-mb-2">Выберите тип заявки *</h3>
                  <Select
                    name="option"
                    placeholder="Выбрать"
                    autofocus
                    options={options}
                    disabled={false}
                    simpleValue
                    value={value}
                    onChange={this.updateValue}
                    searchable={false}
                    autosize={true}
                    clearable={false}
                    arrowRenderer={this.arrowElementLangs} />

                  <h3 className="h3 u-mt-4 u-mb-2">Ваш email *</h3>
                  <TxInput type="email" name="email" validate={['email', 'required']} className="field-block" placeholder="Email"/>
                  
                  <h3 className="h3 u-mt-4 u-mb-2">Опишите детально Ваш вопрос *</h3>
                  <TxInput tag="textarea" type="text" name="comment" validate={[{'minLength':1},'required']} {...clearComment&&{value:''}}  className="field-block" placeholder="Комментарий пользователя"/>
                  
                  <TxInput type="submit" autoValidate={false}  value='Отправить' style={{float: "right"}} className={'submit-post btn btn-primiry btn-mini'}/>
                </TxForm>}
        </div>
        <Footer/>
    </div>)
  }
}
