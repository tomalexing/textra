import {EventEmitter} from 'events';
import {TxRest}  from './../services/Api.js';
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
    if(data.length === 0) return
    let _self = this;
    if(Array.isArray(data)){
      let ids = data.reduce((acc, item, idx) => {
        itemCache[_self.type + item.id] = item
        return acc.concat(_self.type + item.id);
      },[]);
      idCache[this.type]= ids;
    }else{
      
    }

    populateList(this.type)
    this.emit('update', this.getState())
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
