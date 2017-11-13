import AuthStore from './../store/AuthStore.js';

// Textra Rest Api

export const TxRest = (() => {
    const host = 'http://52.59.207.236' //'http://api-textra.iondigi.com';
    const socketHost = 'ws://52.59.207.236' //'http://api-textra.iondigi.com';
    const port = ':80';
    let timerLiqpay = null;
    function initSocket(){
        
          if(!AuthStore.isAuthenticated || AuthStore.alreadyInitSocket || !AuthStore.socketPath ) return

          let _self = this;
          ((d, s, id, cb) => {
          const element = d.getElementsByTagName(s)[0];
          const fjs = element;
          let js = element;
          js = d.createElement(s);
          js.id = id;
          js.type = 'text/javascript';
          js.src = 'https://cdn.rawgit.com/balderdashy/sails.io.js/master/dist/sails.io.js';
          fjs.parentNode.insertBefore(js, fjs);
          js.onload = cb;
          
          })(document, 'script', 'sails-io', () => {

              
              window.io.sails.url = socketHost + port;
              window.io.sails.environment = process.env.NODE_ENV;
              window.io.sails.useCORSRouteToGetCookie = false;
              window.io.sails.reconnection = true;
              window.io.sails.headers = {
                 Authorization: `Bearer ${AuthStore.token}`
              }
              AuthStore.alreadyInitSocket = true
              AuthStore.update(); 
              window.io.socket.on('connect', function(socket) {
                //console.log('connection!');
                window.io.socket.get(AuthStore.socketPath);
                window.io.socket.on('disconnect', function() {
                    // console.log('Got disconnect!');
                    reInitilizeSocket();
                });
              });
          });
    }
    
    function reInitilizeSocket(){
        
          if(AuthStore.alreadyInitSocket){
              if(window.io.socket.isConnected()) {
                window.io.socket.disconnect()
                return; // we will back here in when event fire 
              }
              window.io.sails.url = socketHost + port;
              window.io.sails.environment = process.env.NODE_ENV;
              window.io.sails.useCORSRouteToGetCookie = false
              window.io.sails.headers = {
                 Authorization: `Bearer ${AuthStore.token}`
              }
              window.io.socket.get(AuthStore.socketPath);
              !window.io.socket.isConnected() && window.io.socket.reconnect()
          }{
            TxRest.initSocket();
          }
    }

    function connectSocketRoom(){

    }

    function updateStatus({infinite = false, immediately = false}={}){
      return new Promise( resolve => {
        clearTimeout(timerLiqpay);
        timerLiqpay = setTimeout( _ => {
          TxRest.getData(`profile`)
            .then((data, err) => {
              if(!data.message && !data.err && !isNaN(data.balance)) {
                if(AuthStore.user.balance === data.balance){
                  if(infinite) updateStatus({infinite: true});
                  return resolve()
                }
                AuthStore.update(data);
              }
              return resolve()
            })
        }, immediately ? 10 : 20000)
      })
    }

    function initLiqPay(){
        if( !!document.querySelector('#liqpay') ) return
        return new Promise(resolve => {
          let _self = this;
            ((d, s, id, cb) => {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            js = d.createElement(s);
            js.id = id;
            js.type = 'text/javascript';
            js.src = 'https://static.liqpay.com/libjs/checkout.js';
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = cb;
            })(document, 'script', 'liqpay', () => {
              
              resolve()
            });
        })
    }


    async function handler4xxError(codeStatus, data){
      data = await data;

      if(codeStatus === 404){ data.message = errorCode({errors: [404]}); return data}
      if(codeStatus === 403){ data.message = errorCode({errors: [403]}); return data}
      if(codeStatus !== 400) return data
      if( codeStatus === 400 && Array.isArray( data.errors ) ) data.message = errorCode(data);
      return data
    }

    /**
     *
     * 
     Get data from server by GET method with authorization header
      @param {String} path - server endpoint relatively of domain
      @param {Fucntion} cb - if omit callback use, Promise#then to get data
      @returns {(Promise<{}|Error>|undefined)} A Promise
    */
    function getData(path, cb){
        let _self = this;

        return new Promise( (resolve, reject) => {
            try { 
              fetch(`${host}${port}/${path}`, {
                method: 'GET',
                mode: 'cors',
                cache: "no-cache",
                headers: {'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'Authorization': `Bearer ${AuthStore.token}`
                        },
              }).then(response => {
                let code = response.status,
                    data = response.json();
                return {code, data}
              }).then( async ({code, data}) => {
                data = await handler4xxError(code, data);
                if(typeof cb === 'function'){
                    cb(data, resolve);
                }
                
                resolve(data);
              })
            } catch (err) {
              console.trace(err.stack);
              reject(err);
            }
        })
      }
      /**
       Get data from server by POST method with authorization header
        @param {String} path - server endpoint relatively of domain
        @param {Object} dataToPath - object of data you'd like to set in body
        @param {Fucntion} cb - if omit callback, use Promise#then to get data
        @returns {(Promise<{}>|undefined)} A Promise
      */
      function getDataByID(path, dataToPath, cb){
        let _self = this;
        let header = AuthStore.token;

        return new Promise( (resolve, reject) => {
            try { 
              fetch(`${host}${port}/${path}`, {
                method: 'POST',
                mode: 'cors',
                cache: "no-cache",
                body: JSON.stringify({...dataToPath}),
                headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'Authorization': `Bearer ${AuthStore.token ? AuthStore.token : ''}`
                        },
              }).then(response => {
                let code = response.status,
                    data = response.json();
                return {code, data}
              }).then( async ({code, data}) => {
                data = await handler4xxError(code, data);
                if(typeof cb === 'function'){
                  cb(data);
                }
                resolve(data);
              }).catch(err => console.log(err));
            } catch (err) {
              console.trace(err.stack);
              reject(err);
            }
      })
    }

      /**
     *
     * 
     Put data from server by PUT method with authorization header
      @param {String} path - server endpoint relatively of domain
      @param {Fucntion} cb - if omit callback use, Promise#then to get data
      @returns {(Promise<{}|Error>|undefined)} A Promise
    */
    function putData(path, dataToPath, cb){
      let _self = this;
      return new Promise( (resolve, reject) => {
          try { 
            fetch(`${host}${port}/${path}`, {
              method: 'PUT',
              mode: 'cors',
              cache: "no-cache",
              body: JSON.stringify({...dataToPath}),
              headers: new Headers({
                        'Authorization': `Bearer ${AuthStore.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'}),
            }).then(response => {
                let code = response.status,
                    data = response.json();
                return {code, data}
            }).then( async ({code, data}) => {
              data = await handler4xxError(code, data);
              if(typeof cb === 'function'){
                  cb(data, resolve);
              }
              resolve(data);
            })
          } catch (err) {
            console.trace(err.stack);
            reject(err);
          }
      })
    }
    
    /**
     *
     * 
     Delete data from server by DELETE method with authorization header
      @param {String} path - server endpoint relatively of domain
      @param {Fucntion} cb - if omit callback use, Promise#then to get data
      @returns {(Promise<{}|Error>|undefined)} A Promise
    */
    function deleteData(path, cb){
      let _self = this;
      return new Promise( (resolve, reject) => {
          try { 
            fetch(`${host}${port}/${path}`, {
              method: 'DELETE',
              mode: 'cors',
              cache: "no-cache",
              headers: new Headers({
                        'Authorization': `Bearer ${AuthStore.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'}),
            }).then(response => {
              return response.status === 200 && response.statusText === 'OK'
                      ? Promise.resolve(response.status) 
                      : Promise.reject(response.status)
            }).then( async data => {
              if(typeof cb === 'function'){
                  cb(data, resolve);
              }
              resolve(data);
            })
          } catch (err) {
            console.trace(err.stack);
            reject(err);
          }
      })
    }
    

    /**
     *
     * 
     Patch data within server by PATCH method with authorization header
      @param {String} path - server endpoint relatively of domain
      @param {Fucntion} cb - if omit callback use, Promise#then to get data
      @returns {(Promise<{}|Error>|undefined)} A Promise
    */
    function patchData(path, cb){
      let _self = this;
      return new Promise( (resolve, reject) => {
          try { 
            fetch(`${host}${port}/${path}`, {
              method: 'PATCH',
              mode: 'cors',
              cache: "no-cache",
              headers: new Headers({
                        'Authorization': `Bearer ${AuthStore.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'}),
            }).then(response => {
              return response.status === 200 && response.statusText === 'OK'
                      ? Promise.resolve(response.status) 
                      : Promise.reject(response.status)
            }).then( async data => {
              if(typeof cb === 'function'){
                  cb(data, resolve);
              }
              resolve(data);
            })
          } catch (err) {
            console.trace(err.stack);
            reject(err);
          }
      })
    }
    return {
      getData,
      getDataByID,
      putData,
      initSocket,
      reInitilizeSocket,
      deleteData,
      initLiqPay,
      updateStatus,
      patchData
    }
})()




// rus 
const errorCode = function({errors, message}){
  if(!errors) return 
  switch(errors[0]){  
  case('USER_PASS_SIMPLE'): return 'Очень простой пароль'
  case('EMAIL_NOT_UNIQUE'): return 'Email неуникальный'
  case('USER_EMAIL_REQUIRED'): return 'Email обязательное поле'
  case('PASS_REQUIRED'): return 'Пароль обязательное поле'
  case('WRONG_EMAIL_FORMAT'): return 'Неверный формат Email'
  case('USER_NAME_REQUIRED'): return 'Имя обязательное поле'
  case('FB_ID_NOT_UNIQUE'): return 'FB_ID_NOT_UNIQUE'
  case('G_ID_NOT_UNIQUE'): return 'G_ID_NOT_UNIQUE'
  case('FB_TOKEN_REQUIRED'): return 'FB_TOKEN_REQUIRED'
  case('G_TOKEN_REQUIRED'): return 'G_TOKEN_REQUIRED'
  case('FB_USER_REQUIRED'): return 'FB_USER_REQUIRED'
  case('G_USER_REQUIRED'): return 'G_USER_REQUIRED'
  case('USER_NOT_FB'): return 'USER_NOT_FB'
  case('USER_NOT_G'): return 'USER_NOT_G'
  case('INVALID_FB_TOKEN'): return 'INVALID_FB_TOKEN'
  case('INVALID_G_TOKEN'): return 'INVALID_G_TOKEN_REQUIRED'

  case('INVALID_EMAIL_PASS'): return 'Неверный Email или пароль'
  case('SOCIAL_USER_EXISTS'): return 'Пользователь уже существует'

  case('INVALID_LANG'): return 'INVALID_LANG'

  case('INVALID_USER_ROLE'): return 'INVALID_USER_ROLE'
  case('INVALID_USER_STATUS'): return 'INVALID_USER_STATUS'

  case('S_MSG_CONTENT_REQUIRED'): return 'S_MSG_CONTENT_REQUIRED'
  case('S_MSG_LETTERS_MAX'): return 'S_MSG_LETTERS_MAX'
  case('S_MSG_LETTERS_MIN'): return 'S_MSG_LETTERS_MIN'

  case('T_MSG_CONTENT_REQUIRED'): return 'T_MSG_CONTENT_REQUIRED'

  case(404): return 'Пост был отменен'
  case(403): return 'Уже взят в работу'
  default: return message
  }
} 