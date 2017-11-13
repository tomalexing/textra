import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import logo from './assets/logo.png';
import logo2x from './assets/logo-2x.png';


export default class About extends React.Component {

  render() {
    return (
    <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-2 f-gap-5 u-mt-10">
            <h1 className="h1-big u-my-5 u-text-center"><img src={logo} srcSet={`${logo2x} 2x, ${logo} 1x`} alt="Textra"/></h1>
            <p><h2 className="u-inline-block h3">Textra</h2> - это сервис быстрых профессиональных переводов, рассчитанный на тексты объемом до
            1 страницы.</p>
            <p><h2 className="u-inline-block h3">Наша миссия</h2> - обеспечить вас и ваш бизнес высококлассным качеством перевода текста не про-
            сто в сжатые сроки, а прямо «на сейчас».</p>
            <p>Отправляя свой текст на перевод, вы можете быть уверены в том, что ваш заказ будет принят и
            обработан в ту же минуту, а результат не заставит себя долго ждать.</p>
            <p>Если у вас возникли какие-либо отзывы, пожелания или предложения - отправьте нам сообщение
            через форму обратной связи в разделе «Поддержка» или на адрес: <a href="mailto:hello@textra.io">hello@textra.io</a></p>

        </div>
        <Footer/>
    </div>)
  }
}
