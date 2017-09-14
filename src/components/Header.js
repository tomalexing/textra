import React from 'react';
import { Link, withRouter, Redirect} from 'react-router-dom';
import logo from './../assets/logo.png';
import logo2x from './../assets/logo-2x.png';

import avatar from './../assets/default-avatar.png';
import {hasClass, addClass, removeClass, delegate} from './../utils';
import PropTypes from 'prop-types';
import Auth from './../store/AuthStore.js';

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
    this.logout = this.logout.bind(this);
  }

  

  state = {
    isMobileMenuOpened: false,
    user: Auth.user,
    redirect: false
  }

  componentDidMount(){
    let _self = this;
    Auth.addListener('headerUpdate', ({user})=>{
      _self.setState({user});
    })
  }

  componentWillUnmount(){
    Auth.removeListener('headerUpdate');
  }

  payment(){
 
      window.LiqPayCheckout && window.LiqPayCheckout.init({
          data:"eyAidmVyc2lvbiIgOiAzLCAicHVibGljX2tleSIgOiAiaTc1ODg1NDg4ODY4IiwgImFjdGlvbiIg"+"OiAicGF5IiwgImFtb3VudCIgOiAxLCAiY3VycmVuY3kiIDogIlVTRCIsICJkZXNjcmlwdGlvbiIg"+"OiAiZGVzY3JpcHRpb24gdGV4dCIsICJvcmRlcl9pZCIgOiAib3JkZXJfaWRfMSIgfQ==",
          signature: "M9kSUvyIcDvnT8qaZNiYrbgGb4Y=",
          embedTo: "#liqpay_checkout",
          mode: "popup" // embed || popup,
          }).on("liqpay.callback", function(data){
            console.log(data.status);
            console.log(data);
          }).on("liqpay.ready", function(data){
            console.log('ready');// ready
          }).on("liqpay.close", function(data){
            console.log('close');// close
          });
  
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

  logout(){
    let _self = this;
    Auth.signout().then((res , rej) => {
        _self.setState({redirect: true});
    });
  }

  render(){
    let { user, redirect } = this.state;
    if(redirect) return(
      <Redirect to={'/'}/>
    ) 
    return(  <header className="f main__header">
                <div className="f f-align-2-2 header-logo">
                  <Link to={'/'} ><img src={logo} srcSet={`${logo} 1x, ${logo2x} 2x`} alt="Textra" /> </Link>
                </div>
                <div className="f f-align-2-2 header-menu__mobile">
                  <button  ref={n => this.mobile_btn = n} className="f f-col f-align-2-2 header-menu__mobile__btn" onTouchEnd={this.toggleMobileMenu}>
                      <span></span>
                      <span></span>
                      <span></span>
                  </button>
                  <ul ref={n => this.mobile_menu = n} className="f f-col f-align-2-2 header-menu__mobile__in">
                    <NavLink to={'/'} comp={isActive}>Рабочий стол</NavLink>
                    {/* <NavLink to={'/about'}>О нас</NavLink> */}
                    <NavLink to={'/help'}>Поддержка</NavLink>
                  </ul>
                </div>
                 <div className="f f-align-2-2 header-logo__mobile">
                  <Link to={'/'} ><img srcSet={`${logo} 1x, ${logo2x} 2x`}  src={logo} alt="Textra" /></Link>
                </div>
                <ul className="f f-align-1-2 header-menu">
                  { Auth.isAuthenticated && <NavLink to={'/translator'} comp={isActive}>Рабочий стол</NavLink>}
                  {/* <NavLink to={'/about'}>О нас</NavLink> */}
                  <NavLink to={'/help'}>Поддержка</NavLink>
                </ul>
                <div className="f f-align-2-2 header-account">
                  { Auth.isAuthenticated && this.props.currentRole !== 'admin' &&  <div className="f f-col f-align-1-3 header-details">
                    <div className="header-email">{user.email}</div>
                    <div className="header-details__more">
                      {this.props.currentRole === 'user' && <span id="liqpay_checkout" onClick={this.payment}className="header-replenish">пополнить</span>}
                      {this.props.currentRole === 'user' && 
                      <span className="header-balance">{`${Number(user.balance/100).toFixed(2)} ₴`}</span>}
                      
                      {this.props.currentRole === 'translator' && <span className="header-balance">{`${Number(user.earn_balance/100).toFixed(2)} ₴`}</span>}

                    </div>
                  </div>}
                   { Auth.isAuthenticated && <div className="f f-align-2-2 header-avatar">
                    <figure className="f f-align-2-2 header-avatar__in"> <img src={user.image || avatar} alt="Textra" /> </figure>
                    <div className="header-logout" onClick={this.logout}>Выйти</div>
                  </div>}
                  { !Auth.isAuthenticated && <div className="f f-gap-2 stuff__bottom">
                      <Link className="btn btn-flat2 btn-normal" to={{pathname:"/signup", state:{from:'/'}}} >Зарегистрироваться</Link>
                      <Link className="btn u-px-2 btn-primiry btn-normal" to={{pathname:"/login", state:{from:'/'}}} >Войти</Link>
                  </div>}
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