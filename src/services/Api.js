import AuthStore from './../store/AuthStore.js';
// Textra Rest Api
export const TxRest = (() => {
    const host = 'http://api-textra.iondigi.com' //'http://api-textra.iondigi.com';
    const port = ':80';
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
                headers: new Headers({"Authorization": `Bearer ${AuthStore.token}`}),
              }).then(response => {
                return response.json();
              }).then( async data => {
                if(typeof cb === 'function'){
                    cb(data);
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
        return new Promise( (resolve, reject) => {
            try { 
              fetch(`${host}${port}/${path}`, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                cache: "no-cache",
                body: JSON.stringify({...dataToPath}),
                headers: {'Content-Type': 'application/json',
                          'Accept': 'application/json',
                        },
              }).then(response => {
                return response.json();
              }).then( async data => {
                if(typeof cb === 'function'){
                  cb(data);
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
              credentials: 'include',
              mode: 'cors',
              cache: "no-cache",
              body: JSON.stringify({...dataToPath}),
              headers: new Headers({
                        "Authorization": `Bearer ${AuthStore.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'}),
            }).then(response => {
              return response.json();
            }).then( async data => {
              if(typeof cb === 'function'){
                  cb(data);
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
      putData
    }
})()