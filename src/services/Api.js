import AuthStore from './../store/AuthStore.js';
// Textra Rest Api

export const TxRest = (() => {
    const host = 'http://138.68.95.226' //'http://api-textra.iondigi.com';
    const socketHost = 'ws://138.68.95.226' //'http://api-textra.iondigi.com';
    const port = ':8080';
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

              console.log(process.env.NODE_ENV)
              
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
      clearTimeout(timerLiqpay);
      timerLiqpay = setTimeout( _ => {
        console.log('timerLiqpay');
        TxRest.getData(`profile`)
          .then((data, err) => {

            if(!data.message && !data.err) {
              if(AuthStore.user.balance === data.balance){
                if(infinite) updateStatus({infinite: true});
                return
              }
              AuthStore.update(data);
            }
          })
      }, immediately ? 10 : 20000)
    }

    function initLiqPay(){
        if(window.LiqPayCheckoutCallback ) return
        if(!AuthStore.isAuthenticated || AuthStore.role !== 'user'  ) return

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
              
          });

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
                return response.json();
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
              }).then( response => {
                return response.json();
              }).then( async data => {
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
              return response.json();
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
    
    return {
      getData,
      getDataByID,
      putData,
      initSocket,
      reInitilizeSocket,
      deleteData,
      initLiqPay,
      updateStatus
    }
})()