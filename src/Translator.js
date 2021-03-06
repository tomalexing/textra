import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "./style/app.css";
import "./style/index.css";
import logo from "./assets/logo.png";
import avatar from "./assets/default-avatar.png";
import icon_arrow from "./assets/arrow-down.png";
import icon_cost from "./assets/cost-of-translation.svg";
import icon_dur from "./assets/duration-of-translation.svg";
import icon_letternum from "./assets/letter-number.svg";
import icon_search from "./assets/search.svg";
import sl from "./assets/swap-lang.svg";
import copy from "./assets/icon-copy.svg";
import icon_posts from "./assets/icon-posts.svg";
import icon_history from "./assets/icon-history.svg";

import "./polyfill";
import  Auth from './store/AuthStore.js';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch,
  Prompt
} from "react-router-dom";
import { createBrowserHistory } from "history";
import {
  getUniqueKey,
  addClass,
  hasClass,
  removeClass,
  debounce,
  listener,
  delegate,
  sleep,
  humanReadableTime,
  getMonthName,
  getFullTimeDigits,
  getDayName,
  call,
  ScrollRestortion,
  requestAnimationFramePromise,
  transitionEndPromise
} from "./utils";

import Batch from "./components/Batch";

import Header, { NavLink } from "./components/Header";

import Test from "./Test";
import Timer from "./components/Timer";
import LangLabel from "./components/LangLabel";
import StatefulEditor from "./components/StatefulEditor";
import Indicator from "./components/Indicator";
import deepEqual from 'deep-equal';

import Store from './store/Store.js';
import FeedStore from './store/FeedStore.js';
import MessageStore from './store/MessageStore.js';
import {TxRest} from './services/Api.js';



const Routes = {
  root: {
    path: "/translator",
    exact: true
  },
  feed: {
    path: "/translator/feed",
    exact: false
  },
  common: {
    path: "/translator/feed/common",
    exact: false
  },
  personal: {
    path: "/translator/feed/personal",
    exact: false
  },
  history: {
    path: "/translator/history",
    exact: false,
    param: "/:id"
  },
  reply: {
    path: "/translator/reply",
    exact: false,
    param: "/:id"
  }
};

