import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import logo from './../assets/logo.png';
import avatar from './../assets/default-avatar.png';
import {hasClass, addClass, removeClass, delegate} from './../utils';
import PropTypes from 'prop-types';

const isActive = (match, location,to) => {
  return ['/translator','/dashboard','/admin'].some(str => location.pathname.includes(str) )
}

const requestAnimationFramePromise = _ => new Promise(requestAnimationFrame);
const transitionEndPromise = elem => new Promise(resolve => {
  elem.addEventListener('transitionend', resolve, {once: true});
});


class Header extends React.Component{
  constructor(props){
    super(props);
    this.toggleMobileMenu =  this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.openMobileMenu = this.openMobileMenu.bind(this);
    this.closeListener = null;
  }

  state = {
    isMobileMenuOpened: false
  }

  closeMobileMenu = () => {
    
    this.mobile_menu.style.transition = 'opacity .3s';
    if(this.closeListener) this.closeListener();
    requestAnimationFramePromise()
      .then( _ => requestAnimationFramePromise())
      .then( _ => {
          if(!this.mobile_menu) return
          this.mobile_menu.style.opacity = 0;
          return transitionEndPromise(this.mobile_menu);
      })
      .then( _ => {
        if(!this.mobile_menu) return
        this.mobile_menu.style.display =  'none';
        this.setState({isMobileMenuOpened: false})
      });
  }

  openMobileMenu = () => {
    this.mobile_menu.style.transition = 'opacity .1s';
    this.mobile_menu.style.opacity = 0;
    this.mobile_menu.style.display = 'flex';
    requestAnimationFramePromise()
      .then( _ => requestAnimationFramePromise())
      .then( _ => {
          if(!this.mobile_menu) return
          this.mobile_menu.style.opacity = 1;
          return transitionEndPromise(this.mobile_menu);
      })
      .then( _ => {
        this.setState({isMobileMenuOpened: true},()=>{
           this.closeListener = delegate(window, 'touchend', 'body', this.closeMobileMenu, false, true)
        })
      });
  }

  toggleMobileMenu = (e) =>  {
    !this.state.isMobileMenuOpened?this.openMobileMenu():this.closeMobileMenu();
    let menuWrapper = e.currentTarget.parentElement;
    hasClass(menuWrapper,'opened')?removeClass(menuWrapper,'opened'):addClass(menuWrapper,'opened');
  }

  render(){
    return(  <header className="f main__header">
                <div className="f f-align-2-2 header-logo">
                  <Link to={'/'} ><img src={logo} alt="Textra" /> </Link>
                </div>
                <div className="f f-align-2-2 header-menu__mobile">
                  <button  ref={n => this.mobile_btn = n} className="f f-col f-align-2-2 header-menu__mobile__btn" onTouchEnd={this.toggleMobileMenu}>
                      <span></span>
                      <span></span>
                      <span></span>
                  </button>
                  <ul ref={n => this.mobile_menu = n} className="f f-col f-align-2-2 header-menu__mobile__in">
                    <NavLink to={'/translator'} comp={isActive}>Рабочий стол</NavLink>
                    <NavLink to={'/about'}>О нас</NavLink>
                    <NavLink to={'/help'}>Поддержка</NavLink>
                  </ul>
                </div>
                 <div className="f f-align-2-2 header-logo__mobile">
                  <Link to={'/'} ><img src={logo} alt="Textra" /> </Link>
                </div>
                <ul className="f f-align-2-2 header-menu">
                  <NavLink to={'/translator'} comp={isActive}>Рабочий стол</NavLink>
                  <NavLink to={'/about'}>О нас</NavLink>
                  <NavLink to={'/help'}>Поддержка</NavLink>
                </ul>
                <div className="f f-align-2-2 header-account">
                  {this.props.currentRole !== 'admin' &&  <div className="f f-col f-align-1-3 header-details">
                    <div className="header-email">mikehanser@gmail.com</div>
                    <div className="header-details__more">
                      <Link to={'/'} className="header-replenish">пополнить</Link>
                      <span className="header-balance">$0.91</span>
                    </div>
                  </div>}
                  <div className="f f-align-2-2 header-avatar">
                    <figure className="f f-align-2-2 header-avatar__in"> <img src={avatar} alt="Textra" /> </figure>
                    <div className="header-logout">Выйти</div>
                  </div>
                </div>  
            </header>
  );
  }
}

export const NavLink  = withRouter(({history, match, location, staticContext, comp, ...props}) => (
  <li className={
    (comp ?
    (comp(match, location, props.to)?
      'active'
      :
      '')
    :
    (location.pathname === ((typeof props.to === 'string')?props.to : props.to.pathname) ?
      'active'
      :
      ''))}>
    <Link {...props} /> 
  </li>
))

Header.propTypes = {
  currentRole: PropTypes.string
}

Header.defaultProps = {
  currentRole: ''
}

export default Header;