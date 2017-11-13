import { TxRest } from './../services/Api.js';
import Store from './Store.js'
import UserStore from './UserStore.js'
import FeedStore from './FeedStore.js'

const ROLES = (num) => {
  switch(num){
  case('0') : return('admin')
  case('1') : return('controller')
  case('2') : return('translator')
  case('3') : return ('user')
  default   : return('user')
  }
};

const SOCKETPATH = (num) => {
  switch(num){
  case('0') : return('')
  case('1') : return('')
  case('2') : return('/subscribe/pending-topic')
  case('3') : return ('/subscribe/topic')
  default   : return('')
  }
};

const STATUS = {
  ACTIVE: '0',
  INACTIVE: '1',
  BLOCKED: '2',
};


const  Auth = {
  isAuthenticated: false,
  role: null,
  user: null,
  token: null,
  socketPath: null,
  alreadyInitSocket: false,
  listeners: {},
  loadSession: false,
  update(user){
    if( user ){
      this.role = ROLES(user.role);
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(this.user));
    }
    Object.values(this.listeners).map(func => func(Auth));
  },
  addListener(name, cb){
    this.listeners[name] = cb;
  },
  removeListener(name){
    delete this.listeners[name];
  },
  authorize(cb, data) {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      this.role = ROLES(data.user.role);
      this.socketPath = SOCKETPATH(data.user.role)
      this.user = data.user;
      this.token = data.token;
      this.loadSession = window.localStorage.getItem('user') === JSON.stringify(this.user);
      if(this.isAuthenticated!= null && this.role!= null){
          if(typeof window === 'undefined') return reject();
          window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
          window.localStorage.setItem('user', JSON.stringify(this.user));
          window.localStorage.setItem('token', this.token);
      }

      if(this.loadSession){
        Store.loadSession();
        UserStore.loadSession();
        FeedStore.loadSession();
      }else{
        Store.clearSession();
        UserStore.clearSession();
        FeedStore.clearSession();
        TxRest.reInitilizeSocket();
      }

      if (typeof cb === 'function') cb(resolve);
      resolve();
    })
  },
  authenticate(cb, data){
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true;
      this.role = ROLES(data.user.role);
      this.socketPath = SOCKETPATH(data.user.role);
      this.user = data.user;
      this.token = data.token;
      this.loadSession = window.localStorage.getItem('user') === JSON.stringify(this.user);
      if(this.isAuthenticated != null && this.role != null){
          if(typeof window === 'undefined') return reject();
          window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
          window.localStorage.setItem('user', JSON.stringify(this.user));
          window.localStorage.setItem('token', this.token);
      }

      if(this.loadSession){
        Store.loadSession();
        UserStore.loadSession();
        FeedStore.loadSession();
      }else{
        Store.clearSession();
        UserStore.clearSession();
        FeedStore.clearSession();
        TxRest.reInitilizeSocket();
      }

      if (typeof cb === 'function') cb(resolve);
      resolve();
    })
  },
  init(){
    if( typeof window === 'undefined' ) return 
    this.isAuthenticated = JSON.parse(window.localStorage.getItem('isLoggedIn'));
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.token = window.localStorage.getItem('token');
    this.role = this.user ? ROLES(this.user.role) : undefined;
    this.socketPath = this.user ? SOCKETPATH(this.user.role) : undefined; 
  },

  refreshToken(){
    let self = this;
    if( typeof window === 'undefined' ) return 
    if( this.isAuthenticated )
      return TxRest.getData('refreshToken').then(data => {
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
      //window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
      this.alreadyInitSocket = false;
      if (typeof cb === 'function') cb(resolve);
      resolve();
    })
  }
}
export default Auth;
