
// Textra Rest Api
export const TxRest = (() => {
     const host = 'http://localhost' //'http://api-textra.iondigi.com';
     const port = ':9000';
      function getData(path, cb){
        let _self = this;
        return new Promise( (resolve, reject) => {
            try { 
              fetch(`${host}/${path}`, {
                method: 'GET',
              }).then(response => {
                return response.json();
              }).then( async data => {
                if (data.err) throw Error(data.err);
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
                            'Accept': 'application/json'},
                }).then(response => {
                  return response.json();
                }).then( async data => {
                  if(typeof cb === 'function'){
                    cb(JSON.parse(data));
                  }
                  resolve(JSON.parse(data));
                })
              } catch (err) {
                console.trace(err.stack);
                reject(err);
              }
        })
      }
      return {
        getData,
        getDataByID
      }
    })()