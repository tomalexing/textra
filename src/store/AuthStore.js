import { TxRest } from './../services/Api.js';

const ROLES = (num) => {
  switch(num){
  case('0') : return('admin')
  case('1') : return('controller')
  case('2') : return('translator')
  case('3') : return ('user')
  default   : return('user')
  }
};

const STATUS = {
  ACTIVE: '0',
  INACTIVE: '1',
  BLOCKED: '2',
};


const  Auth = {
  isAuthenticated: true,
  role: null,
  user: null,
  token: null,
  authorize(cb, data) {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      this.role = ROLES(data.user.role);
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
  authenticate(cb, data){
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      debugger;
      this.role = ROLES(data.user.role);

      this.user = data.user;
      this.token = data.token;
      if(this.isAuthenticated!= null && this.role!= null){
          if(typeof window === 'undefined') return reject();
          window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
          window.localStorage.setItem('user', JSON.stringify(this.user));
          window.localStorage.setItem('token', this.token);
      }
      if (typeof cb === 'function') cb();
      resolve();
    })
  },
  init(){
    if( typeof window === 'undefined' ) return 
    this.isAuthenticated = JSON.parse(window.localStorage.getItem('isLoggedIn'));
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.token = window.localStorage.getItem('token');
    this.role = this.user ? ROLES(this.user.role) : undefined;

  },
  refreshToken(){
    let self = this;
    if( typeof window === 'undefined' ) return 
    if( this.token ) 
      TxRest.getData('refreshToken').then(data => {
        self.token = data.token;
        window.localStorage.setItem('token', self.token);
        
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