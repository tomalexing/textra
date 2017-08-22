import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import logo from './assets/logo.png';
import avatar from './assets/default-avatar.png';
import icon_arrow from './assets/arrow-down.png';
import icon_cost from './assets/cost-of-translation.svg';
import icon_dur from './assets/duration-of-translation.svg';
import icon_letternum from './assets/letter-number.svg';
import icon_search from './assets/search.svg';
import sl from './assets/swap-lang.svg';
import copy from './assets/icon-copy.svg';
import './polyfill';
import { Auth } from './index';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch,
  Prompt
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { 
    getUniqueKey, 
    addClass, 
    hasClass,
    removeClass, 
    debounce, 
    listener, 
    sleep,
    humanReadableTime,
    getMounthName,
    getFullMinutes
} from './utils';
import formSerialize from 'form-serialize';
import Select from 'react-select';
import PropTypes from 'prop-types';

import Batch from './components/Batch';
import Header from './components/Header';
import Indicator from './components/Indicator';
import Timer from './components/Timer';
import LangLabel from './components/LangLabel';
import StatefulEditor from './components/StatefulEditor';
import deepEqual from 'deep-equal';

import Store from './store/Store.js';
import {TxRest} from './services/Api.js';

class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.renders = 0;
    this._isMounted = false;
    this.updateHandler = this.updateHandler.bind(this);
    this.store = null;
  }

  state = {
    redirectToReferrer: false,
    isTablet: false,
    items: [],
    mainScreen: false,
    pendingTabs: [],
    historyTabs: [],
    page:{
      typePage: '',
      id: ''
    }
  }

  componentWillMount() {
    this.listeners.push(
      listener(window, 'resize', debounce((e) => {
        let isTablet = e.target.innerWidth <= 768 ? true : false;
        if (this.state.isTablet !== isTablet) this.setState({ isTablet })
      }, 200, false), false)
    );
    if(window.innerWidth <= 768) {
      console.log('768')
      this.setState({ isTablet: true })
    }
    this.doAtDidMount.forEach(func => func());

    let { location: { state: { page: {typePage, id: pageTypeId} }  = {page : {typePage : '', id :  ''}}  }} = this.props ; // holly shit
    this.setState({page:{typePage, id: pageTypeId}});

    let ids = Store.getIds('topic');
    if(ids && ids.length > 0){ // get from cache 
      let listItems = ids.map(id => {
        return Store.getItem(id);
      })
      this.updateHandler({from: 'cache', list: listItems})
    }

    this.store = new Store('topic');
  }

  componentDidMount(){
    this._isMounted = true;
    this.store.start();
    this.store.addListener('update', this.updateHandler);
  }

  updateHandler(data){
    console.log(data);
    let _self = this;
    this.setState(
    {
      pendingTabs : data.list.filter(o => o.status === "0").map((item, idx) => {
        return {
          ...item,
          avatar: avatar,
          index: idx
        }
      }),
      workingTabs : data.list.filter(o => o.status === "1").map((item, idx) => {
        return {
          uuid: item.id,
          avatar: avatar,
          title: 'Создать запрос на перевод',
          content: item.source_messages[0].content,
          cost: item.price,
          index: idx
        }
      }),
      historyTabs : data.list.filter(o => o.status === "2").map((item, idx) => {
        return {
          uuid: item.id,
          avatar: avatar,
          title: 'Создать запрос на перевод',
          content: item.source_messages[0].content,
          cost: item.price,
          index: idx
        }
      })
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.store.stop();
    this.store.removeListener('update', this.updateHandler);
    this.store = null;
  }

  componentWillUnmount() {
    this.listeners.forEach(removeEventListener => removeEventListener())
  }

  componentWillReceiveProps(props){
      const { mainScreen } = this.props.location.state || { mainScreen: false }
      this.setState({mainScreen});
  }
  
  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  render() {
    let { isTablet, mainScreen,  page: { typePage, id: pageTypeId }, pendingTabs } = this.state;
 
    return (
      <div className="f f-col outer dashboard-user">
        <Header />
        <div className="f h100">
          <div className="f f-align-2-2 outer-left"  style={{display:`${!isTablet?'flex':mainScreen?'none':'flex'}`}}>
            <div className="f sidebar">

              {/* CREATE TAB */}
              <Link to={{pathname:'/dashboard/create', state: {mainScreen: true, page:{typePage: 'create', id: undefined}}}} className="f f-align-1-2 dashboard-user__create-tab" >
                <div className="dashboard-user__create-tab-plus">
                </div>
                <div className="dashboard-user__create-tab-content">Создать запрос на перевод
                </div>
              </Link>


              {/* PENDINGS/INWORK TAB */} 
              { pendingTabs.map(tab => {
                return (
                  <Link  to={{pathname:`/dashboard/pending/${tab.id}`,state: {mainScreen: true, page:{typePage: 'pending', id: tab.id}}}} className={`f f-align-1-2 dashboard-user__search-tab ${tab.id === pageTypeId ? 'selected' : ''}`} key={tab.index}>
                    <figure className="f f-align-2-2 dashboard-user__search-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__search-tab-details">
                      <div className="dashboard-user__search-tab-title"> Поиск переводчика </div>
                      <div className="dashboard-user__search-tab-content"> {tab.source_messages[0].content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__search-tab-info">
                    </div>
                  </Link>
                )
              })}

              {/* History TAB */}
              {this.state.historyTabs.map(tab => {
                let publishTime = new Date(tab.publishTime);
                return (
                  <Link to={{pathname:`/dashboard/user/${tab.uuid}`, state: {mainScreen: true}, page:{typePage: 'history', id: tab.id}}}  className={`f f-align-1-2 dashboard-user__history-tab ${tab.uuid === pageTypeId ? 'selected' : ''}`} key={tab.index}>
                    <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                      <div className="dashboard-user__history-tab-title"> {tab.title} </div>
                      <div className="dashboard-user__history-tab-content"> {tab.source_messages[0].content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__history-tab-info">
                      <div className="dashboard-user__history-tab-info__time">
                        <Timer start={tab.startWorkingTime} duration={tab.duration} />
                        <time>{`${publishTime.getHours()}:${getFullMinutes(publishTime.getMinutes())}`}</time></div>
                        <LangLabel from={tab.from} to={tab.to} selected={tab.id === pageTypeId} />
                      <div className="dashboard-user__history-tab-info__money">{tab.cost}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="f outer-right" ref={n => this.toggleElem = n}  style={{display:`${!isTablet?'flex':mainScreen?'flex':'none'}`}}>
            <div className="main f f-col f-align-2-2">
              {console.log(this.state.isTablet)}
              {this.state.isTablet?
                <div className="f f-align-1-2 breadcrumbs">
                    <button onClick={() => { this.setState({mainScreen: false}) }} className="f f-align-2-2 btn btn-flat breadcrumbs__back" ><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12"><path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" /></svg>Назад</button> 
                    <span>{'переводчик'||'ожидается'}</span>
                </div>
              :''}
              <Switch>
                <RoutePassProps path="/dashboard/create" component={Create} store={this.store}/>
                <RoutePassProps path="/dashboard/pending/:id" component={Pending} typePage={typePage} id={pageTypeId} 
                 data={Array.isArray(pendingTabs)? pendingTabs.find(o=> o.id == pageTypeId):null} store={this.store} />
                <RoutePassProps path="/dashboard/user/:id" component={HistoryList} isTablet={this.state.isTablet} typePage={typePage} id={pageTypeId}  store={this.store}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const RoutePassProps = ({ component: Component, ...rest }) => (
  <Route  {...rest} render={props => (
    <Component  {...props} {...rest} />
  )
  } />
)


class HistoryList extends React.Component { 
  
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  copy(e) {
    let textAreaSelector = null;
    try {
      Array.from(e.currentTarget.closest('.dashboard-user__history-reply').children).forEach((value, index) => {  // hard coded selector I should make up better
        if (value.querySelector('textarea')) {
          textAreaSelector = value.querySelector('textarea');
          textAreaSelector.disabled = false;
          textAreaSelector.select();
        }
      })
      var successful = document.execCommand('copy');
      textAreaSelector.disabled = true;
    } catch (err) {
      console.log('Ха ха, бери и копируй руками');
    }
  }

  render() {
    let _self = this;
    let { currentDate } = this.props
    let publishTime = new Date(currentDate.publishTime);
    return (
      <div className={'f f-col f-align-1-1 dashboard-user__history'}>
        <div className={'data__delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-post '}>
          <div className={'dashboard-user__history-post__avatar'}>
            <img src={currentDate.avatar} alt={currentDate.nickname} />
          </div>
          <div className={'dashboard-user__history-post__content'}>
            <div className={'dashboard-user__history-post__content__text'}>
              {currentDate.content}
            </div>
            <div className={'f f-align-1-2 f-gap-4 dashboard-user__history-post__content__bottombar'}>
              <LangLabel from={currentDate.from} to={currentDate.to} />
              <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(currentDate.duration)} hint={'Длительность перевода'} />
              <Indicator
                className={'f f-align-2-2'}
                icon={
                  <Timer
                    start={currentDate.startWorkingTime}
                    duration={currentDate.duration}
                    isBig={true} />
                }
                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)} // sec
                hint={'Оставшееся время'} />
              <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
              <Indicator className={'f f-align-2-2'} icon={icon_cost} value={Math.round(currentDate.cost)} hint={'Стоимость'} />

            </div>
          </div>
          <div className={'dashboard-user__history-post__constols'}>
          </div>
          <div className={'dashboard-user__history-post__date'}>
            {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
          </div>
        </div>

        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-reply'}>
          <div className={'dashboard-user__history-reply__avatar'}>
            <img src={currentDate.avatar} alt={currentDate.nickname} />
          </div>
          <div className={'dashboard-user__history-reply__content'}>
            <textarea ref={ (() => {let start = 50, ref, isTablet = _self.props.isTablet ; return (node) => {
                    if(node == null ) return
                    ref = node;
                    if( !(_self.props.isTablet && isTablet) ){ // when has changed
                      start = 50;
                      isTablet = _self.props.isTablet;
                    }
                    start = Math.max(ref.scrollHeight, start);
                    ref.style.height = start + 'px';
                  }})()}  className={'dashboard-user__history-reply__content__text'} disabled  value={currentDate.content} />
          </div>
          <div className={'dashboard-user__history-reply__constols'}>
            <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy}>
              <img src={copy} alt="copy" />
              <span>Копировать</span>

            </button>
          </div>
          <div className={'dashboard-user__history-reply__date'}>
            {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
          </div>
        </div>
        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-reply'}>
          <div className={'dashboard-user__history-reply__avatar'}>
            <img src={currentDate.avatar} alt={currentDate.nickname} />
          </div>
          <div className={'dashboard-user__history-reply__content'}>
              <textarea ref={ (() => {let start = 20, ref, isTablet = _self.props.isTablet ; return (node) => {
                    if(node == null ) return
                    ref = node;
                    if( !(_self.props.isTablet && isTablet) ){ // when has changed
                      start = 20;
                      isTablet = _self.props.isTablet;
                    }
                    start = Math.max(ref.scrollHeight, start);
                    ref.style.height = start + 'px';
                  }})()}
                className={'dashboard-user__history-reply__content__text'} disabled value={currentDate.content} />
          </div>
          <div className={'dashboard-user__history-reply__constols'}>
            <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy} >
              <img src={copy} alt="copy" />
              <span>Копировать</span>
              <input type="hidden" value={currentDate.content} />
            </button>
          </div>
          <div className={'dashboard-user__history-reply__date'}>
            {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
          </div>
        </div>

        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-create'}>
          <div className={'dashboard-user__history-reply__avatar'}></div>
          <Link to={{pathname:'/dashboard/create',state:{mainScreen:true}}} className="f f-align-1-2 dashboard-user__history-create__content" >
            <div className="dashboard-user__history-create__content__plus"></div>
            <div className="dashboard-user__history-create__content__text">Создать персональный запрос на перевод</div>
          </Link>
          <div className={'dashboard-user__history-reply__constols'}></div>
          <div className={'dashboard-user__history-post__date'}></div>
        </div>

      </div>
    )
  }
}

class Pending extends React.Component {


  constructor(p){
    super(p);
    this.store = this.props.store;
    this.id = this.props.id;
    this.languageStore = null;
    this.updateLanguageHandler = this.updateLanguageHandler.bind(this);
  }

  state= {
    currentData: this.props.data,
    language: null
  }

  componentWillMount(){
    this.languageStore = new Store('language');
    let languageStoredIds = Store.getIds('language');
    if(languageStoredIds.length) {
      let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
      this.updateLanguageHandler({list : langsFromStore});
    }
  }
  async componentDidMount() {
    while (1) {
      const prev = this.state.items
      const items = [`Hello World #${prev.length}`, ...prev]
      this.setState({ items })
      await sleep(Math.random() * 30)
    }
  }
  async componentDidMount(){
    let _self = this; 
    TxRest.getData(`topic/${this.id}`).then((data, err) => {
        if(err) return;
        let item = Object.assign({}, _self.state.currentData, data, _self.state.currentData.index );
        _self.setState({ currentData: item});
        _self.store && _self.store.itemUpdated(item, item.index);
    })

    if(!this.store.language){
      this.languageStore.start(); //this will updates not on every click 
    }
    this.languageStore.addListener('update', this.updateLanguageHandler);
  }

  componentWillReceiveProps(newProps){
    this.store = newProps.store;
  }

  updateLanguageHandler({list}){
      this.setState({language: list})
  }


  componentWillUnmount(){
    this.languageStore.removeListener('update', this.updateLanguageHandler);
    this.languageStore.stop();
    this.languageStore = null;
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  getLangPropInObj({id,slug}){
    return this.state.language.find(o => o.id === id)[slug]
  }

  render() {
  
    let { currentData } = this.state,
      created_at = null;
    if(!currentData)
        return <div/>
    if(currentData.created_at){
      created_at = new Date(currentData.created_at);
      currentData.duration = currentData.source_messages[0].letters_count * this.getLangPropInObj({id: currentData.translate_language_id, slug:'letter_time'})
    }
    return (
        <div className={'f f-col f-align-1-1 dashboard-user__searching'}>
            {currentData.created_at && <div className={'data__delimiter'}>{created_at.getDate()} {getMounthName(created_at.getMonth())}, {created_at.getFullYear()} </div>}
            <div className={'f f-align-1-11 f-gap-2 dashboard-user__searching-post '}>
              <div className={'dashboard-user__searching-post__avatar'}>
                <img src={currentData.avatar} />
              </div>
              <div className={'dashboard-user__searching-post__content'}>
                <div className={'dashboard-user__searching-post__content__text'}>
                  {currentData.source_messages[0].content}
                </div>
                <div className={'f f-align-1-2 f-gap-4 dashboard-user__searching-post__content__bottombar'}>
                  {currentData.source_language_id && currentData.translate_language_id &&  
                  <LangLabel 
                    from={this.getLangPropInObj({id: currentData.source_language_id, slug:'code'})} 
                    to={this.getLangPropInObj({id: currentData.translate_language_id, slug:'code'})} 
                    />
                  }

                  <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(currentData.duration)} hint={'Длительность перевода'} />
                  <Batch
                    flushCount={0}
                    flushInterval={150} 
                    count={1}
                    debug={false}
                    render={()=> {
                      let value = ~~Math.abs(currentData.duration - (new Date - new Date(currentData.startWorkingTime || currentData.created_at)) / 1000);
                      //console.log(value)
                      return(<Indicator
                        className={'f f-align-2-2'}
                        icon={
                          <Timer
                            start={currentData.created_at}
                            duration={currentData.duration}
                            isBig={true} />}
                        value={humanReadableTime(value)}
                        hint={'Оставшееся время'} />)
                    }}/>
                  <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentData.source_messages[0].letters_count} hint={'Количество символов'} />
                  <Indicator className={'f f-align-2-2'} icon={icon_cost} value={currentData.source_messages[0].letters_count * this.getLangPropInObj({id: currentData.translate_language_id, slug:'letter_price'})} hint={'Стоимость'} />
                </div>
              </div>
              <div className={'dashboard-user__searching-post__constols'}>
              </div>
              {created_at && <div className={'dashboard-user__searching-post__date'}>
                {created_at.getHours()}:{getFullMinutes(created_at.getMinutes())}
              </div>}
            </div>
          </div>
    )
  }
}



class Create extends React.Component {
  constructor(props) {
    super(props);
    this.currentNumberOfChar = this.currentNumberOfChar.bind(this);
    this.updateValueLangFrom = this.updateValueLangFrom.bind(this);
    this.updateValueLangTo = this.updateValueLangTo.bind(this);
    this.optionTranslatorField = this.optionTranslatorField.bind(this);
    this.valueTranslatorField = this.valueTranslatorField.bind(this);
    this.updateValueTranslator = this.updateValueTranslator.bind(this);
    this.swapLang = this.swapLang.bind(this);
    this.callTranslatorSearchNenu = this.callTranslatorSearchNenu.bind(this);
    this.makeSearchMenuTranslatorUnnisible = this.makeSearchMenuTranslatorUnnisible.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
    this.languageStore = null;
    this.updateHandler = this.updateHandler.bind(this);
    this.getIdLang = this.getIdLang.bind(this);
  }


  state = {
    optionsLang: [],
    valueLangFrom: 'RUS',
    valueLangTo: 'ENG',
    valueTranslator: undefined,
    currentNumberOfChar: 0,
    isSearchMenuTranslatorVisible: false,
    isBlocking: false,
    translatorMessage: '',
    letterPrice: 1,
    letterTime: 1
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  componentDidMount(){
    this.languageStore = new Store('language');
    let languageStoredIds = Store.getIds('language');
    if(languageStoredIds.length) { 
      let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
      this.updateHandler({list : langsFromStore});
    }else{
      this.languageStore.start(); //this will updates not on every click 
    }
    this.languageStore.addListener('update', this.updateHandler);
  }

  componentWillUnmount(){
    this.languageStore.removeListener('update', this.updateHandler);
    this.languageStore.stop();
    this.languageStore = null;
  }

  getIdLang(value){
    return this.state.optionsLang.filter(o => o.value === value)[0]['id']
  }
  
  getAttrByValue(list, prop){
    return list.filter(o => o.value === prop)[0]
  }

  convertToAproppriateObject(arr){
    return arr.map(({code, created_at, id, letter_price, letter_time, name, updated_at}) => {return{
      value: code,
      created_at,
      id,
      letterPrice: letter_price,
      letterTime : letter_time,
      label: name,
      updated_at
    }})
  }

  updateHandler(data){
    let optionsLang =  this.convertToAproppriateObject(data.list);
    let toLangObj = this.getAttrByValue(optionsLang, this.state.valueLangTo);
    this.setState({
      optionsLang,
      letterTime: toLangObj['letterTime'],
      letterPrice: toLangObj['letterPrice']
    });
  
  }

  onSubmit(e){
    e.preventDefault();
    let {create:{to, from, message}} = formSerialize(e.target, { hash: true, empty: true });
    let data = {
      "source_language_id": this.getIdLang(from),
      "translate_language_id": this.getIdLang(to),
       message
    }
    TxRest.putData('topic', data).then((data, err) => {
      if(err) return
      this.setState({ translatorMessage: '', isBlocking: false }, ()=>{
        this.props.store.stop();
        this.props.store.start();
      })
    })
  } 
 
  currentNumberOfChar({target: {value}}) {
    let currentNumberOfChar = value.length;
    this.setState({ currentNumberOfChar, isBlocking: value.length >  0, translatorMessage: value })
  }

  updateValueLangFrom(valueLangFrom) {
    this.setState({ valueLangFrom });
  }

  updateValueLangTo(valueLangTo) {
    let toLangObj = this.getAttrByValue(this.state.optionsLang, valueLangTo);
    this.setState({
      valueLangTo,
      letterTime: toLangObj['letterTime'],
      letterPrice: toLangObj['letterPrice']
    });
  }

  updateValueTranslator(valueTranslator) {
    if (Object.prototype.toString.call(valueTranslator) === "[object Array]") {
      valueTranslator = undefined
    }

    this.setState({ valueTranslator, isSearchMenuTranslatorVisible: false });

  }

  optionTranslatorField(v) {
    if (!(v.login || v.value)) return <div><img style={{ width: '30px' }} src={avatar} /> <span>Переводчик</span></div>;
    let customInput = <div> <img style={{ width: '30px' }} src={avatar} /><span style={{ marginLeft: '10px' }}>{v.login || v.value}</span></div>
    return customInput;
  }

  valueTranslatorField(v) {

  }

  callTranslatorSearchNenu() {
    this.setState({
      isSearchMenuTranslatorVisible: true
    })
    this.createTranslatorMenu.focus();
  }

  makeSearchMenuTranslatorUnnisible() {
    this.setState({
      isSearchMenuTranslatorVisible: false
    })
  }

  getUsers(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`https://api.github.com/search/users?q=${input}`)
      .then((response) => response.json())
      .then((json) => {
        return { options: json.items };
      });
  }

  arrowElementTranslator() {
    return <img src={icon_search} />
  }

  arrowElementLangs({ isOpen }) {
    if (isOpen)
      return <img style={{ transform: 'rotate(-90deg)' }} src={icon_arrow} />
    else
      return <img style={{ transform: 'rotate(90deg)' }} src={icon_arrow} />
  }

  swapLang() {
    let to = this.state.valueLangTo,
      from = this.state.valueLangFrom,
      toLangObj = this.getAttrByValue(this.state.optionsLang, to);

    this.setState({
      valueLangFrom: to,
      valueLangTo: from,
      letterTime: toLangObj['letterTime'],
      letterPrice: toLangObj['letterPrice']
    })
  }

  render() {
    const { optionsLang, valueLangFrom, valueLangTo, currentNumberOfChar,
      valueTranslator, isSearchMenuTranslatorVisible, isBlocking, translatorMessage, letterTime, letterPrice } = this.state;

    return (
      <div ref={(n) => this.createFrom = n} className={'f f-col dashboard-user__create-forms'}>
      <form onSubmit={this.onSubmit} className={'f f-col dashboard-user__create-forms'}>
         <Prompt
                when={this.state.isBlocking}
                message={location => (
                  `Вы уверены, что хотите уйти`
                )}
          />
          <div className={'dashboard-user__create-topbar f f-align-1-2 f-row f-gap-4'}>
            <Select
              ref={(n) => this.createLangFrom = n}
              name="create[from]"
              autofocus
              options={optionsLang}
              disabled={false}
              simpleValue
              value={valueLangFrom}
              onChange={this.updateValueLangFrom}
              searchable={false}
              autosize={true}
              clearable={false}
              arrowRenderer={this.arrowElementLangs} />
            <div className={'u-my-1 dashboard-user__create-swaplang'} onClick={this.swapLang} ><img src={sl} alt="swap language" /></div>
            <Select
              ref={(n) => this.createLangTo = n}
              name="create[to]"
              autofocus
              options={optionsLang}
              simpleValue
              disabled={false}
              value={valueLangTo}
              onChange={this.updateValueLangTo}
              searchable={false}
              autosize={true}
              clearable={false}
              arrowRenderer={this.arrowElementLangs}
            />
            <div className={'dashboard-user__create-topbar__chooser'}  >
              <div className={'f f-align-2-2 dashboard-user__create-topbar__chooser-trigger'} onClick={this.callTranslatorSearchNenu} >
                <img className={'dashboard-user__create-topbar__chooser-trigger__avatar'} style={{ width: '30px' }} src={avatar} />
                <span className={'dashboard-user__create-topbar__chooser-trigger__name'} >{(!!valueTranslator && (valueTranslator.login || valueTranslator.value)) || 'Переводчик'}</span>
                <span className={'dashboard-user__create-topbar__chooser-trigger__arrow'} >{this.arrowElementLangs({ isOpen: isSearchMenuTranslatorVisible })}</span>
              </div>
              <div className={`dashboard-user__create-topbar__chooser-menu ${isSearchMenuTranslatorVisible ? 'show-chooser-menu' : ''}`}>
                <Select.Async
                  ref={(n) => this.createTranslatorMenu = n}
                  name="create[translator]"
                  autofocus
                  options={optionsLang}
                  disabled={false}
                  value={valueTranslator}
                  onChange={this.updateValueTranslator}
                  searchable={true}
                  autosize={true}
                  clearable={false}
                  openOnFocus={true}
                  placeholder={'Переводчик'}
                  searchPromptText={'Начните вводить имя'}
                  noResultsText={'Не найдено'}
                  className='dashboard-user__create-topbar__translator'
                  valueRenderer={this.valueTranslatorField}
                  optionRenderer={this.optionTranslatorField}
                  arrowRenderer={this.arrowElementTranslator}
                  loadOptions={this.getUsers}
                  onBlur={this.makeSearchMenuTranslatorUnnisible}
                  onValueClick={this.makeSearchMenuTranslatorUnnisible}

                />
              </div>
            </div>
          </div>
          <div className={'dashboard-user__create-posteditor'}>
            <textarea
              type="text"
              tabIndex={1}
              name="create[message]"
              value={translatorMessage}
              placeholder={'Ваш запрос на перевод...'}
              onChange={this.currentNumberOfChar}
            />
          </div>
          <div className={'f f-align-1-2 f-row dashboard-user__create-bottombar f-gap-4'}>

            <Indicator className={'f f-align-2-2 '} icon={icon_dur} value={humanReadableTime(currentNumberOfChar * letterTime)} hint={'Длительность перевода'} />
            <Indicator className={'f f-align-2-2 '} icon={icon_letternum} value={currentNumberOfChar} hint={'Количество символов'} />
            <Indicator className={'f f-align-2-2 '} icon={icon_cost} value={`$${Number(letterPrice * currentNumberOfChar).toFixed(2)}`} hint={'Стоимость перевода'} />

          <input type="submit" value='Отправить' className={'submit-post btn btn-primiry btn-mini '} />
             
          </div>
      </form>
      </div>
    )


  }
}




export default withRouter(DashBoard);


   // const Users = {
    //   'wqefeq': {
    //     uuid: 'alex',
    //     nickname: 'alex',
    //     avatar: avatar,
    //     title: 'Создать запрос на перевод',
    //     content: 'Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d',
    //     contentFull: 'Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d',
    //     opened: false,
    //     publishTime: (new Date(new Date - 100000)).toISOString(),
    //     startWorkingTime: (new Date).toISOString(),
    //     duration: 241,
    //     letterNumber: 213,
    //     startTime: '12:32',
    //     from: 'RUS',
    //     to: 'ENG',
    //     cost: '$0.33'
    //   }, 
    //   'wqerq': {
    //     uuid: 'alex_alex',
    //     nickname: 'alex_alex',
    //     avatar: avatar,
    //     title: 'Создать запрос на перевод',
    //     content: 'Создать запрос на перевод',
    //     contentFull: 'ффффффСоздать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
    //     publishTime: (new Date(new Date - 100000)).toISOString(),
    //     startWorkingTime: (new Date(new Date - 100000)).toISOString(),
    //     duration: 634,
    //     startTime: '12:32',
    //     letterNumber: 213,
    //     opened: false,
    //     from: 'ENG',
    //     to: 'CHN',
    //     cost: '$11.33'
    //   }
    // }