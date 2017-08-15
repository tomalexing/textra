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

class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.renders = 0;
    this._isMounted = false;
  }

  state = {
    redirectToReferrer: false,
    isTablet: false,
    items: [],
    mainScreen: false
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
  }

  componentDidMount(){
    this._isMounted = true;
    this.store = new Store('mylist');
    this.store.start();
    this.store.addListener('update', this.updateHandler);
  }

  updateHandler(data){
    console.log(data);
    if(!this._isMounted) return
    let _self = this;
    // if( data.list[0] === null ) {
    //   Promise.all(data.ids.map(id => TxRest.getDataByID('r', id)))
    //         .then((list) => {
    //             list.map((item, index) => _self.store.itemUpdated(item.value, index))
    //             let {list: usersList , ids} = _self.store.getState();
    //             _self.setState({usersList: usersList, usersListFetched: usersList})})
    // }else{

    //     _self.setState({usersList: data.list, usersListFetched: data.list})
    //     Promise.all(data.ids.map(id => TxRest.getDataByID(this.props.page.pageType.slice(0, -1), id)))
    //         .then(async list => { await sleep(10000); return Promise.resolve(list)})
    //         .then((list) => {
    //             if(!this._isMounted) return
    //             list.map((item, index) => _self.store.itemUpdated(item.value, index))
    //             let {list: usersList , ids} = _self.store.getState();
    //             _self.setState({usersList: usersList, usersListFetched: usersList})})
    // }
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
    let { location: { pathname } } = this.props;
    let activeTabA = pathname.split('/');
    let activeTab = /user/.test(pathname) && pathname.split('/')[activeTabA.length - 1] || false;
    let activeSearch = /searching/.test(pathname) && pathname.split('/')[activeTabA.length - 1] || false;

    const Searching = {
      'wqefeq': {
        uuid: 'wqefeq',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        publishTime: (new Date).toISOString(),
        startWorkingTime: (new Date(new Date - 1000000)).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: 'RUS',
        to: 'ENG',
        cost: '$0.33'
      },
      'wqerq': {
        uuid: 'wqerq',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод',
        publishTime: (new Date).toISOString(),
        startWorkingTime: (new Date).toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: 'ENG',
        to: 'CHN',
        cost: '$11.33'
      }
    }
    const Users = {
      'wqefeq': {
        uuid: 'alex',
        nickname: 'alex',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d',
        contentFull: 'Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d',
        opened: false,
        publishTime: (new Date(new Date - 100000)).toISOString(),
        startWorkingTime: (new Date).toISOString(),
        duration: 241,
        letterNumber: 213,
        startTime: '12:32',
        from: 'RUS',
        to: 'ENG',
        cost: '$0.33'
      }, 
      'wqerq': {
        uuid: 'alex_alex',
        nickname: 'alex_alex',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод',
        contentFull: 'ффффффСоздать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        publishTime: (new Date(new Date - 100000)).toISOString(),
        startWorkingTime: (new Date(new Date - 100000)).toISOString(),
        duration: 634,
        startTime: '12:32',
        letterNumber: 213,
        opened: false,
        from: 'ENG',
        to: 'CHN',
        cost: '$11.33'
      }
    }

    const find = (objs, id) => Object.values(objs).find(o => o.uuid == id)

    let currentDate = activeTab ? find(Users, activeTab) : activeSearch ? find(Searching, activeSearch) : {};
    let {isTablet,mainScreen} = this.state || {isTablet: false, mainScreen: false}
    return (
      <div className="f f-col outer dashboard-user">
        <Header />
        <div className="f h100">
          <div className="f f-align-2-2 outer-left"  style={{display:`${!isTablet?'flex':mainScreen?'none':'flex'}`}}>
            <div className="f sidebar">
              <Link  to={{pathname:'/dashboard/create', state: {mainScreen: true}}} className="f f-align-1-2 dashboard-user__create-tab" >
                <div className="dashboard-user__create-tab-plus">
                </div>
                <div className="dashboard-user__create-tab-content">Создать запрос на перевод
                </div>
              </Link>

              {/*<Batch
                flushCount={10}
                flushInterval={150}
                count={this.state.items.length}
                render={this.list}
                debug
              />*/}

              {Object.values(Searching).map((tab, index) => {
                let publishTime = new Date(tab.publishTime);
                return (
                  <Link  to={{pathname:`/dashboard/searching/${tab.uuid}`,state: {mainScreen: true}}} className={`f f-align-1-2 dashboard-user__search-tab ${tab.uuid === activeSearch ? 'selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__search-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__search-tab-details">
                      <div className="dashboard-user__search-tab-title">{tab.title} </div>
                      <div className="dashboard-user__search-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f  f-col f-align-2-3 dashboard-user__search-tab-info">
                      <div className="dashboard-user__search-tab-info__time">
                        <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time></div>
                      <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
                      <div className="dashboard-user__search-tab-info__money">{tab.cost}</div>
                    </div>
                  </Link>
                )
              })}

              {Object.values(Users).map((tab, index) => {
                let publishTime = new Date(tab.publishTime);
                return (
                  <Link to={{pathname:`/dashboard/user/${tab.uuid}`, state: {mainScreen: true}}}  className={`f f-align-1-2 dashboard-user__history-tab ${tab.uuid === activeTab ? 'selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                      <div className="dashboard-user__history-tab-title"> {tab.title} </div>
                      <div className="dashboard-user__history-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__history-tab-info">
                      <div className="dashboard-user__history-tab-info__time">
                        <Timer start={tab.startWorkingTime} duration={tab.duration} />
                        <time>{`${publishTime.getHours()}:${getFullMinutes(publishTime.getMinutes())}`}</time></div>
                      <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
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
                    <span>{currentDate.nickname}</span>
                </div>
              :''}
              <Switch>
                <RoutePassProps path="/dashboard/create" component={Create} currentDate={currentDate} />
                <RoutePassProps path="/dashboard/searching/:id" component={Search} currentDate={currentDate} />
                <RoutePassProps path="/dashboard/user/:id" component={HistoryList} isTablet={this.state.isTablet}currentDate={currentDate} />
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
                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)}
                hint={'Оставшееся время'} />
              <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
              <Indicator className={'f f-align-2-2'} icon={icon_cost} value={currentDate.cost} hint={'Стоимость'} />

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



class Search extends React.Component {

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }
  render() {

    let { currentDate } = this.props
    let publishTime = new Date(currentDate.publishTime);
    return (
      <div className={'f f-col f-align-1-1 dashboard-user__searching'}>
        <div className={'data__delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
        <div className={'f f-align-1-11 f-gap-2 dashboard-user__searching-post '}>
          <div className={'dashboard-user__searching-post__avatar'}>
            <img src={currentDate.avatar} alt={currentDate.nickname} />
          </div>
          <div className={'dashboard-user__searching-post__content'}>
            <div className={'dashboard-user__searching-post__content__text'}>
              {currentDate.content}
            </div>
            <div className={'f f-align-1-2 f-gap-4 dashboard-user__searching-post__content__bottombar'}>
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
                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)}
                hint={'Оставшееся время'} />
              <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
              <Indicator className={'f f-align-2-2'} icon={icon_cost} value={currentDate.cost} hint={'Стоимость'} />
            </div>
          </div>
          <div className={'dashboard-user__searching-post__constols'}>
          </div>
          <div className={'dashboard-user__searching-post__date'}>
            {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
          </div>
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
  }

  state = {
    optionsLang: [
      { value: 'Eng', label: 'Английский' },
      { value: 'Rus', label: 'Русский' },
    ],
    valueLangFrom: 'Rus',
    valueLangTo: 'Eng',
    valueTranslator: undefined,
    currentNumberOfChar: 0,
    isSearchMenuTranslatorVisible: false,
    isBlocking: false
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  currentNumberOfChar({target: {value}}) {
    let currentNumberOfChar = value.length;
    this.setState({ currentNumberOfChar, isBlocking: value.length >  0 })
  }

  updateValueLangFrom(valueLangFrom) {
    this.setState({ valueLangFrom });
  }

  updateValueLangTo(valueLangTo) {
    this.setState({ valueLangTo });
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
      from = this.state.valueLangFrom;

    this.setState({
      valueLangFrom: to,
      valueLangTo: from
    })
  }

  render() {
    const { optionsLang, valueLangFrom, valueLangTo, currentNumberOfChar,
      valueTranslator, isSearchMenuTranslatorVisible, isBlocking } = this.state;

    return (
      <div ref={(n) => this.createFrom = n} className={'f f-col dashboard-user__create-forms'}>
      <form className={'f f-col dashboard-user__create-forms'}>
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
              name="create[posteditor]"
              placeholder={'Ваш запрос на перевод...'}
              onChange={this.currentNumberOfChar}
            />
          </div>
          <div className={'f f-align-1-2 f-row dashboard-user__create-bottombar f-gap-4'}>

            <Indicator className={'f f-align-2-2 '} icon={icon_dur} value={humanReadableTime(currentNumberOfChar * 1)} hint={'Длительность перевода'} />
            <Indicator className={'f f-align-2-2 '} icon={icon_letternum} value={currentNumberOfChar} hint={'Количество символов'} />
            <Indicator className={'f f-align-2-2 '} icon={icon_cost} value={`$${Number(0.05 * currentNumberOfChar).toFixed(2)}`} hint={'Стоимость перевода'} />

          <input type="submit" value='Отправить' className={'submit-post btn btn-primiry btn-mini '} />
             
          </div>
      </form>
      </div>
    )


  }
}




export default withRouter(DashBoard);
