import {EventEmitter} from 'events';
import {TxRest}  from './../services/Api.js';
// Cache objects shared among Histoty instances, also accessible via static
// functions on the StoryStore constructor.

/**
 * Story ids by type, in rank order. Persisted to sessionStorage.
 * @type Object.<type, Array.<id>>
 */
var idCache = {}

/**
 * Room cache. Persisted to sessionStorage.
 * @type Object.<id, item>
 */
var roomCache = {}

/**
 * messagesRoom cache. Persisted to sessionStorage.
 * @type Object.<id, item>
 */
var messagesRoomCache = {}

/**
 * Story items in rank order for display, by type.
 * @type Object.<type, Array.<item>>
 */
var showList = {}
/**
 * Populate the story list for the given story type from the cache.
 */
function populateRooms(type) {
    var ids = idCache[type]
    var list = showList[type]
    for (var i = 0, l = ids.length; i < l; i++) {
        list[i] = roomCache[ids[i]] || null
    }
  }

  function populateRoom(type, value) {
    var ids = idCache[type]
    showList[type] = messagesRoomCache[ids] || value

  }

  function parseJSON(json, defaultValue) {
    return (json ? JSON.parse(json) : defaultValue)
  }
  
  export default class HistoryStore extends EventEmitter {
  
    /**
     * Get an room from the cache.
     */
    static getRooms(id) {
      return roomCache[id] || null
    }

     /**
     * Get an massage from the cache.
     */
    static getMassage(id) {
        return messagesRoomCache[id] || null
    } 
      
    /**
     * Deserialise caches from sessionStorage.
     */
    static loadSession() {
      if (typeof window === 'undefined') return
      idCache = parseJSON(window.sessionStorage.idCache, {})
      roomCache = parseJSON(window.sessionStorage.roomCache, {})
      messagesRoomCache = parseJSON(window.sessionStorage.messagesRoomCache, {})
  
    }
  
    /**
     * Serialise caches to sessionStorage as JSON.
     */
    static saveSession() {
      if (typeof window === 'undefined') return
      window.sessionStorage.idCache = JSON.stringify(idCache)
      window.sessionStorage.roomCache = JSON.stringify(roomCache)
      window.sessionStorage.messagesRoomCache = JSON.stringify(messagesRoomCache)
    }
  
    constructor(type, id) {
      super()
      this.type = type
      this.userId = id
      // Ensure cache objects for this type are initialised
      if (!(type in idCache)) {
        idCache[type] = []
      }
      if (!(type in roomCache)) {
        roomCache[type] = []
      }

      if (!(type in showList)) {
        showList[type] = []
        populateRooms(type)
      }
      if (!(type in messagesRoomCache)) {
        messagesRoomCache[type] = []
      }
  
      // Pre-bind event handlers per instance
      this.onStorage = this.onStorage.bind(this)
      this.onStorageMessage = this.onStorageMessage.bind(this)
      this.onGetRooms = this.onGetRooms.bind(this)
      this.onGetRoom = this.onGetRoom.bind(this)
    }
  
    getState() {
      return {
        ids: idCache[this.type],
        rooms: roomCache[this.type],
        list: showList[this.type]
      }
    }
  
    roomUpdated(item, index) {
      showList[this.type][index] = item
      roomCache[item.uuid] = item
    }

    messageUpdated(item, index) {
      showList[this.type][index] = item
      roomCache[item.uuid] = item
    }
  
    /**
     * Emit an item id event if a storage key corresponding to an item in the
     * cache has changed.
     */
    onStorage(e) {
      if (roomCache[e.key]) {
        this.emit(e.key)
      }
    }

    onStorageMessage(e) {
      if (roomCache[e.key]) {
        this.emit(e.key)
      }
    }

    /**
     * Handlers
     */
    onGetRooms(data){
        idCache[this.type] = data
        populateRooms(this.type)
        this.emit('updateRooms', this.getState())
    }

    onGetRoom(data){
        idCache[this.type] = data.id;
        populateRoom(this.type, data.value)
        this.emit('updateMessage', this.getState())
    }

    async startWatchMessage(id){
      let data = await TxRest.getDataByID('getmessagesroom', id);
      this.onGetRoom(data);
      window.addEventListener('storage', this.onStorageMessage)
    }

    async  start() {
      if (typeof window === 'undefined') return
      let date = await TxRest.getData('history');
      this.onGetRooms(date);
      window.addEventListener('storage', this.onStorage)
    }
  
    stop() {
      if (typeof window === 'undefined') return
      window.removeEventListener('storage', this.onStorage)
    }
  }
  