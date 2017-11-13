import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import logo from './assets/logo.png';
import avatar from './assets/default-avatar.png';
import avatarLite from './assets/avatar-lite.png';
import avatarAll from './assets/avatar-all.png';
import animatedAvatar from './assets/default-avatar.svg';
import icon_arrow from './assets/arrow-down.png';
import icon_cost from './assets/cost-of-translation.svg';
import icon_dur from './assets/duration-of-translation.svg';
import icon_letternum from './assets/letter-number.svg';
import icon_search from './assets/search.svg';
import sl from './assets/swap-lang.svg';
import copy from './assets/icon-copy.svg';
import cancel from './assets/icon-cancel.svg';
import './polyfill';
import  Auth from './store/AuthStore.js';
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
    getMonthName,
    getFullTimeDigits,
    getDayName,
    quickSort,
    ScrollRestortion,
    withGracefulUnmount,
    getTabTime
} from './utils';
import formSerialize from 'form-serialize';
import Select from 'react-select';
import PropTypes from 'prop-types';

import Batch from './components/Batch';
import Header from './components/Header';
import Indicator from './components/Indicator';
import Timer from './components/Timer';
import LangLabel from './components/LangLabel';
import TabDelimiter from './components/TabDelimiter';
import StatefulEditor from './components/StatefulEditor';
import deepEqual from 'deep-equal';

import Store from './store/Store.js';
import MessageStore from './store/MessageStore.js';
import {TxRest} from './services/Api.js';

function parseJSON(json, defaultValue) {
  return (json ? JSON.parse(json) : defaultValue)
}

