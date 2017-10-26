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
var idFeedCache = {}

/**
 * Item cache. Persisted to sessionStorage.
 * Object.<id, item>
 * @type {{string:{}}}  
 */
var itemFeedCache = {}

/**
 * Story items in rank order for display, by type.
 * Object.<type, Array.<item>>
 * @type {{string:Array<{}>}}  
 */
var showFeedLists = {}


var feedPerson = 0

var feedCommon = 0

/**
 * Populate the story list for the given story type from the cache.
 */
function populateList(type, query) {
  var ids = idFeedCache[type]
  var storyList = showFeedLists[type];
  feedPerson = feedCommon = 0;
  for (var i = 0, l = ids.length; i < l; i++) {
    storyList[i] = itemFeedCache[ids[i]] || null
    !!storyList[i]['translator_id'] ? feedPerson++ : feedCommon++;
  }
  window.sessionStorage.feedCommon = feedCommon
  window.sessionStorage.feedPerson = feedPerson
  let queredFeed = new Query(storyList, query);
  showFeedLists[type] = queredFeed.filter();
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
    return idFeedCache[type] || null
  }

  /**
   * Get an item from the cache.
   */
  static getItem(id) {
    return itemFeedCache[id] || null
  }

  /**
   * Deserialise caches from sessionStorage.
   */
  static loadSession() {
    if (typeof window === 'undefined') return
    idFeedCache = parseJSON(window.sessionStorage.idFeedCache, {})
    itemFeedCache = parseJSON(window.sessionStorage.itemFeedCache, {})
  }

  static clearSession(){
    if (typeof window === 'undefined') return
    window.sessionStorage.clear(idFeedCache);
    window.sessionStorage.clear(itemFeedCache);
    idFeedCache = {};
    itemFeedCache = {};
    showFeedLists = {};
  }
  /**
   * Serialise caches to sessionStorage as JSON.
   */
  static saveSession() {
    if (typeof window === 'undefined') return
    window.sessionStorage.idFeedCache = JSON.stringify(idFeedCache)
    window.sessionStorage.itemFeedCache = JSON.stringify(itemFeedCache)
  }

  static updateScore(score) {
    feedCommon = score.feedCommon;
    feedPerson = score.feedPerson;
    window.sessionStorage.feedCommon = score.feedCommon
    window.sessionStorage.feedPerson = score.feedPerson
  }

  constructor(type, typePage = false) {
    super()

    this.type = type

    if(typePage) this.typePage = typePage;

    // Ensure cache objects for this type are initialised
    if (!(type in idFeedCache)) {
      idFeedCache[type] = []
    }
    if (!(type in showFeedLists)) {
      showFeedLists[type] = []
      populateList(type)
    }

    // Pre-bind event handlers per instance
    this.onStorage = this.onStorage.bind(this)
    this.onStoriesUpdated = this.onStoriesUpdated.bind(this)
    this.startSocket = this.startSocket.bind(this)

    
    this.query = {
      perPage: 500,
      page: 1,
      fielteredField: {
        field1: {
          name: "translator_id",
          equals: this.typePage === 'personal', // true for num value in the field  
          diactivate: !(this.typePage === 'personal') && !(this.typePage === 'common')// is active
        }
      },
      fielteredFieldRule: "every" // some || every
    };
  }

  getState() {
    return {
      ids: idFeedCache[this.type],
      list: showFeedLists[this.type],
      allFeed: feedPerson + feedCommon,
      feedPerson: feedPerson,
      feedCommon: feedCommon
    }
  }

  itemUpdated(item, index) {
    if(index  === -1){
      showFeedLists[this.type].unshift(item);
    }else{
      showFeedLists[this.type][index] = item
    }
    itemFeedCache[this.type + item.id] = item
  }

  deleteItem(index, _, score){
    idFeedCache[this.type].splice(index,1);
    showFeedLists[this.type].splice(index,1);
    Store.updateScore(score);
  }

  /**
   * Emit an item id event if a storage key corresponding to an item in the
   * cache has changed.
   */
  onStorage(e) {
    if (itemFeedCache[e.key]) {
      this.emit(e.key)
    }
  }

  /**
   * Handle 
   */
  onStoriesUpdated(data) {
    
    if(Array.isArray(data) && data.length === 0) {
      idFeedCache[this.type]= [];
      return
    }
    let _self = this;
    if(Array.isArray(data)){
      let ids = data.reduce((acc, item, idx) => {
        itemFeedCache[_self.type + item.id] = item;
       
        return acc.concat(_self.type + item.id);
      },[]);
      showFeedLists[this.type] = [];
      idFeedCache[this.type]= ids;

    }else{

      // get object from socket
      if(this.type !== "topic" && this.type !== "pending-topic"){
        console.log('An error in the Store')
        return
      }
      
      if( data.translator_id && AuthStore.user.id !== data.translator_id) return // not for this user personal feed

      if(idFeedCache[this.type].indexOf(this.type + data.id) === -1 ) 
        idFeedCache[this.type].push(this.type + data.id);

      itemFeedCache[this.type + data.id] = Object.assign({}, itemFeedCache[this.type + data.id],  data);
    }

    populateList(this.type, this.query)
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
    if(AuthStore.alreadyInitSocket){
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
      window.io.socket.off('topic', this.onStoriesUpdated);
    }
  }
}


class Query {
  constructor(data, query) {
    this.isNotExeed = this.isNotExeed.bind(this);
    this.eqField = this.eqField.bind(this);
    this.filter = this.filter.bind(this);
    this.displayedCount = 0;
    this.data = data;
    this.query = query;
  }
  eqField = (fieldList, item, rule = "every") => {
    switch (rule) {
      case "every":
        return Object.values(fieldList).every(
          f => { 
            return(f.diactivate ? true : !!item[f.name] === f.equals)
          }
        );  
      case "some":
        return Object.values(fieldList).some(
          f =>{
            return(f.diactivate ? true : !!item[f.name] === f.equals)
          }
        );
    }
  };
  isNotExeed = (q, ind) => {
    if (q.perPage < 0) return true;
    return q.perPage * q.page - 1 >= this.displayedCount++;
  };

  filter = () => {
    return Object.values(this.data).filter(
      (item, idx) =>
        this.eqField(
          this.query["fielteredField"],
          item,
          this.query["fielteredFieldRule"]
        ) && this.isNotExeed(this.query, idx)
    );
  }
}