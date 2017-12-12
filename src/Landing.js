import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import dashboard from "./assets/dashboard.png";
import dashboard2x from "./assets/dashboard-2x.png";
import translator from "./assets/translator.png";
import translator2x from "./assets/translator-2x.png";
import service1 from "./assets/service1.png";
import service2 from "./assets/service2.png";
import service12x from "./assets/service1-2x.png";
import service22x from "./assets/service2-2x.png";

export default class Landing extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  
  render() {
    return <div className="landing-layout">
        <Header currentRole={this.props.currentRole} />
        <div className="intro-block">
          <div className="container f f-col f-align-2-2 stuff intro-block__background">
            <div className="text-center">
              <h1 className="h1-big text-white text-header">
                TEXTRA – Ваш личный профессиональный переводчик онлайн!
              </h1>
              <p className="text-white text-subheader">
                Откройте для себя возможности сервиса быстрых
                онлайн-переводов и решите для себя вопрос с профессиональным
                переводом текста прямо сейчас!
              </p>
            </div>
            <div className="intro-block__featurePic">
              <img srcSet={`${dashboard2x} 2x, ${dashboard} 1x`} src={dashboard} alt="Textra dashboard" />
            </div>
          </div>
        </div>
        <div className="service-block">
          <div className="container f f-row f-align-2-2">
            <div className="f f-align-2-2  service-block__featurePic">
              <img srcSet={`${service12x} 2x, ${service1} 1x`} src={service1} alt="Textra service1" />
            </div>
            <div className="f f-align-2-2 f-col service-block__description">
              <div className="text-moduleCenter">
                <h2 className="h1 text-header">
                  <span className="text-highLight">Доверьте </span> перевод своего текста профессионалам и получите результат гарантировано быстро.
                </h2>
                <p className="text-subheader">
                  Наши квалифицированные переводчики приступают к работе
                  сразу же после получения заказа, что значительно экономит
                  Ваше время. А создавать заказы также просто, как общаться
                  в мессенджере.
                </p>
                <p className="text-subheader">
                  Стоимость размещения заказа составляет 10 грн. Стоимость
                  перевода 1 символа – 15 коп (страницы формата А4 ~ 270
                  грн).
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="intro2-block">
          <div className="container f f-col f-align-2-2 stuff">
            <div className="text-center">
              <h2 className="h1 text-header">
              <span className="text-highLight">Зарабатывайте </span> с Textra!
              </h2>
              <p className="text-subheader">
                 Вы – профессиональный переводчик, которого интересует
                  гибкий график работы и стабильный доход? Будем рады
                  рассмотреть Вашу кандидатуру для работы в нашей системе.
                  Оставьте Вашу заявку в разделе «ПОДДЕРЖКА».
              </p>
            </div>
            <div className="intro2-block__featurePic">
              <img srcSet={`${translator2x} 2x, ${translator} 1x`} src={translator} alt="Textra dashboard-translator" />
            </div>
          </div>
        </div>
        <div className="service-block">
          <div className="container f f-row f-align-2-2">
            <div className="f f-align-2-2 f-col service-block__description">
              <div className="text-moduleCenter">
                <h2 className="h1 text-header u-text-right">
                <span className="text-highLight">Удобный </span>кросс-браузерный адаптивный интерфейс
                </h2>
                <p className="text-subheader u-text-right">
                  Пользуйтесь нашим сервисом в любом месте на планете. Все,
                  что для этого нужно – смартфон, планшет или компьютер.
                  
                </p>
              </div>
            </div>
            <div className="f f-align-2-2  service-block__featurePic">
              <img srcSet={`${service22x} 2x, ${service2} 1x`} src={service2} alt="Textra service2" />
            </div>
          </div>
        </div>
        <Footer />
      </div>;
  }
}