class Translator extends React.Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.renders = 0;
    this.updateLanguageHandler = this.updateLanguageHandler.bind(this);
    this.boundRef = this.boundRef.bind(this);
    this.refresh = this.refresh.bind(this);
    this.registerRefreshComponent = this.registerRefreshComponent.bind(this);
    this.listRefreshComponents = [];

  }

  state = {
    redirectToReferrer: false,
    items: [],
    isTablet: false,
    mainScreen: true,
    secondScreen: false,
    sidebar: false,
    languages: [],
    page:{
      typePage: 'feed',
      id: ''
    },
    amountFeed: null
  };

  componentWillMount() {
    this.doAtDidMount.forEach(func => func());

    // Responsive stuff
    this.listeners.push(
      listener(
        window,
        "resize",
        debounce(  e => {
            let isTablet = e.target.innerWidth <= 768 ? true : false;
            if (this.state.isTablet !== isTablet) this.setState({ isTablet });
          }, 200, false ),
        false
      )
    );

    if (window.innerWidth <= 768) {
      this.state.isTablet = true;
    }

    // Responsive end

    let { location: {state : {page: {typePage, id} } = { page: {typePage:'feed', id:''}}} } = this.props;
    if(typePage === 'history'){
      this.setState({mainScreen: false, secondScreen: true})
    }
    this.setState({page:{typePage, id}});

    let _self = this;
    this.registerRefreshComponent('amountFeed', ({allFeed,feedPerson,feedCommon})=>{
      _self.setState({amountFeed:{allFeed,feedPerson,feedCommon}})
    })
  }
  

  async componentDidMount() {
    this.listeners.push(
      delegate.call(
        this, window,"touchend", `.${Array.from(this.bg.classList).join(".")}`,
        event => {
          if (!this.state.sidebar || event.target.closest(".sidebar__menu")) return;
          this.setState({ sidebar: false });
        },
        false
      )
    );

    // get languages
     let _self = this;
    this.languageStore = new Store('language');
    let languageStoredIds = Store.getIds('language');
    if(languageStoredIds.length !== 0) {
      let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
      this.updateLanguageHandler({list : langsFromStore})
            .then( _ => {
                    if( _self.state.languages.length === 0 )
                         _self.languageStore.start()
            }); //this will updates not on every click
    }
    this.languageStore.start();
    this.languageStore.addListener('update', this.updateLanguageHandler);

  }

  updateLanguageHandler({list}){
      let _self = this;
      return new Promise( res => _self.setState({languages: list}, res))
  }

  registerRefreshComponent(component, cb){
    this.listRefreshComponents[component] = cb
  }

  refresh(component, ...rest){
    call(this.listRefreshComponents[component], ...rest);
  }

  boundRef = place => (n => (this[place] = n)).bind(this);

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  componentWillReceiveProps(props) {
    const { mainScreen, secondScreen } = this.props.location.state || {
      mainScreen: true,
      secondScreen: false
    };
    this.setState({ mainScreen, secondScreen });
  }

  componentWillUnmount() {
    this.listeners.forEach(removeEventListener => removeEventListener());
    this.languageStore.stop();
    this.languageStore.removeListener('update', this.updateLanguageHandler);
    this.languageStore = null;
  }

  render() {
    let { location: { pathname ,state : {page: {typePage, id}, historyUser } = { page: {typePage:'', id:'', historyUser: ''}}} } = this.props;

    let {page, languages, isTablet, sidebar, secondScreen, mainScreen, amountFeed } = this.state;

    return (
      <div className="f f-col outer translator">
        <Header currentRole={this.props.currentRole}/>
        <div className="f h100" ref={n => this.boundRef("bg")(n)}>
          <div
            style={{
              display: `${!isTablet ? "flex" : sidebar ? "flex" : "none"}`
            }}
            className={`f f-align-2-2 outer-left__narrowed`}
          >
            {/* Starts Left SubMenu */}
            <div className="f sidebar sidebar__menu"> 
              <ul className="f f-align-1-1 f-col translator-menu">
                <NavLink
                  tabIndex='1'
                  className={"f f-align-1-2 translator-menu__item translator-menu__item__level-1"}
                  to={{
                    pathname: Routes["feed"].path,
                    state: { mainScreen: true, page:{ typePage:"feed"} }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}>
                    <img src={icon_posts} />
                  </span>
                  <span>Запросы</span>
                  { amountFeed && amountFeed.allFeed !== 0 && <span className={"f f-align-2-2 translator-menu__item__info"}>
                    {amountFeed.allFeed}
                  </span>}
                </NavLink>
                <NavLink
                  tabIndex='1'
                  className={"f f-align-1-2 translator-menu__item translator-menu__item__level-2" }
                  to={{
                    pathname: Routes["common"].path,
                    state: { mainScreen: true,  page:{ typePage:"common"} }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}/>
                  <span>Общие</span>

                  { amountFeed && amountFeed.feedCommon  !== 0 && <span className={"f f-align-2-2 translator-menu__item__info"}>
                      {amountFeed.feedCommon}
                    </span>}
                </NavLink>
                <NavLink
                  tabIndex='1'
                  className={ "f f-align-1-2 translator-menu__item translator-menu__item__level-2" }
                  to={{
                    pathname: Routes["personal"].path,
                    state: { mainScreen: true,  page:{ typePage:"personal"} }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}/>
                  <span>Персональные</span>
                  {amountFeed && amountFeed.feedPerson  !== 0  && <span className={"f f-align-2-2 translator-menu__item__info"}>
                    {amountFeed.feedPerson}
                  </span> }
                </NavLink>
                <NavLink
                  tabIndex='1'
                  className={ "f f-align-1-2 translator-menu__item translator-menu__item__level-1" }
                  to={{
                    pathname: Routes["history"].path,
                    state: { mainScreen: false,
                             secondScreen: true,
                             page:{ typePage:"history"} }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}>
                    <img src={icon_history} />
                  </span>
                  <span>История</span>
                </NavLink>
                <div className="translator-menu__delimiter" />
              </ul>
               {/* Ends Left SubMenu */}
            </div>
          </div>

          {/*  Left Expanded Area  */}
          <Route
            path={Routes["history"].path}
            render={() => (
              <div
                ref={n => (this.secondScreen = n)}
                style={{display: `${!isTablet ? "flex" : secondScreen ? "flex" : "none"}`}}
                className="f f-align-2-2 outer-left__expanded"
              >
                <SideList
                  route={"history"}
                  title="История"
                  isTablet={isTablet}
                  this={this}
                  registerRefreshComponent = {this.registerRefreshComponent}
                  languages={languages}
                  page={page}
                />
              </div>
            )}
          />
          <Route
            ref={n => (this.sidebar = n)}
            path={Routes["reply"].path}
            render={() => (
              <div
                ref={n => (this.secondScreen = n)}
                style={{display: `${!isTablet ? "flex" : secondScreen ? "flex" : "none"}`}}
                className="f f-align-2-2 outer-left__expanded"
              >
                <SideList
                  route={"reply"}
                  title="В работе"
                  isTablet={isTablet}
                  this={this}
                  languages={languages}
                  registerRefreshComponent={this.registerRefreshComponent}
                  refresh = {this.refresh}
                  page={page}
                  Left={{shownOnDesktopLeftBtn: true}}
                />
              </div>
            )}
          />
           {/*  Ends Left Expanded Area  */}

           {/*  Main Area  */}
          <Route
            path={Routes["root"].path}
            render={({ match }) => (
              <div
                ref={n => (this.mainScreen = n)}
                style={{
                  display: `${!isTablet ? "flex" : mainScreen ? "flex" : "none"}`,
                  background: `${typePage === 'feed' || typePage === 'common' || typePage === 'personal' ? "#f5f5f5": "#fff"}`
                }}
                className={`f outer-main__expanded`}
                ref={n => (this.toggleElem = n)}
              >
                <div className="main f f-col f-align-1-2">
                  <Switch>
                    <RoutePassProps
                      exact
                      redirect={Routes["feed"].path}
                      path={Routes["root"].path}
                      component={FeedList}
                      isTablet={isTablet}
                      _self={this}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["feed"].path}
                      component={FeedList}
                      page={page}
                      isTablet={isTablet}
                      _self={this}
                      languages={languages}
                      personal
                      refresh = {this.refresh}
                      registerRefreshComponent={this.registerRefreshComponent}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["common"].path}
                      component={FeedList}
                      page={page}
                      isTablet={isTablet}
                      _self={this}
                      languages={languages}
                      common
                      refresh = {this.refresh}
                      registerRefreshComponent={this.registerRefreshComponent}
                    />
                    <RoutePassProps
                      path={Routes["personal"].path}
                      component={FeedList}
                      page={page}
                      _self={this}
                      languages={languages}
                      isTablet={isTablet}
                      refresh = {this.refresh}
                      registerRefreshComponent={this.registerRefreshComponent}
                    />
                    <RoutePassProps
                      path={`${Routes["history"].path}${Routes["history"].param}`}
                      component={HistoryList}
                      _self={this}
                      isTablet={isTablet}
                      page={page}
                      languages={languages}
                      historyUser={historyUser}
                      refresh = {this.refresh}
                    />
                    <RoutePassProps
                      path={`${Routes["reply"].path}${Routes["reply"].param}`}
                      component={Reply}
                      _self={this}
                      isTablet={this.state.isTablet}
                      registerRefreshComponent={this.registerRefreshComponent}
                      page={page}
                      refresh = {this.refresh}
                      languages={languages}
                    />
                  </Switch>
                </div>
              </div>
            )}
          />
         {/* Ends Main Area  */}

         {/*  Right Expended Area  */}
          <Route
            path={Routes["feed"].path}
            render={() => (
              <div
                ref={n => (this.secondScreen = n)}
                style={{
                  display: `${!isTablet ? "flex" : secondScreen ? "flex" : "none"}`
                }}
                className="f f-align-2-2 outer-right__expanded"
              >
                <SideList
                  route={"reply"}
                  title="В работе"
                  isTablet={isTablet}
                  this={this}
                  Left={{
                        leftBtn: true,
                        leftBtnName: "Меню",
                        newLeftBtnState: { mainScreen: false, sidebar: true, secondScreen: true }
                  }}
                  registerRefreshComponent = {this.registerRefreshComponent}
                  languages={languages}
                  page={page}
                  refresh = {this.refresh}
                />
              </div>
            )}
          />
        {/*  Ends Right Expended Area  */}
        </div>
      </div>
    );
  }
}

const BreadCrumbs = ({
  this: _self,
  Title: {title, shownOnDesktop},
  Left: { leftBtn, leftBtnName, newLeftBtnState, shownOnDesktopLeftBtn},
  Right: { rightBtn, rightBtnName, newRightBtnState },
  isTablet
}) => {
  return isTablet
    ? <div className="f f-align-13-2 breadcrumbs">
        {leftBtn
          ? <button
              onClick={() => {
                _self.setState(newLeftBtnState);
              }}
              className="f f-align-1-2 btn btn-flat breadcrumbs__back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="12"
                viewBox="0 0 7 12"
              >
                <path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" />
              </svg>
              {leftBtnName}
            </button>
          : ""}
        <span>{title}</span>
        {rightBtn
          ? <button
              onClick={() => {
                _self.setState(newRightBtnState);
              }}
              className="f f-align-1-2 btn btn-flat breadcrumbs__next"
            >
              {rightBtnName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="12"
                viewBox="0 0 7 12"
              >
                <path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" />
              </svg>
            </button>
          : ""}
      </div>
    : shownOnDesktop &&  <div className="f f-align-1-2 translator-tab__topline"> 
      {shownOnDesktopLeftBtn
          ? <Link
              to={'/'}
              className="f f-align-1-2 btn btn-flat translator-tab__topline__back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="12"
                viewBox="0 0 7 12"
              >
                <path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" />
              </svg>
              {leftBtnName}
            </Link>
          : ""}
      <span>{title}</span> </div>;
};

class DisplaySwitcher extends React.Component {
  listeners = [];
  state = {
    isTablet: false,
    mounted: false
  };

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  componentWillMount() {
    this.setState({ mounted: true });
    this.listeners.push(
      listener(
        window,
        "resize",
        debounce(
          e => {
            let isTablet = e.target.innerWidth <= 768 ? true : false;
            if (this.state.isTablet !== isTablet) this.setState({ isTablet });
          },
          200,
          false
        ),
        false
      )
    );
  }

  switchPanel = e => {
    !hasClass(this.props.toggleElem, "toggled")
      ? addClass(this.props.toggleElem, "toggled")
      : removeClass(this.props.toggleElem, "toggled");
  };

  componentWillUnmount() {
    this.listeners.forEach(f => f());
  }

  render() {
    let { mounted, isTablet } = this.state;
    return (
      <div className="DisplaySwitcher f f-col">
        <p className="u-mb-4">
          {" "}
          {mounted && isTablet
            ? <button
                className="btn btn-flat"
                onClick={debounce(this.switchPanel.bind(this), 500, false)}
              >
                {" "}переключит
              </button>
            : null}
        </p>
      </div>
    );
  }
}

class SideList extends React.Component{

  constructor(props){
    super(props);
    this.updateTranslatedList = this.updateTranslatedList.bind(this)
    this.updateWorkingList = this.updateWorkingList.bind(this)
    this.getLangPropInObj = this.getLangPropInObj.bind(this)
    this.sendDataToReply = false;
    this._isMounted = false;
  }

  state = {
    list: [],
    languages: []
  }

  componentDidMount(){
    this._isMounted = true;
    if(this.props.page.typePage === 'history'){

      this.translatedStore = new Store('translated-topic');
      this.translatedStore.start();
      this.translatedStore.addListener('update', this.updateTranslatedList);

    }else{
        // code for inwork sidebar 
      if(this.props.page.id){
          this.sendDataToReply = true;
      }
      this.inWorkStore = new Store('in-work-topic');
      this.inWorkStore.start();
      this.inWorkStore.addListener('update', this.updateWorkingList);
      let _self = this;
      this.props.registerRefreshComponent('inwork', ()=>{
          _self.inWorkStore.stop();
          _self.inWorkStore.start();
      })
      
    }
  }

  updateTranslatedList(data){
    if(!this._isMounted) return
    this.setState({list: data.list})
  }

  updateWorkingList(data){
    if(!this._isMounted) return

    // uses to block the getting more than 1 work at one time, thanx to custumer's stuped business logic
    if(data.list.length >= 1){
      this.props.refresh('feedExcess', true);
    }else{
      this.props.refresh('feedExcess', false);
    }

    this.setState({list: data.list})
    if(this.sendDataToReply)
      this.props.refresh('reply', data.list.filter(o => o.id === this.props.page.id))
  }

  componentWillReceiveProps({languages}){
    this.setState({languages})
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.inWorkStore && this.inWorkStore.stop();
    this.translatedStore && this.translatedStore.stop();
    this.inWorkStore && this.inWorkStore.removeListener('update', this.updateWorkingList)
    this.translatedStore && this.translatedStore.removeListener('update', this.updateTranslatedList)
    this.inWorkStore = null;
  }

  getLangPropInObj({ sourceLanguageId, translateLanguageId, slug }) {
    let propVal = 0;
    if (this.state.languages && this.state.languages.length > 0) {

      let currentLang = this.state.languages.filter(o => o.id === sourceLanguageId)[0];
      if (translateLanguageId === -1 && currentLang[slug]) {
        propVal = currentLang[slug];
      } else {
        propVal = currentLang.targets.filter(itm => itm.origin_id === sourceLanguageId && itm.target_id === translateLanguageId)[0][slug]
      }
    }

    return propVal
  }

  render(){
    let {
      List,
      uuidOfActiveTab: activeTab,
      route,
      title = this.props.title,
      isTablet,
      this: _rootSelf,
      Right = {
        rightBtn: false
      },
      page
    } = this.props;

    let Left = Object.assign({
      leftBtn: true,
      leftBtnName: "Меню",
      newLeftBtnState: { mainScreen: false, sidebar: true, secondScreen: true }
    },this.props.Left)

    let {list} = this.state;
    let {typePage} = this.props.page;
    return (
      <ScrollRestortion scrollId={`sidebarTranslatorDb`}  className={'f sidebar'} >
          {isTablet && <BreadCrumbs
            this={_rootSelf}
            isTablet={isTablet}
            Title={{
                title: title,
                shownOnDesktop: false
            }}
            Left={Left}
            Right={Right}
          />}

          {/* litle fix for desktop*/}
          {!isTablet && <BreadCrumbs
            this={_rootSelf}
            isTablet={isTablet}
            Title={{
                title: title,
                shownOnDesktop: true
            }}
            Left = {{
              leftBtn: true,
              leftBtnName: "Назад",
              newLeftBtnState: { mainScreen: true, sidebar: false, secondScreen: false },
              shownOnDesktopLeftBtn: Left.shownOnDesktopLeftBtn
            }}
            Right={Right}
          />}

        {list.map((tab, index) => {
          let publishTime = new Date(tab.started_at);
          let now = new Date();
          let outputPublishTime = ''; 
          
          if(publishTime.getFullYear() === now.getFullYear() && publishTime.getMonth() === now.getMonth() && publishTime.getDate() + 7 >  now.getDay() ){
            outputPublishTime = getDayName(publishTime.getDay());
          }
          if(publishTime.getFullYear() !== now.getFullYear() || publishTime.getMonth() !== now.getMonth() || publishTime.getDate() + 7 <=  now.getDay()){
            outputPublishTime = `${publishTime.getDate()}.${getFullTimeDigits(publishTime.getMonth())}.${publishTime.getFullYear().toString().substr(-2, 2)}`;
          }
          if( publishTime.getFullYear() === now.getFullYear() && publishTime.getMonth() === now.getMonth() && publishTime.getDate() === now.getDate()){
            outputPublishTime = `${publishTime.getHours()}:${getFullTimeDigits(publishTime.getMinutes())}`
          }
          //     inwork has sourcemessage
          let duration =    tab.source_messages.length > 0 ? tab.source_messages[0].letters_count * this.getLangPropInObj({
            sourceLanguageId: tab.source_language_id,
            translateLanguageId: tab.translate_language_id, 
            slug:'letter_time'}) : (new Date(tab.translated_at) - new Date(tab.started_at)) / 1000 ;
          return (
            <Link
              to={{pathname: `${Routes[route].path}/${typePage === 'history' ? tab.user_id : tab.id}`, state: {page:{typePage:route, id: typePage ===  'history' ? tab.user_id : tab.id}, historyUser: typePage ===  'history' ? tab.user : '', secondScreen: false, mainScreen: true}}}
              className={`f f-align-1-2 translator-tab ${tab.id === page.id || tab.user_id === page.id ? "selected" : ""}`}
              key={index}
            >
              <figure className="f f-align-2-2 translator-tab-avatar"><img src={ tab.user.image || avatar} alt="Textra" /></figure>
              <div className="f f-col f-align-1-1 translator-tab-details">
                <div className="translator-tab-title">{tab.user.first_name + ' ' + tab.user.last_name} </div>
                <div className="translator-tab-content">
                  {tab.source_messages.length > 0 ? tab.source_messages[tab.source_messages.length-1].content : tab.translate_messages.length > 0 ? tab.translate_messages[tab.translate_messages.length-1].content : ''}
                </div>
              </div>
              <div className="f f-col f-align-2-3 translator-tab-info">
                <div className="translator-tab-info__time">
                { this.props.page.typePage !== 'history' &&
                  <Batch
                    flushCount={0}
                    flushInterval={300} 
                    count={1}
                    debug={false}
                    render={(()=> {
                       if(this.props.page.typePage !== 'history'){ // inwork
                        let start = tab['started_at'];
                         let duration = tab.source_messages.length > 0 ? tab.source_messages[tab.source_messages.length - 1]['letters_count'] * this.getLangPropInObj({
                           sourceLanguageId: tab.source_language_id,
                           translateLanguageId: tab.translate_language_id,
                           slug: 'letter_time'}) : 0;

                        return <Timer start={start} duration={duration} />

                         }else{ // history
                      //   let created_at = new Date(tab.created_at);
                      //   let translated_at = new Date(tab.translated_at);
                      //   let started_at = new Date(tab.started_at);
                      //   let durationShouldBe = tab.translate_messages.length > 0 ? tab.translate_messages[tab.translate_messages.length-1]['letters_count'] * this.getLangPropInObj({id:tab.translate_language_id, slug:'letter_time'}) : 0;
                      //   let finishShouldBe = new Date(+started_at + durationShouldBe * 1000);
                      //   let duration =  (translated_at - started_at)/1000 ; //sec
                      //   return <Timer start={started_at} duration={duration} finish={finishShouldBe}/>
                       }
                      //console.log(value)
                    }).bind(this)}/>
                  }
                  <time>{outputPublishTime}</time>
                </div>
                {tab.source_language_id && tab.translate_language_id &&  
                  <LangLabel 
                    from={this.getLangPropInObj({
                    sourceLanguageId: tab.source_language_id,
                      translateLanguageId: -1,
                      slug: 'code'})} 
                    to={this.getLangPropInObj({
                      sourceLanguageId: tab.translate_language_id,
                      translateLanguageId: -1,
                      slug: 'code'})} 
                    selected={page.id === tab.id}
                    />
                  }
                <div className="translator-tab-info__duration">
                  {humanReadableTime(duration)}
                </div>
              
              </div>
            </Link>
          );
        })}
      </ScrollRestortion>
    );
  };
}

const RoutePassProps = ({ component: Component, redirect, ...rest }) =>
  (!redirect
    ? <Route {...rest} render={props => <Component {...props} {...rest} />} />
    : <Redirect to={`${redirect}`} />);


const lcMatch = (q, s) => s && s.toLowerCase().indexOf(q.toLowerCase()) >= 0;

class FeedList extends React.Component {

  constructor(props){
    super(props);
    this.feedStore = null;
    this.feedUpdateHandler = this.feedUpdateHandler.bind(this);
    this.getLangPropInObj = this.getLangPropInObj.bind(this);
    this.confirm = this.confirm.bind(this);
    this._isMounted = false;
    this.redirectToReply ={do: false, replyId: undefined};
  }

  state = {
    currentData: [],
    languages: [],
    isfeedExcess: false,
    loaded: false,
    error: null
  }

  componentDidMount(){
    this._isMounted = true;
    let ids = FeedStore.getIds('pending-topic');
    if(ids && ids.length > 0){ // get from cache 
      let listItems = ids.map(id => {
        return FeedStore.getItem(id);
      })
      this.feedUpdateHandler({from: 'cache', list: listItems})
    }
    let {page: {typePage, id} } = this.props;
    this.feedStore = new FeedStore('pending-topic', typePage);
    this.feedStore.start();
    this.feedStore.addListener('update', this.feedUpdateHandler);

    this.setState({languages: this.props.languages})

    let _self = this; 
    this.props.registerRefreshComponent('feedExcess', isfeedExcess => _self.setState({isfeedExcess}))

  }

  feedUpdateHandler(data){
    if(!this._isMounted || !data) return;
    //data.list = data.list.reverse();
    let indexedList = data.list.map((item, idx) => {
      item.index = idx;
      return item
    })
    this.props.refresh('amountFeed', data)
    this.setState({currentData: indexedList, loaded: true})
  }

  componentWillReceiveProps({languages}){
    this.setState({languages})
  }

  componentWillUnmount(){
    this.feedStore.stop();
    this.feedStore.removeListener('update', this.feedUpdateHandler);
    this.feedPros = null;
    this._isMounted = false;
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  getLangPropInObj({ sourceLanguageId, translateLanguageId, slug }) {
    let propVal = 0;
    if (this.state.languages && this.state.languages.length > 0) {

      let currentLang = this.state.languages.filter(o => o.id === sourceLanguageId)[0];
      if (translateLanguageId === -1 && currentLang[slug]) {
        propVal = currentLang[slug];
      } else {
        propVal = currentLang.targets.filter(itm => itm.origin_id === sourceLanguageId && itm.target_id === translateLanguageId)[0][slug]
      }
    }

    return propVal
  }

  confirm(id, index) {
    let _self = this, doRedirect = true;
    return function(e){
        TxRest.getDataByID(`join-topic/${id}`,{}).then( async data => {
          if(!_self._isMounted) return
          if(data.message){
              _self.setState({error:{message:data.message, index, id}})
              _self.forceUpdate();
              doRedirect = false; 
              await sleep(4000) // hack I should find better way
          }
          let {allFeed, feedCommon, feedPerson} = _self.feedStore.getState();
          allFeed--; 
          if( !!_self.state.currentData[index]['translator_id']){
            feedPerson--;
            _self.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
          }else{
            feedCommon--;
            _self.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
          }
          _self.feedStore.deleteItem(index, id, {feedCommon:feedCommon, feedPerson:feedPerson});
          _self.state.currentData.splice(index,1);
          _self.props.refresh('inwork');
          //console.log(!(_self.state.error && _self.state.error.message))
          _self.redirectToReply = { do: doRedirect , replyId: id};
          _self.forceUpdate();
        })
    }
  }

  render() {


    if (this.redirectToReply && this.redirectToReply.replyId && this.redirectToReply.do){
      return <Redirect 
      to={{pathname: Routes['reply'].path + '/' + this.redirectToReply.replyId, state: {page:{typePage:'reply', id: this.redirectToReply.replyId}, historyUser: '', secondScreen: false, mainScreen: true}}} />
    }
    
    let { location: { pathname }, isTablet, _self: parentThis, page: {typePage, id} } = this.props;
    let { currentData, isfeedExcess, loaded, error } = this.state;
    let _self = this;
    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={parentThis}
                isTablet={isTablet}
                Title={{
                    title: "Запросы",
                    shownOnDesktop: false
                }}
                Left={{
                    leftBtn: true,
                    leftBtnName: "Меню",
                    newLeftBtnState: { mainScreen: true, sidebar: true }
                    }}
                Right={{
                rightBtn: true,
                rightBtnName: "Текущие",
                newRightBtnState: {
                    mainScreen: false,
                    secondScreen: true,
                    sidebar: false
                }
                }}
            />
            {/*<Breadcrumbs/> and next line is a breadcrums itself but first for mobile, second for desktop: need to be refactor) just test I think all be good without next line && shownOnDesktop: true*/}
            {!isTablet && <div className="f f-align-1-2 translator-feed__topline"><span>Запросы</span></div>}
            
            
            {Object.entries(currentData).length === 0 && this._isMounted &&
    
              <div className={"f f-align-2-33 translator-feed u-mx-3 u-my-2"}>
                  <div className={"translator-feed__avatar"}>
                    <img src={avatar} />
                  </div>
                  <div className={"f f-align-2-2 translator-feed__placeholder"}>
                    <span>Запросы на перевод отсутствуют</span>
                  </div>
                </div>
            }

          {currentData.map((feedData, index) => {
            feedData.publishTime = new Date(feedData.created_at);
            feedData.duration = feedData.source_messages && feedData.source_messages.length > 0 ? feedData.source_messages[0].letters_count * _self.getLangPropInObj({                                sourceLanguageId: feedData.source_language_id, 
              translateLanguageId: feedData.translate_language_id,
              slug:'letter_time'}) : 0 
            return renderItem(feedData, index);
          })}
        </div>
      );
    };
    return  RenderCollection((feed, index) => (
          <div key={index} data-msgid={feed.id} className={`f f-align-1-33 translator-feed ${isfeedExcess ? '': 'canGetMore'} ${error && error.id === feed.id? 'isRemoving':''} u-mx-3 u-my-2`}>
              {/* feed entry start */}
            {error &&  error.id === feed.id && 
              <div className="f f-align-2-2 translator-feed__overlay">
                {error.message}
              </div>
            }
            <div className={"translator-feed__avatar"}>
              <img src={feed.user && feed.user.image || avatar} alt={feed.user.first_name} />
              {currentData.isTablet &&
                <div className={"translator-feed__content__topbar__name"}>
                  {feed.nickname}
                </div>}
              {currentData.isTablet &&
                feed.isPersonal &&
                <div className={"translator-feed__content__topbar__personal"}>
                  персональный
                </div>}
              {currentData.isTablet &&
                <div className={"translator-feed__content__topbar__date"}>
                  {feed.publishTime.getDate()}{" "}{getMonthName(feed.publishTime.getMonth())}
                  ,
                  {" "}{feed.publishTime.getFullYear()}{" "}
                  -
                  {" "}{feed.publishTime.getHours()}
                  :
                  {getFullTimeDigits(feed.publishTime.getMinutes())}
                </div>}
            </div>
            <div className={"f f-1-2 f-col translator-feed__content"}>
              <div className={"f f-1-2 translator-feed__content__topbar"}>
                {!currentData.isTablet &&
                  <div className={"translator-feed__content__topbar__name"}>
                    {feed.user.first_name + ' ' +  feed.user.last_name}
                  </div>}
                {!currentData.isTablet &&
                  (feed.translator_id !== null) &&
                  <div className={"translator-feed__content__topbar__personal"}>
                    персональный
                  </div>}
                {!currentData.isTablet &&
                  <div className={"translator-feed__content__topbar__date"}>
                    {feed.publishTime.getDate()}{" "}{getMonthName(feed.publishTime.getMonth())}
                    ,
                    {" "}{feed.publishTime.getFullYear()}{" "}
                    -
                    {" "}{feed.publishTime.getHours()}
                    :
                    {getFullTimeDigits(feed.publishTime.getMinutes())}
                  </div>}
              </div>
              <div className={"translator-feed__content__text"}>
                {feed.source_messages.length > 0 ? feed.source_messages[0].content : ''}
              </div>
              <div className={"f f-align-1-2 f-gap-4 translator-feed__content__bottombar"}>
                {feed.source_language_id && feed.translate_language_id &&  
                  <LangLabel 
                    from={this.getLangPropInObj({ 
                      sourceLanguageId: feed.source_language_id, 
                      translateLanguageId: -1, 
                      slug:'code'})}
                    to={this.getLangPropInObj({ 
                      sourceLanguageId: feed.translate_language_id, 
                      translateLanguageId: -1 ,
                      slug:'code'})}
                  />
                  }
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_dur}
                  value={humanReadableTime(feed.duration)}
                  hint={"Длительность перевода"}
                />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_letternum}
                  value={feed.source_messages.length>0 ? feed.source_messages[0].letters_count: 0}
                  hint={"Количество символов"}
                />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_cost}
                  value={`${(feed.price/100).toFixed(2)}₴`}
                  hint={"Price"}
                />
              </div>
            </div>
            <button className={"f f-align-2-2 translator-feed__constols"} onClick={this.confirm(feed.id, index)}>
              <svg // ✔️
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="24"
                viewBox="0 0 28 24"
              >
                <path
                  fill="#9ca9b2"
                  d="M26.22 0L8.64 20.74l-7.39-6.9L0 15.17l8.1 7.53.71.65.59-.71L27.59 1.16z"
                />
              </svg>
            </button>
            {/* feed entry end*/}
          </div>
        ));
  }
}


