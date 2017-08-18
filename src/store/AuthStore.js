import { TxRest } from './../services/Api.js';

const  Auth = {
  isAuthenticated: true,
  role: null,
  user: null,
  token: null,
  authorize(cb, data) {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      this.role = data.user.role;
      this.user = data.user;
      this.token = data.token;
      if(this.isAuthenticated!= null && this.role!= null){
          if(typeof window === 'undefined') return reject();
          window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
          window.localStorage.setItem('user', JSON.stringify(this.user));
          window.localStorage.setItem('token', JSON.stringify(this.token));
      }
      if (typeof cd === 'function') cb();
      resolve();
    })
  },
  authenticate(cb, data){
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      this.role = data.user.role;
      this.user = data.user;
      this.token = data.token;
      if(this.isAuthenticated!= null && this.role!= null){
          if(typeof window === 'undefined') return reject();
          window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
          window.localStorage.setItem('user', JSON.stringify(this.user));
          window.localStorage.setItem('token', JSON.stringify(this.token));
      }
      if (typeof cb === 'function') cb();
      resolve();
    })
  },
  init(){
    if( typeof window === 'undefined' ) return 
    this.isAuthenticated = JSON.parse(window.localStorage.getItem('isLoggedIn'));
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.token = JSON.parse(window.localStorage.getItem('token'));
    this.role = this.user ? this.user.role : undefined;
  },
  refreshToken(){
    if( typeof window === 'undefined' ) return 
    if( this.token ) 
      TxRest.getData('refreshToken').then(data => {
        console.log(data)
        window.localStorage.setItem('token', JSON.stringify(this.token));
        
      })
  },
  signout(cb) {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = false;
      this.role = undefined;
      if(typeof window === 'undefined') return  reject();
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
      if (typeof cb === 'function') cb();
      resolve();
    })
  }
}
export default Auth;