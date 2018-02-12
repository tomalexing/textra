import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import logo from './assets/logo.png';
import logo2x from './assets/logo-2x.png';


export default class About extends React.Component {

  render() {
    return <div className="page-layout f f-col">
        <Header currentRole={this.props.currentRole} />
        <div className="container f-v-gap-2 f-gap-5 u-mt-10">
          <h1 className="h1-big u-my-5 u-text-center">
            <img src={logo} srcSet={`${logo2x} 2x, ${logo} 1x`} alt="Textra" />
          </h1>
          <p>
            <span className="u-inline h3">Textra</span> <span className="u-inline p-darken">
              - это сервис быстрых профессиональных переводов онлайн.
            </span>
          </p>
          <p>
            Отправляя текст на перевод, Вы можете быть уверены, что выполнение Вашего заказа начнется немедленно, а результат не заставит себя долго ждать.
          </p>
          <p>
            Стоимость размещения заказа составляет <span className="u-text-font__bold" >5 грн</span>. Стоимость перевода <span className="u-text-font__bold" >1 символа – 10 коп</span> (страницы формата <span className="u-text-font__bold" > А4 ~ 180 грн</span>).
          </p>
          <p>В режиме бета-версии, график работы сервиса Textra следующий:</p>
          <p style={{"marginBottom":'-10px', "marginTop":'-10px'}}>Пн - Сб: <span className="u-text-font__bold">с 9.00 до 21.00</span></p>
          <p>Вс - <span className="u-text-font__bold" >выходной</span></p>
          <p>
            Если у Вас возникли какие-либо отзывы, пожелания или предложения – отправьте нам сообщение через форму обратной связи в разделе «ПОДДЕРЖКА» или на адрес: <a href="mailto:hello@textra.io">
              hello@textra.io
            </a>
          </p>
        </div>
        <Footer />
      </div>;
  }
}
