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
var historyLists = {}
/**
 * Populate the story list for the given story type from the cache.
 */
function populateRooms(type) {
    var ids = idCache[type]
    var list = historyLists[type]
    debugger;
    for (var i = 0, l = ids.length; i < l; i++) {
        list[i] = roomCache[ids[i]] || null
    }
  }

  function populateRoom(type, id) {
    var ids = roomCache[type]
    debugger;
    var storyList = historyLists[type][id]
    for (var i = 0, l = ids.length; i < l; i++) {
      storyList[i] = messagesRoomCache[ids[i]] || null
    }
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
        populateRooms(type)
      }
      if (!(type in messagesRoomCache)) {
        messagesRoomCache[type] = []
      }
  
      // Pre-bind event handlers per instance
      this.onStorage = this.onStorage.bind(this)
      this.onGetRooms = this.onGetRooms.bind(this)
      this.onGetRoom = this.onGetRoom.bind(this)
    }
  
    getState() {
      return {
        ids: idCache[this.type],
        rooms: roomCache[this.type],
        massage: historyLists[this.type]
      }
    }
  
    itemUpdated(item, index) {
      historyLists[this.type][index] = item
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

    /**
     * Handlers
     */
    onGetRooms(data){
        idCache[this.type] = data
        populateRooms(this.type)
        this.emit('updateRooms', this.getState())
    }

    onGetRoom = (id) => ((data) => {
        roomCache[this.type][data.id] = data.value
        populateRoom(this.type, id)
        this.emit('updateRoom', this.getState())
      }).bind(this)

    async  start() {
      if (typeof window === 'undefined') return
      let date = await TxRest.getData(this.type);
      this.onGetRooms(date);
      debugger;
      await idCache[this.type].map(id => {
          TxRest.getDataByID('getRoom', id, this.onGetRoom(id));
      });
      window.addEventListener('storage', this.onStorage)
    }
  
    stop() {
      if (typeof window === 'undefined') return
      window.removeEventListener('storage', this.onStorage)
    }
  }
  