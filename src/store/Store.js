import {EventEmitter} from 'events';

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

// Cache objects shared among UsersStore instances, also accessible via static
// functions on the StoryStore constructor.

/**
 * Story ids by type, in rank order. Persisted to sessionStorage.
 * @type Object.<type, Array.<id>>
 */
var idCache = {}

/**
 * Item cache. Persisted to sessionStorage.
 * @type Object.<id, item>
 */
var itemCache = {}

/**
 * Story items in rank order for display, by type.
 * @type Object.<type, Array.<item>>
 */
var showLists = {}

/**
 * Populate the story list for the given story type from the cache.
 */
function populateList(type) {
  var ids = idCache[type]
  var storyList = showLists[type]
  for (var i = 0, l = ids.length; i < l; i++) {
    storyList[i] = itemCache[ids[i]] || null
  }
}

function parseJSON(json, defaultValue) {
  return (json ? JSON.parse(json) : defaultValue)
}

export default class Store extends EventEmitter {

  /**
   * Get an item from the cache.
   */
  static getItem(id) {
    return itemCache[id] || null
  }

  /**
   * Deserialise caches from sessionStorage.
   */
  static loadSession() {
    if (typeof window === 'undefined') return
    idCache = parseJSON(window.sessionStorage.idCache, {})
    itemCache = parseJSON(window.sessionStorage.itemCache, {})

  }

  /**
   * Serialise caches to sessionStorage as JSON.
   */
  static saveSession() {
    if (typeof window === 'undefined') return
    window.sessionStorage.idCache = JSON.stringify(idCache)
    window.sessionStorage.itemCache = JSON.stringify(itemCache)
  }

  constructor(type, id = false) {
    super()
    this.type = type
    if(id)
       this.id = id
    // Ensure cache objects for this type are initialised
    if (!(type in idCache)) {
      idCache[type] = []
    }
    if (!(type in showLists)) {
      showLists[type] = []
      populateList(type)
    }

    // Pre-bind event handlers per instance
    this.onStorage = this.onStorage.bind(this)
    this.onStoriesUpdated = this.onStoriesUpdated.bind(this)
  }

  getState() {
    return {
      ids: idCache[this.type],
      list: showLists[this.type]
    }
  }

  itemUpdated(item, index) {
    showLists[this.type][index] = item
    itemCache[item.uuid] = item
  }

  /**
   * Emit an item id event if a storage key corresponding to an item in the
   * cache has changed.
   */
  onStorage(e) {
    if (itemCache[e.key]) {
      this.emit(e.key)
    }
  }

  /**
   * Handle 
   */
  onStoriesUpdated(data) {
    idCache[this.type] = data
    populateList(this.type)
    this.emit('update', this.getState())
  }

  startForAll() {
    if (typeof window === 'undefined') return
    TxRest.getData(this.type, this.onStoriesUpdated) 
    window.addEventListener('storage', this.onStorage)
  }

  start() {
    if (typeof window === 'undefined') return
    TxRest.getData(this.type, this.onStoriesUpdated) 
    window.addEventListener('storage', this.onStorage)
  }

  stop() {
    if (typeof window === 'undefined') return
    window.removeEventListener('storage', this.onStorage)
  }
}
