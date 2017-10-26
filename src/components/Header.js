import React from 'react';
import { Link, withRouter, Redirect} from 'react-router-dom';
import logo from './../assets/logo.png';
import logo2x from './../assets/logo-2x.png';

import avatar from './../assets/default-avatar.png';
import {hasClass, addClass, removeClass, delegate, listener, debounce,
  requestAnimationFramePromise, transitionEndPromise} from './../utils';
import PropTypes from 'prop-types';
import Auth from './../store/AuthStore.js';
import tail_spin from './../assets/tail-spin.svg';
import {TxRest} from './../services/Api.js';
import TxInput from './TxInput.js';
import TxForm from './TxForm.js';
import formSerialize from 'form-serialize';

const isActive = (match, location,to) => {
  return ['/translator','/dashboard','/admin'].some(str => location.pathname.includes(str) )
}

class Header extends React.Component{
  constructor(props){
    super(props);
    this.toggleMobileMenu =  this.toggleMobileMenu.bind(this);
    this.togglePayment =  this.togglePayment.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.openMobileMenu = this.openMobileMenu.bind(this);
    this.payment = this.payment.bind(this);
    this.closeListener = null;
    this.logout = this.logout.bind(this);
    this.listeners = [];
    this.timeout = null;
    this.timeoutLP = null;
  }

  

  state = {
    isMobileMenuOpened: false,
    isPaymentFormOpened: false,
    isLiqpayPopupOpen: false,
    user: Auth.user,
    redirect: false,
    isTablet: false,
    loadingLiqpay: false
  }

  componentDidMount(){
    let _self = this;
    this._isMounted = true;
    Auth.addListener('headerUpdate', ({user})=>{
      if(_self._isMounted)
      _self.setState({user});
    })

    this.listeners.push(
      listener(window, 'resize', debounce((e) => {
        let isTablet = e.target.innerWidth <= 768 ? true : false;
        if (this.state.isTablet !== isTablet  && this._isMounted) this.setState({ isTablet })
      }, 200, false), false)
    );
 
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.listeners.forEach(removeEventListener => removeEventListener())
    Auth.removeListener('headerUpdate');
  }

  payment(e){
    e.preventDefault();
    let _self = this,
        type = this.state.isTablet?'touchend':'click';
    let {amount} = formSerialize(e.target, { hash: true, empty: true });
    amount = Number(amount);


    clearTimeout(_self.timeout);
    _self.timeout = setTimeout( _ => {
      _self.setState({loadingLiqpay:true});
      TxRest.getDataByID('encodePayment',{amount})
        .then(liqpay => {
            document.querySelector('#liqpay_checkout').innerHTML = '';

            if(_self._isMounted)
            _self.setState({loadingLiqpay:false});

            window.LiqPayCheckout && window.LiqPayCheckout.init({
              data: liqpay.data,
              signature: liqpay.signature,
              embedTo: "#liqpay_checkout",
              language: "ru",
              mode: "embed" // embed || popup
            }).on("liqpay.callback", function(data){
              console.log(data.status)
              console.log("liqpay.callback")
            }).on("liqpay.ready", function(data){
              clearTimeout(_self.timeoutLP);
              _self.timeoutLP = setTimeout( _ => {
                if(!_self.state.isLiqpayPopupOpen){
                 
                  _self.openMobileMenu(
                  document.querySelector('#liqpay_checkout'),
                  'isLiqpayPopupOpen',
                  type,
                  {'closeTarget':'.popup-liqpay__out', 
                  'cb': () => { 
                                  document.querySelector('#liqpay_checkout').innerHTML = '';
                                  removeClass( document.querySelector('#payment_form'), 'popup-opened') 
                              }
                  });
                  addClass( document.querySelector('#payment_form'), 'popup-opened')
                }else{
                  if(_self._isMounted)
                  _self.setState({isLiqpayPopupOpen: false})
                  // document.querySelector('#liqpay_checkout').innerHTML = '';
                  // removeClass(_self.payment_form, 'popup-opened');
                  // _self.setState({isLiqpayPopupOpen: false})
                  // _self.closeMobileMenu( document.querySelector('#liqpay_checkout'), 'isLiqpayPopupOpen', type);
                }

              }, 200)
              
            }).on("liqpay.close", function(data){
              console.log("liqpay.close")
            })
      })
    }, 200)
  }

  closeMobileMenu = (target, stateTag, cb = ()=>{}) => {
    if(!target) return
    target.style.transition = 'opacity .3s';

    if(target.style.display === 'none'){
      //something goes wrong, so make state correction
      let obj = {};
      obj[stateTag] = false
      if(this._isMounted)
      this.setState(obj)
      return;
    }

    requestAnimationFramePromise()
      .then( _ => requestAnimationFramePromise())
      .then( _ => {
          target.style.opacity = 0;
          return transitionEndPromise(target);
      })
      .then( _ => {
        if(!target) return
        target.style.display = 'none';
        let obj = {};
        obj[stateTag] = false
        if(this._isMounted)
        this.setState(obj)
      }).then(cb);
  }

  openMobileMenu = (target, stateTag, type, optObj = {'closeTarget':'.h100','cb':()=>{}}) => {
    target.style.transition = 'opacity .1s';
    target.style.opacity = 0;
    target.style.display = 'flex';
    requestAnimationFramePromise()
      .then( _ => requestAnimationFramePromise())
      .then( _ => {
          if(!target) return
          target.style.opacity = 1;
          return transitionEndPromise(target);
      })
      .then( _ => {
        let obj = {};
        obj[stateTag] = true
        if(this._isMounted)
        this.setState(obj,()=>
           this.closeListener = delegate(window, type, optObj['closeTarget'], this.closeMobileMenu.bind(this,target, stateTag, optObj['cb']), false, true)
        )
      });
  }