class Reply extends React.Component {
  constructor(props){
    super(props);
    this.answerNode = null;
    this._isMounted = false; 
    this.startPos = 20;
    this.timesItWasEnlarge = 0;
    this.updateHandler = this.updateHandler.bind(this)
    this.getLangPropInObj = this.getLangPropInObj.bind(this)
    this.sendTranslaton = this.sendTranslaton.bind(this)
    this.inWorkStore = null;
    this.startSocket = this.startSocket.bind(this);
    this.onSocket = this.onSocket.bind(this);
    this.isSocketOn = false;
  }

  state = {
    isBlocking : false,
    languages: [],
    currentData: [],
    translateMessage: '',
    redirectToFeed: false
  }

  componentDidMount(){
    this._isMounted = true;
    let ids = Store.getIds('in-work-topic');
    
    if(ids.indexOf(this.props.id)){
      this.setState({curentData: Store.getItem('in-work-topic' + this.props.id) })
    }else{
      this.inWorkStore = new Store('in-work-topic');
      this.inWorkStore.start();
      this.inWorkStore.addListener('update',this.updateHandler);
    }
    let _self = this;
    this.props.registerRefreshComponent('reply', ( currentData )=>{
         _self.setState({currentData: currentData[0]})
    })


    // real time for sidebar digits
    if(Auth.alreadyInitSocket){
      this.startSocket();
    }else{
      Auth.addListener('AuthStore.alreadyInitSocket', this.startSocket)
    }

    let feedCommon = Number(window.sessionStorage.feedCommon) || 0,
    feedPerson = Number(window.sessionStorage.feedPerson) || 0,
    allFeed = feedCommon + feedPerson;
    this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
      
  }

  
  startSocket(){
    
      !this.isSocketOn && window.io.socket.on('topic', this.onSocket);
      this.isSocketOn = true;
  }

