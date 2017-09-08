import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import formSerialize from 'form-serialize';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import icon_arrow from './assets/arrow-down.png';

export default class Support extends React.Component {
  constructor(p){
    super(p)
    this.updateValue = this.updateValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this._isMounted = false;
  }
  state={
    value: 't',
    options: [{
      value: 't',
      label: 'Стать переводчиком'
    },{
      value: 'a',
      label: 'Жалоба'
    }
    ],
    comment: ''
  }
  componentDidMount() {
    this._isMounted = true;
    window.scrollTo(0, 0);
  }

  updateValue(value){
    if(!this._isMounted) return
    this.setState({value})
  }

  onSubmit(e){
    e.preventDefault();
    let {option, comment} = formSerialize(e.target, { hash: true, empty: true });
    console.log(option, comment)
    this.setState({value:'t', comment: ''})

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
    let {value, comment, options} = this.state;
    return (
    <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-2 f-gap-15 u-mt-10">
            <h1 className="h1-big u-my-5 u-text-center">Как мы можем помочь Вам?</h1>
            <h1 className="h2 text-header">Оставьте заявку или задайте нам вопрос</h1>
            <p>Если Вы желаете стать переводчиком нашего сервиса, то можете оставить заявку. Мы обязательно рассмотрим ее в кротчайшие сроки и свяжемся с Вами. Если же Вы хотите оставить отзыв или задать вопрос, то можете сделать это в поле ниже. Мы с радостью поможем Вам.</p>
            <form onSubmit={this.onSubmit}>
              <h3 className="h3  u-mt-4 u-mb-2">Выберите тип заявки * </h3>
              <Select
                name="option"
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
                <textarea name="comment" type="text" onChange={this.onMessage} value={comment} placeholder="Комментарий пользователя">
                </textarea>
                <input type="submit" value='Отправить'  style={{float: "right"}} className={'submit-post btn btn-primiry btn-mini'}/>
              </form>
        </div>
        <Footer/>
    </div>)
  }
}
