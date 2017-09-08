import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"
import dashboard from "./assets/dashboard.png";
import translator from "./assets/translator.png";
import service1 from "./assets/service1.svg";
import service2 from "./assets/service2.svg";

export default class Landing extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }


  render() {
    return (
    <div className="landing-layout">
        <Header currentRole={this.props.currentRole}/>
        <div className="intro-block">
              <div className="container f f-col f-align-2-2 stuff">
                  <div className="text-center">
                    <h1 className="h1-big text-white text-header">Textra – онлайн-сервис быстрых ручных переводов</h1>
                    <p className="text-white text-subheader">Узнайте о возможностях сервиса быстрых онлайн-переводов и начните получать переводы уже сейчас.</p>
                  </div>
                  <div className="intro-block__featurePic">
                    <img src={dashboard} alt="Textra dashboard"/>
                  </div>
              </div>
        </div>
        <div className="service-block">
              <div className="container f f-row f-align-2-2">
                  <div className="f f-align-2-2  service-block__featurePic">
                    <img src={service1} alt="Textra service1"/>
                  </div>
                  <div className="f f-align-2-2 f-col service-block__description">
                      <div className="text-moduleCenter">  
                        <h1 className="h1 text-header"><span className="text-highLight">Переводи</span> любой текст быстро и качественно</h1>
                        <p className="text-subheader">После регистрации у вас будет возможность получать быстрые переводы. Отправляейте запрос на перевод текста с любой точки платнеты и получайте быстрые переводы текстов от квалифицированных переводчиков.  </p>
                      </div>
                  </div>
              </div>
        </div>
        <div className="intro2-block">
              <div className="container f f-col f-align-2-2 stuff">
                  <div className="text-center">
                    <h1 className="h1 text-header"><span className="text-highLight">Маркетплейс</span> для переводчиков</h1>
                    <p className="text-subheader">После регистрации как переводчик высможете зарабатывать в любом месте. Отправляейте запрос.</p>
                  </div>
                  <div className="intro2-block__featurePic">
                    <img src={translator} alt="Textra dashboard-translator"/>
                  </div>
              </div>
        </div>
        <div className="service-block">
            <div className="container f f-row f-align-2-2">
              <div className="f f-align-2-2 f-col service-block__description">
                    <div className="text-moduleCenter">  
                      <h1 className="h1 text-header"><span className="text-highLight">Удобный</span> кросс-браузерный адаптивный интерфейс</h1>
                      <p className="text-subheader">Зарабатывай в системе с любого места на планете. Все, что для этого нужно, мобильный телефон или компьютер с доступом в интернет.</p>
                    </div>
              </div>
              <div className="f f-align-2-2  service-block__featurePic">
                <img src={service2} alt="Textra service2"/>
              </div>
            </div>
        </div>
        <Footer/>
    </div>)
  }
}