  onSocket(data){
    if( data.translator_id && Auth.user.id !== data.translator_id) return // not for this user personal feed
    
    let feedCommon = Number(window.sessionStorage.feedCommon) || 0,
        feedPerson = Number(window.sessionStorage.feedPerson) || 0,
        allFeed = +feedCommon + +feedPerson + 1,
        prefix = '';
        if(window.sessionStorage.feedCommon === undefined || window.sessionStorage.feedPerson === undefined){
          prefix = '+';
        }
        if( !!data['translator_id']){
          window.sessionStorage.feedPerson = feedPerson + 1;
          feedPerson = +feedPerson + 1;
          allFeed = prefix + allFeed;
          feedPerson = prefix + feedPerson;
          this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
        }else{
          window.sessionStorage.feedCommon = feedCommon + 1;
          feedCommon = +feedCommon + 1;
          allFeed = prefix + allFeed;
          feedCommon = prefix + feedCommon;
          this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
        }
  }

  updateHandler({list}){
    if(!this._isMounted) return
    this.setState({currentData: list.filter(o => o.id === this.props.id)})
  }

  componentWillReceiveProps({languages}){
    this.setState({languages})
  }


  componentWillUnmount(){
    if(this.inWorkStore){
      this.inWorkStore.stop();
      this.inWorkStore.removeListener('update', this.updateList)
      this.inWorkStore = null;
    }
    Auth.removeListener('AuthStore.alreadyInitSocket')
    if(window.io) {
      this.isSocketOn = false;
      window.io.socket.off('topic', this.onSocket);
    }

    this._isMounted = false;
    this.timesItWasEnlarge = 0;


  }

