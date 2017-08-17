const  Auth = {
  isAuthenticated: true,
  role: null,
  user: null,
  token: null,
  authorize(cb, data) {
    this.isAuthenticated = true;
    this.role = data.user.role;
    this.user = data.user;
    this.token = data.token;
    if(this.isAuthenticated!= null && this.role!= null){
        if(typeof window === 'undefined') return 
        window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
        window.localStorage.setItem('user', JSON.stringify(this.user));
        window.localStorage.setItem('token', JSON.stringify(this.token));
    }
    if (typeof cd === 'function') cb();
  },
  authenticate(cb, data){
    this.isAuthenticated = true;
    this.role = data.user.role;
    this.user = data.user;
    this.token = data.token;
    if(this.isAuthenticated!= null && this.role!= null){
        if(typeof window === 'undefined') return 
        window.localStorage.setItem('isLoggedIn', JSON.stringify(this.isAuthenticated));
        window.localStorage.setItem('user', JSON.stringify(this.user));
        window.localStorage.setItem('token', JSON.stringify(this.token));
    }
    if (typeof cb === 'function') cb();
  },
  init(){
    if( typeof window === 'undefined' ) return 
    this.isAuthenticated = JSON.parse(window.localStorage.getItem('isLoggedIn'));
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.token = JSON.parse(window.localStorage.getItem('token'));
    this.role = this.user ? this.user.role : undefined;
  },
  signout(cb) {
    this.isAuthenticated = false;
    this.role = undefined;
    if(typeof window === 'undefined') return 
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    if (typeof cb === 'function') cb();
  }
}
if(Auth.role == undefined){
  
  // TODO: Make Ajax request to server for obtain role of the user 
  // I Should keep role only in App because it can be malfunction

}
export default Auth;