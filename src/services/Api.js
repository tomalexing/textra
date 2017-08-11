
// Textra Rest Api
export const TxRest = (() => {
    
      function getData(path, cb){
        let _self = this;
        return new Promise( (resolve, reject) => {
            try { 
              fetch(`/admin/${path.toLowerCase()}`, {
                method: 'GET',
                credentials: 'include'
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
    
        function getDataByID(path,id, cb){
          let _self = this;
          return new Promise( (resolve, reject) => {
              try { 
                fetch(`/admin/${path.toLowerCase()}`, {
                  method: 'POST',
                  credentials: 'include',
                  body: JSON.stringify({id}),
                  headers: {'Content-Type': 'application/json'},
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
      return {
        getData,
        getDataByID
      }
    })()