  getLangPropInObj({ sourceLanguageId, translateLanguageId, slug }) {
    let propVal = 0;
    if (this.state.languages && this.state.languages.length > 0) {

      let currentLang = this.state.languages.filter(o => o.id === sourceLanguageId)[0];
      if (translateLanguageId === -1 && currentLang[slug]) {
        propVal = currentLang[slug];
      } else {
        propVal = currentLang.targets.filter(itm => itm.origin_id === sourceLanguageId && itm.target_id === translateLanguageId)[0][slug]
      }
    }

    return propVal
  }

  currentNumberOfChar({target: {value}}){
      this.setState({isBlocking: value.length > 0, translateMessage: value})
   
      if(this._isMounted && this.answerNode ){
        this.answerNode.style.height = 'auto';
        this.startPos =  Math.min(this.answerNode.scrollHeight, 20*10)
        this.answerNode.style.height = this.startPos + 'px';
        this.timesItWasEnlarge++;
      }

  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    return false
  }

  sendTranslaton(e){
    e.preventDefault();
    let {translateMessage, currentData} = this.state;
    if(!translateMessage.length || !currentData.source_messages.length) return;
    let _self = this;
    TxRest.putData(`translate-message/${currentData.source_messages[0].id}`,{
	      "message": translateMessage
    }).then(data =>{
      if(data.id){
        _self.props.refresh('inwork');
        _self.setState({translateMessage:'', redirectToFeed: true})
        Auth.update(data.translator);
      }else{
        console.log(data) // TODO: handle error
      }
    })
  }

