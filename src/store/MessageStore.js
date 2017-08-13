import {EventEmitter} from 'events';
import {TxRest}  from './../services/Api.js';

/**
 * messagesByUserId cache. Persisted to sessionStorage.
 * @type Object.<type, Object.<id, Array.item>>
 */
var messagesByUserIdCache = Object.create(null);

/**
 * Story items in rank order for display, by type.
 * @type Object.<type, Object.<id, Array.item>>
 */
var showList = Object.create(null);

/**
 * Populate the story list for the given story type from the cache.
 */

  function populateMessages(type, id) {
    showList[type][id] = messagesByUserIdCache[type] && messagesByUserIdCache[type][id] || null
  }

  function parseJSON(json, defaultValue) {
    return (json ? JSON.parse(json) : defaultValue)
  }
  
  export default class MessageStore extends EventEmitter {
  

     /**
     * Get an massage by userId anad type from the cache.
     */
    static getMassage(type, id) {
        return  messagesByUserIdCache[type] && messagesByUserIdCache[type][id] || null
    } 
      
    /**
     * Deserialise caches from sessionStorage.
     */
    static loadSession() {
      if (typeof window === 'undefined') return
      messagesByUserIdCache = parseJSON(window.sessionStorage.messagesByUserIdCache, {})  
    }
  
    /**
     * Serialise caches to sessionStorage as JSON.
     */
    static saveSession() {
      if (typeof window === 'undefined') return
      window.sessionStorage.messagesByUserIdCache = JSON.stringify(messagesByUserIdCache)
    }
  
    constructor(type, id) {
      super()
      this.type = type
      this.userId = id
      // Ensure cache objects for this type are initialised
      if(id === undefined) {throw new Error('Unappropriate param')}
      if (!(type in messagesByUserIdCache)) {
        messagesByUserIdCache[type] = Object.create(null);
      }

      if(!(id in messagesByUserIdCache[type])){
         messagesByUserIdCache[type][id] = [];
      }

      if (!(type in showList)) {
        showList[type] = Object.create(null);
      }
      if (!(id in showList)) {
        showList[type][id] = [];
      }
      populateMessages(type, id);
      // Pre-bind event handlers per instance
      this.onStorage = this.onStorage.bind(this)
      this.onGetMessages = this.onGetMessages.bind(this)
    }
  
    getState() {
      return {
        list: showList[this.type][this.userId]
      }
    }
  
    /**
     * Emit an item id event if a storage key corresponding to an item in the
     * cache has changed.
     */
    onStorage(e) {
      if (messagesByUserIdCache[e.key]) {
        this.emit(e.key)
      }
    }

    /**
     * Handlers
     */

    onGetMessages(data){
        messagesByUserIdCache[this.type][this.userId] = data.value;
        populateMessages(this.type, this.userId);
        this.emit('updateMessage', this.getState())
    }

    async  start() {
      if (typeof window === 'undefined') return
      let date = await TxRest.getDataByID(this.type, this.userId);
      this.onGetMessages(date);
      window.addEventListener('storage', this.onStorage)
    }
  
    stop() {
      if (typeof window === 'undefined') return
      window.removeEventListener('storage', this.onStorage)
    }
  }
  