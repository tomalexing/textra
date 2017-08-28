import {EventEmitter} from 'events';
import {TxRest}  from './../services/Api.js';
// Cache objects shared among Users instances, also accessible via static
// functions on the StoryStore constructor.

/**
 * Story ids by type and user ID, in rank order. Persisted to sessionStorage.
 * @type Object<type: string, Array.<string>>
 */
var idCacheByUserId = {}

/**
 * Item cache. Persisted to sessionStorage.
 * @type Object.<id, item>
 */
var itemCacheByUserId = {}

/**
 * Story items in rank order for display, by type.
 * @type Object.<type, Array.<item>>
 */ 
var showLists = {}

/**
 * Populate the story list for the given story type from the cache.
 */
function populateList(type, id) {
  var ids = idCacheByUserId[type][id];
  var storyList = showLists[type][id];
  var icby = itemCacheByUserId[id];
  for (var i = 0, l = ids.length; i < l; i++) {
    storyList[i] = icby && icby[ids[i]] || null
  }
}

function parseJSON(json, defaultValue) {
  return (json ? JSON.parse(json) : defaultValue)
}

export default class Store extends EventEmitter {

  /**
   * Get an item from the cache.
   */
  static getItem(userId, itemId) {
    return itemCacheByUserId[userId][itemId] || null
  }

  /**
   * Deserialise caches from sessionStorage.
   */
  static loadSession() {
    if (typeof window === 'undefined') return
    idCacheByUserId = parseJSON(window.sessionStorage.idCacheByUserId, {})
    itemCacheByUserId = parseJSON(window.sessionStorage.itemCacheByUserId, {})

  }

  /**
   * Serialise caches to sessionStorage as JSON.
   */
  static saveSession() {
    if (typeof window === 'undefined') return
    window.sessionStorage.idCacheByUserId = JSON.stringify(idCacheByUserId)
    window.sessionStorage.itemCacheByUserId = JSON.stringify(itemCacheByUserId)
  }

  constructor(type, id) {
    super()
    this.type = type
    this.id = id;
    
    // Ensure cache objects for this type are initialised
    if (!(type in idCacheByUserId)) {
      idCacheByUserId[type] = Object.create(null);
    }

    if (!(id in idCacheByUserId[type])) {
      idCacheByUserId[type][id] = [];
    }

    if (!(id in itemCacheByUserId)) {
      itemCacheByUserId[id] = Object.create(null);
    }

    if (!(type in showLists)) {
      showLists[type] = Object.create(null);
    }
    if (!(id in showLists[type])) {
      showLists[type][id] = []
      populateList(type, id)
    }
    
    // Pre-bind event handlers per instance
    this.onStorage = this.onStorage.bind(this)
    this.onStoriesUpdated = this.onStoriesUpdated.bind(this)
  }

  getState() {
    return {
      ids: idCacheByUserId[this.type][this.id],
      list: showLists[this.type][this.id]
    }
  }

  itemUpdated(item, id, index) {
    showLists[this.type][this.id][index] = item
    itemCacheByUserId[id][item.uuid] = item
  }

  /**
   * Emit an item id event if a storage key corresponding to an item in the
   * cache has changed.
   */
  onStorage(e) {
    if (itemCacheByUserId[e.key]) {
      this.emit(e.key)
    }
  }

  /**
   * Handle 
   */
  onStoriesUpdated(data) {
    idCacheByUserId[this.type][this.id] = data.value;
    populateList(this.type, this.id)
    this.emit('updateRooms', this.getState())
  }

  start() {
    if (typeof window === 'undefined') return
    TxRest.getDataByID(this.type, this.id , this.onStoriesUpdated) 
    window.addEventListener('storage', this.onStorage)
  }

  stop() {
    if (typeof window === 'undefined') return
    window.removeEventListener('storage', this.onStorage)
  }
}