  render() {
    let { isTablet } = this.props;
    let {currentData, languages, redirectToFeed} = this.state;


    if(redirectToFeed)
      return <Redirect to={Routes['root'].path}/>


    if(!currentData)
        return <div/>


    let _self = this, started_at = null;
    if(currentData.started_at){
      started_at = new Date(currentData.started_at);
    }
    currentData.duration = currentData.source_messages && currentData.source_messages.length > 0 ? currentData.source_messages[0].letters_count * this.getLangPropInObj({
      sourceLanguageId: currentData.source_language_id,
      translateLanguageId: currentData.translate_language_id,
      slug: 'letter_time'}) : 0

    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={this.props._self}
                isTablet={isTablet}
                Title={{
                    title: currentData.user && `Перевод для ${currentData.user.first_name}  ${currentData.user.last_name}`,  // we get [0] because the very first item in thread can be only from user
                    shownOnDesktop: false
                }}
                Left={{
                    leftBtn: true,
                    leftBtnName: "Меню",
                    newLeftBtnState: { 
                        mainScreen: true, 
                        sidebar: true 
                    }
                    }}
                Right={{
                rightBtn: true,
                rightBtnName: "Назад",
                newRightBtnState: {
                    mainScreen: false,
                    secondScreen: true,
                    sidebar: false
                }
                }}
            />
            <Prompt
                when={this.state.isBlocking}
                message={location => (
                  `Вы уверены, что хотите уйти`
                )}
             />
          {
            renderItem(Object.assign({},currentData), 1, new Date(currentData.publishTime))
          }
          
        </div>
      );
    };
    return (currentData.length === 0 
            ? <div/>
            : RenderCollection((currentData, index, publishTime) => (
            <div className={"f f-col f-align-1-1 translator-replypost"}>
                {started_at &&  <div className={"data__delimiter"}>
                {started_at && started_at.getDate()} {started_at && getMonthName(started_at.getMonth())}, {started_at.getFullYear()}
                </div>}

                <div className={"f f-align-1-1 translator-post "}>
                <div className={"translator-post__content"}>
                    <div className={"translator-post__content__text"}>
                       {currentData.source_messages && currentData.source_messages.length > 0 && currentData.source_messages[0].content}
                    </div>
                    <div className={"f f-align-1-2 f-gap-4 translator-post__content__bottombar"}>
                    <LangLabel 
                      from={this.getLangPropInObj({
                        sourceLanguageId: currentData.source_language_id,
                        translateLanguageId: -1,
                        slug: 'code'})}
                      to={this.getLangPropInObj({
                          sourceLanguageId: currentData.translate_language_id,
                          translateLanguageId: -1,
                          slug: 'code'
                        })} 
                     />
                    <Indicator
                        className={"f f-align-2-2"}
                        icon={icon_dur}
                        value={humanReadableTime(currentData.duration)}
                        hint={"Длительность перевода"}
                    />
                    {currentData.source_messages && currentData.source_messages.length > 0 && currentData.translator_id &&
                      <Batch
                        flushCount={0}
                        flushInterval={150}
                        count={1}
                        debug={false}
                        render={()=> {
                          let value = ~~Math.abs(currentData.duration - (new Date - new Date(currentData.started_at)) / 1000);
                          //console.log(value)
                          return(<Indicator
                            className={'f f-align-2-2'}
                            icon={
                              <Timer
                                start={currentData.started_at}
                                duration={currentData.duration}
                                isBig={true} />}
                            value={humanReadableTime(value)}
                            hint={'Оставшееся время'} />)
                        }}/>
                      }
                    <Indicator
                        className={"f f-align-2-2"}
                        icon={icon_letternum}
                        value={currentData.source_messages && currentData.source_messages.length > 0 ? currentData.source_messages[0].letters_count : 0}
                        hint={"Количество символов"}
                    />
                    <Indicator
                        className={"f f-align-2-2"}
                        icon={icon_cost}
                        value={`${Number.isNaN(currentData.price) ? 0 : (currentData.price/100).toFixed(2)}₴`}
                        hint={"Стоимость"}
                    />

                    </div>
                </div>
                <div className={"translator-post__date"}>
                    {started_at && started_at.getHours()}:{ started_at && getFullTimeDigits(started_at.getMinutes())}
                </div>
                </div>
                <div className={"f f-align-2-3 translator-reply"}>
                    <textarea
                    ref= { (node) => this.answerNode = node }
                    type="text"
                    tabIndex={1}
                    name="translator[reply]"
                    placeholder={'Ваш ответ на запрос...'}
                    value={this.state.translateMessage}
                    onChange={this.currentNumberOfChar.bind(this)}
                    />
                <div className={"translator-reply__sent u-ml-3 u-mt-3"}>
                    <button  tabIndex={1} className={"btn btn-mini btn-primiry"} onClick={this.sendTranslaton}>Отправить</button>
                </div>
                </div>
            </div>)
    ));
  }
}


