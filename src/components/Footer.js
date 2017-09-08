import React, { Component } from "react";
import { Link } from "react-router-dom";
import f from "./../assets/f.svg";
import tw from "./../assets/tw.svg";
import ln from "./../assets/ln.svg";
import insta from "./../assets/insta.svg";

export const Footer = () => { 
    return(<div className="footer f f-align-13-2">
        <div className="f f-align-1-2">
        <p >© 2017 Textra. Все права защищены. <Link className="text-highLight" to="/private">Политика конфиденциальности</Link> и  <Link className="text-highLight"  to="/term-of-use">Правила использования.</Link></p>
        </div>
        <ul className="footer__social f f-align-3-2">
        <li><a href="http://facebook.com" target="_blank"><img src={f} alt="facebook"/></a></li>
        <li><a href="http://twitter.com" target="_blank"><img src={tw} alt="twitter"/></a></li>
        <li><a href="http://linkedin.com" target="_blank"><img src={ln} alt="linkedin"/></a></li>
        <li><a href="http://instagram.com" target="_blank"><img src={insta} alt="instagram"/></a></li>
        </ul>
    </div>)
}
