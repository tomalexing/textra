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
            <h2 className="u-inline h3">Textra</h2> <p className="u-inline p-darken">
              - это сервис быстрых профессиональных переводов онлайн.
            </p>
          </p>
          <p>
            Отправляя текст на перевод, Вы можете быть уверены, что
            выполнение Вашего заказа начнется немедленно, а результат не
            заставит себя долго ждать.
          </p>
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