class HistoryList extends React.Component {

  constructor(props) {
    super(props);
    this.id = this.props.page.id;
    this.getLangPropInObj = this.getLangPropInObj.bind(this)
    this._isMounted = false;
    this.messageStore =null;
    this.updateHandler = this.updateHandler.bind(this);
    this.lastCreatedDate = null;
    this.startSocket = this.startSocket.bind(this);
    this.onSocket = this.onSocket.bind(this);
    this.isSocketOn = false;
  }

  state={
    currentData: {},
    translator: this.props.translator ? this.props.translator: {},
    languages: this.props.languages
  }

  componentWillMount(){
    this.messageStore = new MessageStore('translated-topic/user', this.id);
    if(this.id)
    this.setState({currentData: MessageStore.getMessages('translated-topic/user', this.id) })
  }

  componentDidMount(){
    this._isMounted = true;
    this.messageStore.start();
    this.messageStore.addListener('updateMessage', this.updateHandler)

    // real time for sidebar digits
    if(Auth.alreadyInitSocket){
      this.startSocket();
    }else{
      Auth.addListener('AuthStore.alreadyInitSocket', this.startSocket)
    }

    let feedCommon = Number(window.sessionStorage.feedCommon) || 0,
        feedPerson = Number(window.sessionStorage.feedPerson) || 0,
        allFeed = feedCommon + feedPerson;
    this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
      
  }

