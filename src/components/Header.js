import React from 'react';
import { Link} from 'react-router-dom';
import logo from './../assets/logo.png';
import avatar from './../assets/default-avatar.png';


const Header = () => (
  <header className="f main__header">
    <div className="f f-align-2-2 header-logo">
      <Link to={'/'} ><img src={logo} alt="Textra" /> </Link>
    </div>
    <ul className="f f-align-2-2 header-menu">
      <NavLink className={'active'} to={'/'} >Рабочий стол</NavLink>
      <NavLink to={'/about'}>О нас</NavLink>
      <NavLink to={'/help'}>Поддержка</NavLink>
    </ul>
    <div className="f f-align-2-2 header-account">
      <div className="f f-col f-align-1-3 header-details">
        <div className="header-email">mikehanser@gmail.com</div>
        <div className="header-details__more">
          <Link to={'/'} className="header-replenish">пополнить</Link>
          <span className="header-balance">$0.91</span>
        </div>
      </div>
      <div className="f f-align-2-2 header-avatar">
        <figure className="f f-align-2-2 header-avatar__in"> <img src={avatar} alt="Textra" /> </figure>
        <div className="header-logout">Выйти</div>
      </div>
    </div>
  </header>
);

export const NavLink = (props) => (
  <li >
    <Link {...props} />
  </li>
)

export default Header;