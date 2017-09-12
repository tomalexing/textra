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
 * Cache User Accaunt by type and its id. Persisted to sessionStorage.
 * @type Object.<id, item>
 */
var userCache = {}


/**
 * Story items in rank order for display, by type.
 * @type Object.<type, Array.<item>>
 */ 
var showLists = {}

/**
 * Populate the story list for the given story type from the cache.
 */
function populateList(type, id) {

  var storyList = showLists[type][id];
  var cachedItems =  itemCacheByUserId[id]
  for (var i = 0, l = cachedItems.length; i < l; i++) {
    if( cachedItems[i].status === "0" ) {
      if(!storyList['pendingTabs'])
        storyList['pendingTabs'] = []
      storyList['pendingTabs'][i] = cachedItems[i] || null
    }
    if( cachedItems[i].status === "1" ) {
      if(!storyList['workingTabs'])
        storyList['workingTabs'] = []
      storyList['workingTabs'][i] = cachedItems[i] || null
    }
    if( cachedItems[i].status === "2" ) {
      if(!storyList['historyTabs'])
        storyList['historyTabs'] = []
      storyList['historyTabs'][i] = cachedItems[i] || null
    }
  }
    
}

function parseJSON(json, defaultValue) {
  return (json ? JSON.parse(json) : defaultValue)
}

const ROLES = (num) => {
  switch(num){
  case('0') : return('d')
  case('1') : return('c')
  case('2') : return('t')
  case('3') : return ('u')
  default   : return('user')
  }
};

export default class Store extends EventEmitter {

  /**
   * Get an item from the cache.
   */
  static getItem(userId, itemId) {
    return Array.isArray(itemCacheByUserId[userId]) && itemCacheByUserId[userId].source_messages && itemCacheByUserId[userId].find(o => o.source_messages[0].id === itemId) || null
  }

  /**
   * Deserialise caches from sessionStorage.
   */
  static loadSession() {
    if (typeof window === 'undefined') return
    idCacheByUserId = parseJSON(window.sessionStorage.idCacheByUserId, {})
    itemCacheByUserId = parseJSON(window.sessionStorage.itemCacheByUserId, {})
    userCache = parseJSON(window.sessionStorage.userCache, {})

  }

  /**
   * Serialise caches to sessionStorage as JSON.
   */
  static saveSession() {
    if (typeof window === 'undefined') return
    window.sessionStorage.idCacheByUserId = JSON.stringify(idCacheByUserId)
    window.sessionStorage.itemCacheByUserId = JSON.stringify(itemCacheByUserId)
    window.sessionStorage.userCache = JSON.stringify(userCache)
  }

  static clearSession(){
    if (typeof window === 'undefined') return
    window.sessionStorage.clear(idCacheByUserId);
    window.sessionStorage.clear(itemCacheByUserId);
    window.sessionStorage.clear(userCache);
    idCacheByUserId = {};
    itemCacheByUserId = {};
    userCache = {};
    showLists = {};
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

    if (!(type in userCache)) {
      userCache[type] = Object.create(null);
    }

    if (!(id in userCache[type])) {
      userCache[type][id] = Object.create(null);
    }

    if (!(type in showLists)) {
      showLists[type] = Object.create(null);
    }
    if (!(id in showLists[type])) {
      showLists[type][id] = Object.create(null);
      populateList(type, id)
    }
    
    // Pre-bind event handlers per instance
    this.onStorage = this.onStorage.bind(this)
    this.onStoriesUpdated = this.onStoriesUpdated.bind(this)
  }

  getState() {
    return {
      user: userCache[this.type][this.id],
      ...showLists[this.type][this.id]
    }
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
    if(data.message) return
    let rooms = data.topics;
    let user = {
        nickname: data.first_name + ' ' + data.last_name, 
        uuid: data.id,
        email: data.email, 
        type: ROLES(data.role), 
        registrationTime: data.created_at,
        role: data.role,
        totalTime: data.total_time,
        amountLetters: data.total_letters,
        balance: data.balance,
        earnBalance: data.earn_balance,
        status: data.status
    }
    
    userCache[this.type][this.id] = user;

    idCacheByUserId[this.type][this.id] = rooms.map( o => o.id);
    itemCacheByUserId[this.id] = rooms
    populateList(this.type, this.id)
    this.emit('updateRooms', this.getState())
  }

  start() {
    if (typeof window === 'undefined') return
    TxRest.getData(this.type + '/' + this.id , this.onStoriesUpdated) 
    window.addEventListener('storage', this.onStorage)
  }

  stop() {
    if (typeof window === 'undefined') return
    window.removeEventListener('storage', this.onStorage)
  }
}