  updateHandler({list}){
    this.setState({currentData : list})
  }

  componentWillReceiveProps({languages, id, translator}){
    let _self = this;
    if(!_self._isMounted) return 
    if(id)
      this.setState({currentData: MessageStore.getMessages('translated-topic/user', id)})

    this.setState({languages, translator});
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.messageStore.stop();
    this.messageStore.removeListener('updateMessage', this.updateHandler)
    this.messageStore = null;
    Auth.removeListener('AuthStore.alreadyInitSocket')
    if(window.io) {
      this.isSocketOn = false;
      window.io.socket.off('topic', this.onSocket);
    }
  }

  getLangPropInObj({ sourceLanguageId, translateLanguageId, slug }) {
    let propVal = 0;
    if (this.state.languages && this.state.languages.length > 0) {

      let currentLang = this.state.languages.filter(o => o.id === sourceLanguageId)[0];
      if (translateLanguageId === -1 && currentLang[slug]) {
        propVal = currentLang[slug];
      } else {
        propVal = currentLang.targets.filter(itm => itm.origin_id === sourceLanguageId && itm.target_id === translateLanguageId)[0][slug]
      }
    }

    return propVal
  }

  startSocket(){
      !this.isSocketOn && window.io.socket.on('topic', this.onSocket);
      this.isSocketOn = true;
  }

  onSocket(data){

    if( data.translator_id && Auth.user.id !== data.translator_id) return // not for this user personal feed
    
    let feedCommon = Number(window.sessionStorage.feedCommon) || 0,
        feedPerson = Number(window.sessionStorage.feedPerson) || 0,
        allFeed = +feedCommon + +feedPerson + 1,
        prefix = '';
        if(window.sessionStorage.feedCommon === undefined || window.sessionStorage.feedPerson === undefined){
          prefix = '+';
        }
        if( !!data['translator_id']){
          window.sessionStorage.feedPerson = feedPerson + 1;
          feedPerson = +feedPerson + 1;
          allFeed = prefix + allFeed;
          feedPerson = prefix + feedPerson;
          this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
        }else{
          window.sessionStorage.feedCommon = feedCommon + 1;
          feedCommon = +feedCommon + 1;
          allFeed = prefix + allFeed;
          feedCommon = prefix + feedCommon;
          this.props.refresh('amountFeed', {allFeed, feedCommon, feedPerson})
        }
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

  render() {
    let {isTablet, historyUser, _self} = this.props;
    let { currentData, translator } = this.state || {currentData: []};
    if (!currentData.length)
      return(<div/>)
    currentData = currentData.reverse();
    this.lastCreatedDate = null;
    const renderCollection = renderItem => (
     <ScrollRestortion scrollId={`history${this.id}`} scrollToEndByDefault={true} className={'f f-col dashboard-user__history'} >
        <BreadCrumbs
            this={_self}
            isTablet={isTablet}
            Title={{
                title:  historyUser && historyUser.first_name + ' ' +  historyUser.last_name,
                shownOnDesktop: false
            }}
            Left={{
                leftBtn: true,
                leftBtnName: "Меню",
                newLeftBtnState: { mainScreen: true, sidebar: true }
                }}
            Right={{
            rightBtn: true,
            rightBtnName: "История",
            newRightBtnState: {
                mainScreen: false,
                secondScreen: true,
                sidebar: false
            }
            }}
        />
        {/* ALl merged history */}

        {currentData.map((item, idx) => renderItem(item, idx))}
        

      </ScrollRestortion>
    )

    return ( renderCollection((currentData, idx) => {
      if(!currentData || !currentData.source_messages.length )
          return <div key={idx} />
      let created_at = new Date(currentData.created_at);
      let translated_at = new Date(currentData.translated_at);
      let started_at = new Date(currentData.started_at);
    
      let durationShouldBe = currentData.source_messages[0].letters_count * this.getLangPropInObj({
        sourceLanguageId: currentData.source_language_id,
        translateLanguageId: currentData.translate_language_id,
        slug: 'letter_time'});
      let finishShouldBe = new Date(+started_at + durationShouldBe * 1000);
      let duration =  (translated_at - started_at)/1000 ; //sec


      let showHeaderDate = true;
      if(this.lastCreatedDate && this.lastCreatedDate.getDate() === translated_at.getDate() && this.lastCreatedDate.getMonth() === translated_at.getMonth() && this.lastCreatedDate.getFullYear() === translated_at.getFullYear()){
        showHeaderDate = false;
      }
      this.lastCreatedDate = translated_at;

      return (
        <div key={idx}>
          { showHeaderDate && <div className={'data__delimiter'}>{translated_at.getDate()} {getMonthName(translated_at.getMonth())}, {translated_at.getFullYear()}</div>}
          <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-post '}>
            <div className={'dashboard-user__history-post__avatar'}>
              <img src={historyUser.image || avatar} alt={historyUser.first_name} />
            </div>
            <div className={'dashboard-user__history-post__content'}>
              <div className={'dashboard-user__history-post__content__text'}>
                {currentData.source_messages.length > 0 &&  currentData.source_messages[currentData.source_messages.length-1].content}
              </div>
              <div className={'f f-align-1-2 f-gap-4 dashboard-user__history-post__content__bottombar'}>
                {currentData.source_language_id && currentData.translate_language_id &&  
                  <LangLabel
                    from={this.getLangPropInObj({
                      sourceLanguageId: currentData.source_language_id,
                      translateLanguageId: -1,
                      slug: 'code'
                    })}
                    to={this.getLangPropInObj({
                      sourceLanguageId: currentData.translate_language_id,
                      translateLanguageId: -1,
                      slug: 'code'
                    })}
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
                <img src={Auth.user.image || avatar} alt={Auth.user.first_name} />
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

export default withRouter(Translator);