  toggleMobileMenu = (e) =>  {
    e.preventDefault();
    e.stopPropagation();
    let currentTarget =  e.currentTarget,
    type = e.type;

    clearTimeout(this.timeout);

    this.timeout = setTimeout( _ => {
      !this.state.isMobileMenuOpened
      ?this.openMobileMenu(this.mobile_menu, 'isMobileMenuOpened', type)
      :this.closeMobileMenu(this.mobile_menu, 'isMobileMenuOpened', type);
      
      let menuWrapper = currentTarget.parentElement;
      hasClass(menuWrapper,'opened')?removeClass(menuWrapper,'opened'):addClass(menuWrapper,'opened');
    }, 200)
  }

  togglePayment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let currentTarget =  e.currentTarget,
        type = e.type;
    
    clearTimeout(this.timeout);

    this.timeout = setTimeout( _ => {
      if(!this.state.isPaymentFormOpened){
        this.openMobileMenu(this.payment_form, 'isPaymentFormOpened', type)
        this.payment_form.childNodes[0][0].focus();
      }else{
        this.closeMobileMenu(this.payment_form, 'isPaymentFormOpened', type);
      }
      let menuWrapper = currentTarget.parentElement;
      hasClass(menuWrapper,'opened')?removeClass(menuWrapper,'opened'):addClass(menuWrapper,'opened');
    }, 200)
  }

  logout(){
    let _self = this;
    Auth.signout().then((res , rej) => {
        _self.setState({redirect: true});
    });
  }

  render(){
    let { user, redirect, isTablet, loadingLiqpay } = this.state;
    if(redirect) return(
      <Redirect to={'/'}/>
    ) 
    return(  <header className="f main__header">
                <div className="f f-align-2-2 header-logo">
                  <Link to={'/'} ><img src={logo} srcSet={`${logo} 1x, ${logo2x} 2x`} alt="Textra" /> </Link>
                </div>
                <div className="f f-align-2-2 header-menu__mobile">
                  <button  className="f f-col f-align-2-2 header-menu__mobile__btn" onTouchEnd={this.toggleMobileMenu}>
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
                  { Auth.isAuthenticated &&  <div className="f f-col f-align-1-3 header-details">
                    <div className="header-email">{user.email}</div>
                    <div className="header-details__more">
                      {
                        this.props.currentRole === 'user' && <div className="header-paymentwrapper">
                          <button 
                            {...isTablet &&{onTouchEnd:this.togglePayment}} 
                            {...!isTablet &&{onClick:this.togglePayment}} 
                            className="header-replenish" >
                              пополнить
                          </button>
                          <div id="payment_form" className="header-payment" ref={n => this.payment_form = n}> 
                            <TxForm submit={this.payment} innerErrorFielsType={true} formClass=""> 
                            
                                <h3 className="h3 u-mb-2">Введите сумму пополнения:</h3>

                                <TxInput tag="input" tabIndex='1' setFocusToInput={true} type="text" name="amount" validate={[{'minLength':1}, 'required', 'number']} className="field-block " placeholder="Сумма, грн"/>

                                <img className={`${loadingLiqpay?'show':''} header-payment__loading`} src={tail_spin}/>
                                
                                <TxInput type="submit" autoValidate={false}  value='Пополнить' style={{float: "right"}} className={'submit-post btn btn-primiry btn-normal u-mt-2'}/>
                              </TxForm> 
                              <div className="popup-liqpay__out"><div className="popup-liqpay__wrapper">
                                <div id="liqpay_checkout" className="popup-liqpay"></div>
                              </div></div>
                            </div>
                           
                          </div>
                      }
                      {this.props.currentRole === 'user' && 
                      <span className="header-balance">{`${Number(user.balance/100).toFixed(2)} ₴`}</span>}
                      
                      {this.props.currentRole === 'translator' && <span className="header-balance">{`${Number(user.earn_balance/100).toFixed(2)} ₴`}</span>}

                      {this.props.currentRole === 'admin' && <span className="header-balance">{`Welcome, ${Auth.user.first_name} ${Auth.user.last_name}`}</span>}

                      {this.props.currentRole === 'controller' && <span className="header-balance">{`Welcome, ${Auth.user.first_name} ${Auth.user.last_name}`}</span>}
                    </div>
                  </div>}
                   { Auth.isAuthenticated && <div className="f f-align-2-2 header-avatar">
                    <figure className="f f-align-2-2 header-avatar__in"> <img src={user.image || avatar} alt="Textra" /> </figure>
                    <div className="header-logout" onClick={this.logout}>Выйти</div>
                  </div>}
                  { !Auth.isAuthenticated && <div className="f f-gap-2 stuff__bottom">
                      <Link className={`btn btn-flat2 btn-${ window && window.innerWidth > 768 ? 'normal' : 'mini' }`} to={{pathname:"/signup", state:{from:'/'}}} >Зарегистрироваться</Link>
                      <Link className={`btn u-px-2 btn-primiry btn-${ window && window.innerWidth > 768 ? 'normal' : 'mini' }`} to={{pathname:"/login", state:{from:'/'}}} >Войти</Link>
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