class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.renders = 0;
    this._isMounted = false;
    this.updateHandler = this.updateHandler.bind(this);
    this.updateLanguageHandler = this.updateLanguageHandler.bind(this);
    this.updateTranslatorHandler = this.updateTranslatorHandler.bind(this);
    this.getLangPropInObj = this.getLangPropInObj.bind(this);
    this.visitedIndex = this.visitedIndex.bind(this);
    this.store = null;
    this.languageStore = null;
    this.translatorStore = null;

    this.viewedHistoryTabs = parseJSON(window.sessionStorage.viewedHistoryTabs, {});
  }

  state = {
    redirectToReferrer: false,
    isTablet: false,
    mainScreen: false,
    pendingTabs: [],
    historyTabs: [],
    workingTabs: [],
    page:{
      typePage: '',
      id: ''
    },
    language: [],
    translator: {},
    translators: [],
    notShowWellcome: JSON.parse(window.localStorage.getItem('notShowWellcome'))
  }

  componentWillMount() {
    let { location: { state: { page: {typePage, id: pageTypeId}, mainScreen,  translator }  = {page : {typePage : '', id :  ''}, translator: '' }  }} = this.props ; // holly shit
    this.setState({page:{typePage, id: pageTypeId}, translator, mainScreen});
  } 

  componentDidMount(){
    
    this._isMounted = true;

    this.listeners.push(
      listener(window, 'resize', debounce((e) => {
        let isTablet = e.target.innerWidth <= 768 ? true : false;
        if (this.state.isTablet !== isTablet &&  this._isMounted ) this.setState({ isTablet })
      }, 200, false), false)
    );
 
    if(window.innerWidth <= 768 &&  this._isMounted) {
      this.setState({ isTablet: true })
    }

    this.doAtDidMount.forEach(func => func());
    
    this.store = new Store('topic');
    let ids = Store.getIds('topic');
    if(ids && ids.length > 0){ // get from cache 
      let listItems = ids.map(id => {
        return Store.getItem(id);
      })
      this.updateHandler({from: 'cache', list: listItems})
    }
    this.store.start();
    this.store.addListener('update', this.updateHandler);




    this.languageStore = new Store('language');
    let languageStoredIds = Store.getIds('language');
    if(languageStoredIds && languageStoredIds.length) {
      let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
      this.updateLanguageHandler({list : langsFromStore});
    }
    this.languageStore.start();
    this.languageStore.addListener('update', this.updateLanguageHandler);


    this.translatorStore = new Store('translator');
    let translatorStoredIds = Store.getIds('translator');
    if(translatorStoredIds && translatorStoredIds.length) {
      let translatorListFromStore = translatorStoredIds.map(id => Store.getItem(id));
      this.updateTranslatorHandler({list : translatorListFromStore});
    }
    this.translatorStore.start();
    this.translatorStore.addListener('update', this.updateTranslatorHandler);

  }

  updateTranslatorHandler({list}){
    if(!this._isMounted) return
    this.setState({translators: list})
  }
  
  updateHandler(data){
    if(!this._isMounted) return
    let _self = this;
    
    let uniqueHistoryIds = [];
    this.setState({
      pendingTabs : data.list.filter(o => o.status === "0").map((item, idx) => {
          return {
            ...item,
            index: idx
          }
      }),

      workingTabs : data.list.filter(o => o.status === "1").map((item, idx) => {
          return {
            ...item,
            index: idx
          }
      }),

      historyTabs : data.list.filter(o => o.status === "2").reduce((acc, item, idx) => {
          if( ! uniqueHistoryIds.includes(item.translator_id) ){
            uniqueHistoryIds.push( item.translator_id );
            Object.entries( _self.viewedHistoryTabs ).map(o => {
              
              if(o[0] ==  item.translator_id){

                TxRest.patchData(`topic/${item.id}/status/viewed`).
                  then(data => {
                    if(!data.message)
                      item.viewed = true
                      window.sessionStorage.removeItem('viewedHistoryTabs')
                  })

                
              }
            })
            acc.push({
              ...item,
              avatar: avatar, 
              index: idx,
            })
          }
          return acc;
      },[])
    })
  }

  convertToAproppriateObjectHistoryTab(data){
    let passedTransletors = [], output = [];

    data.filter(o => o.status === "2").map((item, idx, historyTabsArray) => {
        if(passedTransletors.includes(item.translator_id) ) return
        passedTransletors.push(item.translator_id);
        let oneUserItems = historyTabsArray.filter(o => o.translator_id === item.translator_id);
        let translator = item.translator;
        let oneUserItemsSorted = quickSort(oneUserItems,null,null,'translated_at',(val1, val2, pos, item) => {
          if (item){ // if its object
            if(!(item in val1))
              throw new Error('Item not in the Object, check Object for Comporator');

            val1 = val1[item];
            val2 = val2[item];
          }

          if(typeof val1 === 'number' &&  typeof val2 === 'number'){
          if(pos)
              return val1 > val2
          else 
              return val1 < val2
          }

          if(typeof val1 === 'string' &&  typeof val2 === 'string'){
            let l1 = val1.length, l2 = val2.length, i = 0;

            while(i < Math.min(l1, l2)){
              if(val1.charCodeAt(i) === val2.charCodeAt(i)){
                i++;
                if( i === Math.min(l1, l2) ){
                  if (pos)
                    return l1 > l2
                  else 
                    return l1 < l2
                  }
                continue;
              }
              if (pos)
                return val1.charCodeAt(i) > val2.charCodeAt(i)
              else 
                return val1.charCodeAt(i) < val2.charCodeAt(i)
            }
          }

          if(val1 instanceof Date &&  val2 instanceof Date){

            val1 = val1.getTime();
            val2 = val2.getTime();

            if(pos)
              return val1 > val2
            else 
              return val1 < val2
          }
        }); // null for omit
        output.push({'translator': translator, messages: oneUserItemsSorted});
      })
    return output;
  }

  updateLanguageHandler({list}){
    if(!this._isMounted) return
    this.setState({language: list})
  }

  visitedIndex(visitedTranslatorId){
    let _self = this;
    this.viewedHistoryTabs[visitedTranslatorId] = true;
    window.sessionStorage.viewedHistoryTabs = JSON.stringify(this.viewedHistoryTabs)
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.store.stop();
    this.store.removeListener('update', this.updateHandler);

    this.languageStore.stop();
    this.languageStore.removeListener('update', this.updateLanguageHandler);
    this.languageStore = null;

    this.store = null;
    Store.saveSession();
    this.listeners.forEach(removeEventListener => removeEventListener())
  }

  componentWillReceiveProps(props){
      const { mainScreen } = this.props.location.state || { mainScreen: false }
      if(!this._isMounted)
      this.setState({mainScreen});

      let languageStoredIds = Store.getIds('language');
      if(languageStoredIds && languageStoredIds.length) {
        let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
        this.updateLanguageHandler({list : langsFromStore});
      }


      let translatorStoredIds = Store.getIds('translator');
      if(translatorStoredIds && translatorStoredIds.length) {
        let translatorListFromStore = translatorStoredIds.map(id => Store.getItem(id));
        this.updateTranslatorHandler({list : translatorListFromStore});
      }

  }
  
  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  getLangPropInObj({id,slug}){
    return this.state.language.length > 0 ? this.state.language.find(o => o.id === id)[slug] : 0
  }

  render() {
    let { isTablet, mainScreen,  page: { typePage, id: pageTypeId }, pendingTabs, historyTabs, workingTabs, language, translator, translators, notShowWellcome } = this.state;

    return (
      <div className="f f-col outer dashboard-user">
        <Header currentRole={this.props.currentRole}/>
        
        {!notShowWellcome ? <Wellcome /> :
        <div className="f h100">
          
          <div className="f f-align-2-2 outer-left"  style={{display:`${!isTablet?'flex':mainScreen?'none':'flex'}`}}>
            <ScrollRestortion scrollId={`sidebarUserDb`}  className={'f sidebar'} >
              {/* CREATE TAB */}
              <Link tabIndex={"1"} to={{pathname:'/dashboard/create', state: {mainScreen: true, page:{typePage: 'create', id: undefined}}}} className="f f-align-1-2 dashboard-user__create-tab" >
                <div className="dashboard-user__create-tab-plus">
                </div>
                <div className="dashboard-user__create-tab-content">Создать запрос на перевод
                </div>
              </Link>


              {/* PENDINGS TABs */} 
              { pendingTabs.map(tab => {
               
                return (
                  <Link  tabIndex={"2"} to={{pathname:`/dashboard/pending/${tab.id}`,state: {mainScreen: true, page:{typePage: 'pending', id: tab.id}}}} className={`f f-align-1-2 dashboard-user__searchtab ${tab.id === pageTypeId && typePage === 'pending' ? 'selected' : ''}`} key={tab.index} >
                    <figure className="f f-align-2-2 dashboard-user__searchtab-avatar"> <img src={animatedAvatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__searchtab-details">
                      <div className="dashboard-user__searchtab-title" title={tab.translator && `Ожидание переводчика ${tab.translator.first_name} ${tab.translator.last_name}`} 
                      > 
                      {tab.translator? `Ожидание переводчика ${tab.translator.first_name} ${tab.translator.last_name}`: 'Поиск переводчика'} 
                      </div>
                      <div className="dashboard-user__searchtab-content" title={`${tab.source_messages.length > 0 && tab.source_messages[0].content}`}> {tab.source_messages.length > 0 &&  tab.source_messages[0].content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__searchtab-info">
                    </div>
                  </Link>
                )
              })}

              {/* INWORK TABs */}
              { workingTabs.map(tab => {
                let publishTime = new Date(tab.created_at);
                let outputPublishTime = getTabTime(publishTime);
                let translator = tab.translator; 
                return (
                  <Link key={getUniqueKey()}  tabIndex={"2"}  to={{pathname:`/dashboard/inwork/${tab.id}`,state: {mainScreen: true, page:{typePage: 'inwork', id: tab.id}}}} className={`f f-align-1-2 dashboard-user__tab ${tab.id === pageTypeId && typePage === 'inwork' ? 'selected' : ''}`} key={tab.index}>
                    <figure className="f f-align-2-2 dashboard-user__tab-avatar"> <img src={translator.image || avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__tab-details">
                      <div className="dashboard-user__tab-title">{ translator.first_name + ' ' + translator.last_name}</div>
                      <div className="dashboard-user__tab-content"> {tab.source_messages.length > 0 &&  tab.source_messages[tab.source_messages.length-1].content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__tab-info">
                        <div className="dashboard-user__tab-info__time">
                        <Batch
                          flushCount={0}
                          flushInterval={200} 
                          count={1}
                          debug={false}
                          render={(()=> {
                            let start = tab['updated_at'];
                            let duration = tab.source_messages.length > 0 ? tab.source_messages[tab.source_messages.length-1]['letters_count'] * this.getLangPropInObj({id:tab.translate_language_id, slug:'letter_time'}) : 0;
                            //console.log(value)
                            return <Timer start={start} duration={duration} />
                          }).bind(this)}/>
                        <time>{`${outputPublishTime}`}</time>
                        </div>
                        <LangLabel from={this.getLangPropInObj({id:tab.source_language_id, slug:'code'})} to={this.getLangPropInObj({id:tab.translate_language_id, slug: 'code'})} selected={tab.id === pageTypeId && typePage === 'inwork'} />
                      <div className="dashboard-user__tab-info__money">{(tab.price/100).toFixed(2)}₴</div>
                    </div>
                  </Link>
                )
              })}

              {/* delimiter */}
              <TabDelimiter title={'История'}/>
              
              {/* History TABs */}
              {this.state.historyTabs.map((historyFromOneUser, index) => {
                let tab = historyFromOneUser;
                let translator = historyFromOneUser.translator; 
                
                let finishTime = new Date(tab.translated_at);
                let outputPublishTime = getTabTime(finishTime);
                let start = new Date(tab['started_at']);
                let durationShouldBe = tab.translate_messages[tab.translate_messages.length-1]['letters_count'] * this.getLangPropInObj({id:tab.translate_language_id, slug:'letter_time'})
                let finishShouldBe = new Date(+start + durationShouldBe*1000);
                let duration = (finishTime - start)/1000;
                return (
                  <Link  tabIndex={"2"} to={{pathname:`/dashboard/history/${translator.id}`, state: {mainScreen: true,  translator, page:{typePage: 'history', id: translator.id}}}}  className={`f f-align-1-2 dashboard-user__tab dashboard-user__tab__history ${translator.id === pageTypeId  && typePage === 'history' ? 'selected' : ''}`} key={index} >
                    <figure className="f f-align-2-2 dashboard-user__tab-avatar"> <img src={translator.image || avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__tab-details">
                      <div className="dashboard-user__tab-title"> {translator.first_name + ' ' +
                     translator.last_name} </div>
                      <div className="dashboard-user__tab-content"> {tab.translate_messages.length > 0 &&  tab.translate_messages[tab.translate_messages.length - 1].content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__tab-info">
                      <div className="dashboard-user__tab-info__time">
                        { /* Show only when not been seen yet.*/ 
                          !tab.viewed && <Timer start={new Date() - 990} duration={1}/>}
                        <time>{`${outputPublishTime}`}</time>
                      </div>
                      <LangLabel from={this.getLangPropInObj({id:tab.source_language_id, slug:'code'})} to={this.getLangPropInObj({id:tab.translate_language_id, slug: 'code'})} selected={tab.id === pageTypeId && typePage === 'history'} />
                      <div className="dashboard-user__tab-info__money">{(tab.price/100)}₴</div>
                    </div>
                  </Link>
                )
              })}
            </ScrollRestortion>
          </div>
          <div className="f outer-right" ref={n => this.toggleElem = n}  style={{display:`${!isTablet?'flex':mainScreen?'flex':'none'}`}}>
            <div className="main f f-col f-align-2-2">
              {this.state.isTablet?
                <div className="f f-align-13-2 breadcrumbs">
                    <button onClick={() => { this.setState({mainScreen: false}) }} className="f f-align-2-2 btn btn-flat breadcrumbs__back" ><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12"><path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" /></svg>Назад</button> 
                    <span>{typePage === 'create' ? 'создать запрос на перевод' : typePage === 'pending' ? 'ожидание переводчика' :  typePage === 'inwork' ? 'в работе' : typePage === 'history' ? `история ${translator.first_name} ${translator.last_name}`: ''}</span>
                </div>
              :''}
              <Switch>
                <RoutePassProps exact redirect="/dashboard/create" path="/dashboard" component={Create} translator={translator}  store={this.store} languages={language} store={this.store} translators={translators}/> 
                <RoutePassProps path="/dashboard/create" component={Create} translator={translator} store={this.store} languages={language} store={this.store} translators={translators} isTablet={this.state.isTablet}/>
                <RoutePassProps path="/dashboard/pending/:id" component={Pending} typePage={typePage} id={pageTypeId} 
                 data={Array.isArray(pendingTabs)? pendingTabs.find(o=> o.id == pageTypeId):null} store={this.store} languages={language}/>
                <RoutePassProps path="/dashboard/inwork/:id" component={Pending} typePage={typePage} id={pageTypeId} 
                 data={Array.isArray(pendingTabs)? workingTabs.find(o=> o.id == pageTypeId):null} store={this.store} languages={language}  />
                <RoutePassProps path="/dashboard/history/:id" component={HistoryList} isTablet={this.state.isTablet} typePage={typePage} id={pageTypeId}
                languages={language} store={this.store} translator={translator} visitedIndex={this.visitedIndex}/>
              </Switch>
            </div>
          </div>
          </div>
        }
      </div>
    )
  }

}

const RoutePassProps = ({ component: Component, redirect, ...rest }) =>
  (!redirect
    ? <Route {...rest} render={props => <Component {...props} {...rest} />} />
    : <Redirect to={`${redirect}`} />);



class Wellcome extends React.Component{

  setShowWellcome(e){
    window.localStorage.setItem('notShowWellcome', JSON.stringify(true));
  }

  render(){

    return <div className="main__welcome">
            <h1 className="h2 u-text-center u-my-3 u-text-font__light">Textra приветствует Вас!</h1>
            <p>Теперь вы можете получать качественный перевод текста в максимально короткие сроки, как
            если бы вы были всегда на связи с личным профессиональным переводчиком.</p>
            <div className="main__welcome-table u-mt-5 u-mb-3">
              <h2 className="h4 u-text-font__light u-my-1 u-text-center">ПОДАРОК</h2> 
              <p>Чтобы протестировать качество и скорость переводов Textra - мы дарим
              вам 50 грн. Этих денег вам хватит на перевод текста, объемом 267 симво-	
              лов или примерно 50 слов.</p>
            </div>
            <div className="main__welcome-table u-mb-3">
              <h2 className="h4 u-text-font__light u-my-1 u-text-center">БАЛАНС</h2> 
              <p>По истечении баланса, чтобы продолжить размещать новые заказы, вам 		
              необходимо будет пополнить личный счет. Сделать это можно нажав кноп-	
              ку «Пополнить» в правом верхнем углу</p>
            </div>
            <div className="main__welcome-table u-mb-3">
              <h2 className="h4 u-text-font__light u-my-1 u-text-center">КОНТРОЛЬ</h2> 
              <p>При наборе текста вы можете отслеживать информацию о максимальном
              времени перевода, количестве символов набранного вами текста, а также
              стоимости перевода, которая будет списана с вашего баланса после разме	
              щения заказа</p>
            </div>
            <div className="main__welcome-table u-mb-3">
              <h2 className="h4 u-text-font__light u-my-1 u-text-center">БОНУС</h2> 
              <p>Поскольку Textra ориентирована на переводы текста объемом до 1 стра-
              ницы, мы не ограничиваем заказы по минимальному количеству слов.
              Это значит, что вы можете перевести с Textra даже 1 предложение</p>
            </div>
            <Link tabIndex={"1"} to={{pathname:'/dashboard/create', state: {mainScreen: true, page:{typePage: 'create', id: undefined}}}} className="f f-align-2-2 main__welcome-button dashboard-user__create-tab" onClick={this.setShowWellcome}>
                <div className="dashboard-user__create-tab-plus">
                </div>
                <div className="dashboard-user__create-tab-content">Создать запрос на перевод
                </div>
            </Link>
          </div>
  }
}

class HistoryList extends React.Component { 
  
  constructor(props) {
    super(props); 
    this.id = this.props.id;
    this.getLangPropInObj = this.getLangPropInObj.bind(this)
    this._isMounted = false;
    this.historyRoot = null;
    this.messageStore =null;
    this.updateHandler = this.updateHandler.bind(this);    
    this.lastCreatedDate = null;

  }
  state={
    currentData: [],
    translator: this.props.translator ? this.props.translator: {},
    languages: this.props.languages
  }


  componentWillMount(){
    let _self = this;
    this.messageStore = new MessageStore('translated-topic/user', this.id);
    if(this.id){
      let currentData = MessageStore.getMessages('translated-topic/user', this.id)
      this.setState({ currentData });
    }
  }

  componentDidMount(){
    this._isMounted = true;
    let {typePage ,historyId} = this.props;
    this.messageStore.start();
    this.messageStore.addListener('updateMessage', this.updateHandler)
  }

  updateHandler({list}){
    this.setState({currentData : list})
  }

  componentWillReceiveProps({languages, id, translator}){
    let _self = this;
    if(!_self._isMounted) return 
    if(id){
      let currentData = MessageStore.getMessages('translated-topic/user', this.id)
      this.setState({currentData})

    }
    this.setState({languages, translator});

  }

  getLangPropInObj({id,slug}){
    if(!this._isMounted) return 
    return this.state.languages.length > 0 ? this.state.languages.find(o => o.id === id)[slug] : 0
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
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
      console.log('Ха ха - бери, и копируй руками');
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.messageStore.stop();
    this.messageStore.removeListener('updateMessage', this.updateHandler)
    this.messageStore = null;
  }

  render() {
    let { currentData, translator } = this.state || {currentData: []},
      _self = this; 

    if( currentData[0] && currentData[0].id ){
        _self.props.visitedIndex(currentData[0].translator_id)
    }

    this.lastCreatedDate = null;
    if (!currentData.length)
      return(<div/>)
    currentData = currentData.reverse();
    const renderCollection = renderItem => (
      <ScrollRestortion scrollId={`history${this.props.id}`}  scrollToEndByDefault={true} className={'f f-col dashboard-user__history'} >
        
        {/* ALl merged history */}

        {currentData.map((item, idx) => renderItem(item, idx))}
        
        {/* Create new history  with certain translator*/}
        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-create'}>
          <div className={'dashboard-user__history-reply__avatar'}></div>
          <Link to={{pathname:'/dashboard/create',state:{mainScreen:true, translator: translator,  page:{typePage: 'create', id: undefined}}}} className="f f-align-1-2 dashboard-user__history-create__content" >
            <div className="dashboard-user__history-create__content__plus"></div>
            <div className="dashboard-user__history-create__content__text">Создать персональный запрос на перевод</div>
          </Link>
          <div className={'dashboard-user__history-reply__constols'}></div>
          <div className={'dashboard-user__history-post__date'}></div>
        </div>

      </ScrollRestortion>
    )

    return ( renderCollection((currentData, idx) => {
      if(!currentData || !currentData.source_messages.length )
          return <div key={idx} />
      let created_at = new Date(currentData.created_at);
      let translated_at = new Date(currentData.translated_at);
      let started_at = new Date(currentData.started_at);
    
      let durationShouldBe = currentData.source_messages[0].letters_count * this.getLangPropInObj({id: currentData.translate_language_id, slug:'letter_time'});
      let finishShouldBe = new Date(+started_at + durationShouldBe * 1000);
      let duration =  (translated_at - started_at)/1000 ; //sec


      let showHeaderDate = true;
      if(this.lastCreatedDate && this.lastCreatedDate.getDate() === translated_at.getDate() && this.lastCreatedDate.getMonth() === translated_at.getMonth() && this.lastCreatedDate.getFullYear() === translated_at.getFullYear()){
        showHeaderDate = false;
      }
      this.lastCreatedDate = translated_at;
    
      return (
        <div key={idx}>
          { showHeaderDate && <div className={'data__delimiter'}>{translated_at.getDate()} {getMonthName(translated_at.getMonth())}, {translated_at.getFullYear()} </div>}
          <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-post '}>
            <div className={'dashboard-user__history-post__avatar'}>
              <img src={Auth.user.image || avatar} alt={Auth.user.first_name} />
            </div>
            <div className={'dashboard-user__history-post__content'}>
              <div className={'dashboard-user__history-post__content__text'}>
                {currentData.source_messages.length > 0 &&  currentData.source_messages[currentData.source_messages.length-1].content}
              </div>
              <div className={'f f-align-1-2 f-gap-4 dashboard-user__history-post__content__bottombar'}>
                {currentData.source_language_id && currentData.translate_language_id &&  
                    <LangLabel 
                      from={this.getLangPropInObj({id: currentData.source_language_id, slug:'code'})} 
                      to={this.getLangPropInObj({id: currentData.translate_language_id, slug:'code'})} 
                      />
                } 
                {currentData.source_messages.length > 0 &&
                    <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(durationShouldBe)} hint={'Длительность перевода'} /> }

                {currentData.translated_at && currentData.started_at &&
                <Indicator
                  className={'f f-align-2-2'}
                  icon={
                    <Timer
                      start={started_at}
                      duration={duration}
                      isBig={true}
                      finish={finishShouldBe}
                    />
                  }
                  value={humanReadableTime((duration))} // sec
                  hint={'Оставшееся время'} />
                }
                {currentData.source_messages.length > 0 &&
                <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentData.source_messages[0].letters_count} hint={'Количество символов'} />}
                {currentData.source_messages.length > 0 &&
                <Indicator className={'f f-align-2-2'} icon={icon_cost} value={`${(currentData.price/100).toFixed(2)}₴`} hint={'Стоимость'} />}
              </div>
            </div>
            <div className={'dashboard-user__history-post__constols'}>
            </div>
            {started_at && <div className={'dashboard-user__history-post__date'}>
              {started_at.getHours()}:{getFullTimeDigits(started_at.getMinutes())}
            </div>}
          </div>


           {/* RESPONSE */}


          <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-reply'}>
            <div className={'dashboard-user__history-reply__avatar'}>
              <img src={translator.image || avatar} alt={translator.first_name} />
            </div>
            <div className={'dashboard-user__history-reply__content'}>
              <textarea ref={ (() => {let start = 50, ref, isTablet = _self.props.isTablet ; return (node) => {
                      if(node == null) return
                      ref = node;
                      if( !(_self.props.isTablet && isTablet) ){ // when has changed
                        start = 50;
                        isTablet = _self.props.isTablet;
                      }
                      start = Math.max(ref.scrollHeight, start);
                      ref.style.height = start + 'px';
                    }})()}  className={'dashboard-user__history-reply__content__text'} disabled  value={currentData.translate_messages.length > 0 && currentData.translate_messages[currentData.translate_messages.length-1].content} />
            </div>
            <div className={'dashboard-user__history-reply__constols'}>
              <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy}>
                <img src={copy} alt="copy" />
                <span>Копировать</span>

              </button>
            </div>
            <div className={'dashboard-user__history-reply__date'}>
              {translated_at.getHours()}:{getFullTimeDigits(translated_at.getMinutes())}
            </div>
          </div>
        </div>
      )
    })
    )
  }
}

class Pending extends React.Component {
  constructor(p){
    super(p);
    this.store = this.props.store;
    this.id = this.props.id;
    this._isMounted = false;
    this.cancel = this.cancel.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  state= {
    currentData: this.props.data,
    languages:  this.props.languages,
    index: this.props.index,
    stale: false,
    isExpired: false,
    redirectToMain: false
  }

  componentDidMount(){
    this._isMounted = true;
    if(this.id)
      this.startReceiveData();
  }

  checkStatus(status){
    if(status != this.state.isExpired )
      setTimeout( _ => {
                          if(this._isMounted) 
                            this.setState({isExpired: status})}
                 , 1000);
  }

  startReceiveData(){
    let _self = this;
    TxRest.getData(`topic/${this.id}`).then((data) => {
        if(data.message || !this._isMounted) return;
        if(_self.state.currentData)
        data =  Object.assign({}, _self.state.currentData, data );
        if(this._isMounted)
        _self.setState({ currentData: data, stale : data.status === '2' });
        if( _self.store ){
          let {ids, list} = _self.store.getState(),
              updatedIndex;
          if(list.length){
            list.map((o, idx) => {if(o.id === this.id) updatedIndex = idx});
            _self.store.itemUpdated(data, updatedIndex);
          }
        }
    })
  }

  cancel = (id) => () => {
    let _self = this;
    TxRest.deleteData(`topic/${id}`, data => {
      if(data === 200){// means ok 
        if(Auth.user && Auth.user.id){ // updata money
          TxRest.getData(`profile`).then((user, err) => {
    
            if(!this._isMounted) return
            if(!data.message && !data.err) {
              Auth.update(user);
            
              if(this._isMounted)
              _self.setState({ currentData: null, redirectToMain: true});  // updata store
              _self.store && _self.store.itemDelete(id);
            }
          })
        }
      }
    })
  }

  componentWillReceiveProps({store, languages, id}){
    this.store = store;
    if(id){ // need to upadate data when it comes from socket
      this.id = id;
      this.startReceiveData();
    }
    if(languages && this._isMounted)
      this.setState({languages: languages})
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  getLangPropInObj({id,slug}){
    return this.state.languages && this.state.languages.length > 0 ? this.state.languages.find(o => o.id === id)[slug] : 0
  }

  render() {
    let { currentData, redirectToMain } = this.state,
      created_at = null;
    
    if(redirectToMain)
        return <Redirect to={'/'}/>
    
    if(!currentData)
        return <div/>
      
    if(currentData.status === '2'){
       return <Redirect to={{pathname:`/dashboard/history/${currentData.translator_id}`,state:{page:{typePage:'history', id: currentData.translator_id},translator: currentData.translator}}} />
    }
    
    if(currentData.created_at){
      created_at = new Date(currentData.created_at);
    }
    
    if(currentData.source_messages && currentData.source_messages.length > 0){
      var duration = currentData.source_messages[0].letters_count * this.getLangPropInObj({id: currentData.translate_language_id, slug:'letter_time'})
    }

    let isExpired = (new Date() - new Date(currentData.updated_at))/1000 > duration;

    return (
        <div className={'f f-col f-align-1-1 dashboard-user__searching'}>
            {currentData.created_at && <div className={'data__delimiter'}>{created_at.getDate()} {getMonthName(created_at.getMonth())}, {created_at.getFullYear()} </div>}
            <div className={'f f-align-1-11 f-gap-2 dashboard-user__searching-post '}>
              <div className={'dashboard-user__searching-post__avatar'}>
                <img src={Auth.user && Auth.user.image || avatar } />
              </div>
              <div className={'dashboard-user__searching-post__content'}>
                <div className={'dashboard-user__searching-post__content__text'}>
                  {currentData.source_messages.length > 0 && currentData.source_messages[0].content}
                </div>
                <div className={'f f-align-1-2 f-gap-4 dashboard-user__searching-post__content__bottombar'}>
                  {currentData.source_language_id && currentData.translate_language_id &&  
                  <LangLabel 
                    from={this.getLangPropInObj({id: currentData.source_language_id, slug:'code'})} 
                    to={this.getLangPropInObj({id: currentData.translate_language_id, slug:'code'})} 
                    />
                  }
                {currentData.source_messages.length > 0 &&
                  <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(duration)} hint={'Длительность перевода'} /> }
                {currentData.updated_at &&  currentData.status === '1' &&
                  <Batch
                    flushCount={0}
                    flushInterval={150}
                    count={1}
                    debug={false}
                    render={()=> {
                      let value = ~~Math.abs(duration - (new Date - new Date(currentData.updated_at)) / 1000);
                      //console.log(value)

                      return(<Indicator
                        className={'f f-align-2-2'}
                        icon={
                          <Timer
                            start={currentData.updated_at}
                            duration={duration}
                            isBig={true}
                            checkStatus={this.checkStatus} />}
                        value={humanReadableTime(value)}
                        hint={'Оставшееся время'} />)
                    }}/>}
                  {currentData.source_messages.length > 0 &&
                  <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentData.source_messages[0].letters_count} hint={'Количество символов'} />}
                  {currentData.source_messages.length > 0 &&
                  <Indicator className={'f f-align-2-2'} icon={icon_cost} value={`${Number(currentData.price/100).toFixed(2)}₴`} hint={'Стоимость'} />}
                </div>
              </div>
              <div className={'dashboard-user__searching-post__constols'}>
                {currentData.status === '0' &&
                  <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.cancel(currentData.source_messages[0].id)}>
                    <img src={cancel} alt="cancel" />
                    <span>Отменить</span>
                  </button>
                }
              </div>
              {created_at && <div className={'dashboard-user__searching-post__date'}>
                {created_at.getHours()}:{getFullTimeDigits(created_at.getMinutes())}
              </div>}
            </div>
          {currentData.status === '0' &&
            <div className={'f f-align-2-2 dashboard-user__searching-info '}>
              <div className={'f f-align-2-2 dashboard-user__searching-info__exclamation info__exclamation--info'}>i</div>
              <div className={'f f-align-1-2  dashboard-user__searching-info__message '}>{`
                  Ваш запрос создан. После того, как переводчик возьмет заказ в работу, ориентировочное время на перевод составит ${humanReadableTime(duration)}. Для повышения качества перевода мы рекомендуем не закрывать это окно.
                `}
              </div>
            </div>
          }
          {currentData.status === '1' &&
            <div className={'f f-align-2-2 dashboard-user__searching-info '}>
              <div className={'f f-align-2-2 dashboard-user__searching-info__exclamation info__exclamation--info'}>i</div>
              <div className={'f f-align-1-2  dashboard-user__searching-info__message '}>
                Ваш текст принят в работу
              </div>
            </div>
          }
          {currentData.status === '1' && isExpired &&
            <div className={'f f-align-2-2 dashboard-user__searching-info '}>
              <div className={'f f-align-2-2 dashboard-user__searching-info__exclamation info__exclamation--caution'}>i</div>
              <div className={'f f-align-1-2  dashboard-user__searching-info__message '}>
              Отведенное время на перевод Вашего текста вышло. Однако мы все еще работаем над переводом, дождитесь, пожалуйста, перевод. Если у Вас есть возражения или предложения по улучшению работы сервиса Textra, обратитесь в нашу поддержку.
              </div>
            </div>
          }
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
    this.updateHandler = this.updateHandler.bind(this);
    this.getIdLang = this.getIdLang.bind(this);
    this.getTranslators = this.getTranslators.bind(this);
    this.disabled = false;
    this.store = props.store;
    this._isMounted = false;
  }


  state = {
    optionsLang: [],
    valueLangFrom: 'ENG',
    valueLangTo: 'RUS',
    valueTranslator: undefined,
    currentNumberOfChar: 0,
    isSearchMenuTranslatorVisible: false,
    isBlocking: false,
    translatorMessage: '',
    letterPrice: 1,
    letterTime: 1,
    isEnoughMoney: true,
    blockSubmit: false,
    redirectToPending: false,
    newId: '',
    translators: this.props.translators,
    translatorsOpt: [],
    isNotExceedLetters: true,
    isTablet: this.props.isTablet
  }

  shouldComponentUpdate(nextProps, nextState){
    if(!this._isMounted) return
    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }

    return false
  }

  componentDidMount(){
    this._isMounted = true
    if(this.props.languages) this.updateHandler(this.props.languages);
    if(this.props.location.state && this.props.location.state.translator)
      this.setState({valueTranslator:{
              label: this.props.location.state.translator.id,
              value: this.props.location.state.translator.first_name + ' ' + this.props.location.state.translator.last_name,
              image: this.props.location.state.translator.image
            }})
    this.getTranslators();
  }

  componentWillReceiveProps(newProps){
    if(!this._isMounted) return
      let {languages, store, translator, translators, isTablet} = newProps;
    if(languages) this.updateHandler(languages);
    if(store) this.store = store;
    if(translator)
      this.setState({valueTranslator:{
              label: translator.id,
              value: translator.first_name + ' ' + translator.last_name,
              image: translator.image
            }})
    if(translators){
        this.setState({translators})
    }

    if(isTablet !== null){
      this.setState({isTablet})
    }
    this.getTranslators(translators);

  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  getIdLang(value){
    if(!this._isMounted) return
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

  updateHandler(list){
    if(!this._isMounted) return

    let optionsLang =  this.convertToAproppriateObject(list);
    let toLangObj = this.getAttrByValue(optionsLang, this.state.valueLangTo);
    
    if(!toLangObj) return
    this.setState({
      optionsLang,
      letterTime: toLangObj['letterTime'],
      letterPrice: toLangObj['letterPrice']
    });
  
  }

  onSubmit(e){
    e.preventDefault();
    if(!this._isMounted) return
    if(this.state.blockSubmit) return
    this.state.blockSubmit = true;
    let {create:{to, from, message, translator}} = formSerialize(e.target, { hash: true, empty: true });
    if(message.length === 0) return

    let data = {
      "source_language_id": this.getIdLang(from),
      "translate_language_id": this.getIdLang(to),
       message
    }

    if(translator && translator !== 'Все переводчики')
      Object.assign(data,  {translator_id: this.state.valueTranslator['label']});

    TxRest.putData('topic', data).then((data, err) => {
        //if(data.message) 
          // TODO hande error criating message
        if(!this._isMounted) return
        if(!data.message && !data.err) {
          Auth.update(data.user);

          this.store.onStoriesUpdated(data);
        
          this.setState({ translatorMessage: '', 
                          isBlocking:  false, 
                          blockSubmit: false,
                          redirectToPending: true,
                          newId: data.id })
        }
    })
  } 
 
  currentNumberOfChar({target: {value}}) {
    if(!this._isMounted) return

    let currentNumberOfChar = value.replace(/\s/g,'').length;
    let isEnoughMoney = Auth.user.balance  > currentNumberOfChar * this.state.letterPrice + 1000 ; // we start from 10₴    

    let isNotExceedLetters = currentNumberOfChar <= 1800; // not more than 1800 symbols
    this.setState({ currentNumberOfChar, isBlocking: value.length >  0, translatorMessage: value, isEnoughMoney, isNotExceedLetters })
  }

  updateValueLangFrom(valueLangFrom) {
    if(!this._isMounted) return
    this.setState({ valueLangFrom });
  }

  updateValueLangTo(valueLangTo) {
    if(!this._isMounted) return

    let toLangObj = this.getAttrByValue(this.state.optionsLang, valueLangTo);
    this.setState({
      valueLangTo,
      letterTime: toLangObj['letterTime'],
      letterPrice: toLangObj['letterPrice']
    });
  }

  updateValueTranslator(valueTranslator) {
    if(!this._isMounted) return
    if (Array.isArray(valueTranslator)) {
      valueTranslator = undefined
    }

    this.setState({ valueTranslator, isSearchMenuTranslatorVisible: false });

  }

  optionTranslatorField(v) {
    if (!(v.login || v.value)) return <div><img style={{ width: '30px' }} src={avatarLite} /> <span>Переводчик</span></div>;
    let customInput = <div> <img style={{ width: '30px', borderRadius: '50%', overflow: 'hidden' }} src={v.image || avatarLite} /><span style={{ marginLeft: '10px' }}>{v.login || v.value}</span></div>
    return customInput;
  }

  valueTranslatorField(v) {
      return null;
  }

  callTranslatorSearchNenu() {
    if(!this._isMounted) return
    this.setState({
      isSearchMenuTranslatorVisible: true
    })
    this.createTranslatorMenu.focus();
  }

  makeSearchMenuTranslatorUnnisible() {
    if(!this._isMounted) return
    this.setState({
      isSearchMenuTranslatorVisible: false
    })
  }

  getTranslators(receivedLater) {
    let {translators}  = !!receivedLater ? {translators:receivedLater} : this.props;
    if(!translators.length) return 
    return this.setState({ translatorsOpt: [{
      label: -1,
      value: 'Все переводчики',
      image: avatarAll
    }].concat(translators.map(item => {
        return {
          label: item.id,
          value: item.first_name + ' ' + item.last_name,
          image: item.image
        }
      }))
      })
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

  swapLang(e) {
    if(!this._isMounted) return

    e.preventDefault();
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
           valueTranslator, isSearchMenuTranslatorVisible, isBlocking, 
           translatorMessage, letterTime, letterPrice, isEnoughMoney, 
           blockSubmit, redirectToPending, newId, translatorsOpt: translatorsPool,
           isNotExceedLetters, isTablet } = this.state;

    if( redirectToPending ){
     return <Redirect push={true} to={{pathname:`/dashboard/pending/${newId}`,state:{page:{typePage:'pending',id:newId}}}}/>
    }
    
    if(!isEnoughMoney || blockSubmit){
        this.disabled = true;
    }
    
    if((isEnoughMoney && this.disabled && !blockSubmit)){
        this.disabled = false;
    }
    return (
      <div ref={(n) => this.createFrom = n} className={'f f-col dashboard-user__create-forms'}>
      <form onSubmit={this.onSubmit} className={'f f-col dashboard-user__create-forms'}>
         <Prompt
                when={this.state.isBlocking}
                message={location => (
                  `Ваше запрос на перевод будет удален`
                )}
          />
          <div className={'dashboard-user__create-topbar f f-align-1-2 f-row f-gap-4'}>
            <Select
              ref={(n) => this.createLangFrom = n}
              name="create[from]"
              options={optionsLang}
              disabled={false}
              simpleValue
              value={valueLangFrom}
              onChange={this.updateValueLangFrom}
              searchable={false}
              autosize={true}
              clearable={false}
              arrowRenderer={this.arrowElementLangs}
              tabIndex={"1"} />
            <div className={'u-my-1 dashboard-user__create-swaplang'} onClick={this.swapLang} ><img src={sl} /></div>
            <Select
              ref={(n) => this.createLangTo = n}
              name="create[to]"
              options={optionsLang}
              simpleValue
              disabled={false}
              value={valueLangTo}
              onChange={this.updateValueLangTo}
              searchable={false}
              autosize={true}
              clearable={false}
              arrowRenderer={this.arrowElementLangs}
              tabIndex={"1"}
            />
            <div className={'dashboard-user__create-topbar__chooser'}  >
              <div className={'f f-align-2-2 dashboard-user__create-topbar__chooser-trigger'} onClick={this.callTranslatorSearchNenu} >
                <img className={'dashboard-user__create-topbar__chooser-trigger__avatar'} style={{ width: '30px' }} src={!!valueTranslator && valueTranslator.image || avatarLite} />
                <span className={'dashboard-user__create-topbar__chooser-trigger__name'} >{(!!valueTranslator && (valueTranslator.login || valueTranslator.value)) || 'Переводчик'}</span>
                <span className={'dashboard-user__create-topbar__chooser-trigger__arrow'} >{this.arrowElementLangs({ isOpen: isSearchMenuTranslatorVisible })}</span>
              </div>
              <div className={`dashboard-user__create-topbar__chooser-menu ${isSearchMenuTranslatorVisible ? 'js-showChooserMenu' : ''}`}>
                <Select
                  ref={(n) => this.createTranslatorMenu = n}
                  name="create[translator]"
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
                  options={translatorsPool}
                  onBlur={this.makeSearchMenuTranslatorUnnisible}
                  onValueClick={this.makeSearchMenuTranslatorUnnisible}
                  tabIndex={"1"}
                />
              </div>
            </div>
          </div>
          <div className={'dashboard-user__create-posteditor'}>
            <textarea
              type="text"
              tabIndex={"1"} 
              name="create[message]"
              value={translatorMessage}
              placeholder={'Ваш запрос на перевод...'}
              onChange={this.currentNumberOfChar}
            />
          </div>
          <div className={'f f-align-1-2 f-row dashboard-user__create-bottombar f-gap-4'}>

            <Indicator className={'f f-align-2-2 '} icon={icon_dur} value={humanReadableTime(currentNumberOfChar * letterTime)} hint={'Длительность перевода'} />
            <Indicator className={`f f-align-2-2 ${isNotExceedLetters?'':'String-indicator__error'}`} icon={icon_letternum} value={currentNumberOfChar} hint={'Количество символов(не более 1800)'} /> 
            <Indicator className={`f f-align-2-2 ${isEnoughMoney?'':'String-indicator__error'}`} icon={icon_cost} value={`${Number(letterPrice * currentNumberOfChar/100 + 10).toFixed(2)}₴`} hint={'Стоимость перевода'} />{/* we start from 10₴  */}
            {!isEnoughMoney && !isTablet && <p>Недостаточно денежных средств.</p>}
          <input tabIndex={"1"} id="submit" type="submit" {...this.disabled && {disabled:'true'}}  value='Отправить' className={'submit-post btn btn-primiry btn-mini'}/>
          </div>
      </form>
      </div>
    )


  }
}




export default withGracefulUnmount(withRouter(DashBoard));


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