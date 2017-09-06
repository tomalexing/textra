import {EventEmitter} from 'events';
import {TxRest}  from './../services/Api.js';
import AuthStore from './AuthStore.js'
// Cache objects shared among Users instances, also accessible via static
// functions on the StoryStore constructor.

/**
 * Story ids by type, in rank order. Persisted to sessionStorage.
 * Object.<type, Array.<id>>,
 * @type {{string : Array<string>}}  
 */
var idCache = {}

/**
 * Item cache. Persisted to sessionStorage.
 * Object.<id, item>
 * @type {{string:{}}}  
 */
var itemCache = {}

/**
 * Story items in rank order for display, by type.
 * Object.<type, Array.<item>>
 * @type {{string:Array<{}>}}  
 */
var showLists = {}


/**
 * Populate the story list for the given story type from the cache.
 */
function populateList(type) {
  var ids = idCache[type]
  var storyList = showLists[type];
  for (var i = 0, l = ids.length; i < l; i++) {
    storyList[i] = itemCache[ids[i]] || null
  }
}

function parseJSON(json, defaultValue) {
  return (json ? JSON.parse(json) : defaultValue)
}

let isSocketOn = false; 

export default class Store extends EventEmitter {


  /**
   * Get an ids by type from the cache.
   */
  static getIds(type) {
    return idCache[type] || null
  }

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

  static clearSession(){
    if (typeof window === 'undefined') return
    window.sessionStorage.clear(idCache);
    window.sessionStorage.clear(itemCache);
    idCache = {};
    itemCache = {};
    showLists = {};
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
    this.startSocket = this.startSocket.bind(this)
  }

  getState() {
    return {
      ids: idCache[this.type],
      list: showLists[this.type]
    }
  }

  itemUpdated(item, index) {
    if(index  === -1){
      showLists[this.type].unshift(item);
    }else{
      showLists[this.type][index] = item
    }
    itemCache[this.type + item.id] = item
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
    
    if(Array.isArray(data) && data.length === 0) {
      idCache[this.type]= [];
      return
    }
    let _self = this;
    if(Array.isArray(data)){
      let ids = data.reduce((acc, item, idx) => {
        itemCache[_self.type + item.id] = item;
       
        return acc.concat(_self.type + item.id);
      },[]);
      showLists[this.type] = [];
      idCache[this.type]= ids;

    }else{

      // get object from socket
      if(this.type !== "topic" && this.type !== "pending-topic"){
        console.log('An error in the Store')
        return
      }
      if(idCache[this.type].indexOf(this.type + data.id) === -1 ) 
        idCache[this.type].unshift(this.type + data.id);

      itemCache[this.type + data.id] = Object.assign({}, itemCache[this.type + data.id],  data);
    }

    populateList(this.type)
    this.emit('update', this.getState())
  }

  startSocket(){
    if(this.type === "topic" || this.type === "pending-topic" ){
      !isSocketOn && window.io.socket.on('topic', this.onStoriesUpdated);
      isSocketOn = true;
    }
  }
  
  start() {
    if (typeof window === 'undefined') return
    TxRest.getData(this.type, this.onStoriesUpdated) 
    window.addEventListener('storage', this.onStorage)
    if(AuthStore.alreadyInitSocket && window.io){
      this.startSocket();
    }else{
      AuthStore.addListener('AuthStore.alreadyInitSocket', this.startSocket)
    }
  }

  stop() {
    if (typeof window === 'undefined') return
    window.removeEventListener('storage', this.onStorage)
    AuthStore.removeListener('AuthStore.alreadyInitSocket')
    if(window.io) {
      isSocketOn = false;
      window.io.socket.off(this.type, this.onStoriesUpdated);
    }
  }
}
