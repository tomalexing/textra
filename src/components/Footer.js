import React from "react";
import { Link } from "react-router-dom";
import f from "./../assets/f.svg";
import tw from "./../assets/tw.svg";
import ln from "./../assets/ln.svg";
import insta from "./../assets/insta.svg";

export const Footer = () => { 
    let now = new Date();
    return <div className="footer f f-align-13-2">
        <div className="f f-align-1-2">
          <p> © { now.getFullYear() } Textra. Все права защищены. <Link className="text-highLight" to="/private">
            Правила пользования и политика конфиденциальности
            </Link>
          </p>
        </div>
        <ul className="footer__social f f-align-3-2">
          <li>
            <a href="https://www.facebook.com/textra.io/" rel="noopener noreferrer" target="_blank">
              <img src={f} alt="facebook" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/textra.io/" rel="noopener noreferrer" target="_blank">
              <img src={insta} alt="instagram" />
            </a>
          </li>
        </ul>
      </div>;
}
