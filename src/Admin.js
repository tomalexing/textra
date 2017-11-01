import React from "react";
import "./style/app.css";
import "./style/index.css";
import avatar from "./assets/default-avatar.png";
import icon_cost from "./assets/cost-of-translation.svg";
import icon_dur from "./assets/duration-of-translation.svg";
import icon_letternum from "./assets/letter-number.svg";
import copy from "./assets/icon-copy.svg";
import users from "./assets/users.svg";
import appeals from "./assets/appeals.svg";
import deleteIcon from './assets/delete.svg';

import "./polyfill";
import  Auth from './store/AuthStore.js';
import {
  Link,
  Route,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";
import {
  getUniqueKey,
  debounce,
  delegate,
  humanReadableTime,
  getMonthName,
  getFullTimeDigits,
  quickSort,
  getTabTime,
  ScrollRestortion
} from "./utils";

import Batch from "./components/Batch";

import Header, { NavLink } from "./components/Header";

import Timer from "./components/Timer";
import LangLabel from "./components/LangLabel";
import Indicator from "./components/Indicator";
import TabDelimiter from "./components/TabDelimiter";
import deepEqual from 'deep-equal';

import { Checkbox, Icon, Table, Dropdown, Input } from 'semantic-ui-react'

import Store  from './store/Store.js';
import UserStore  from './store/UserStore.js';
import MessageStore  from './store/MessageStore.js';
import {TxRest}  from './services/Api.js';

const Routes = {
  root: {
    path: "/admin",
    exact: true
  },
  users: {
    path: "/admin/users",
    exact: false
  },
  user: {
    path: "/admin/user",
    exact: false,
    param: "/:id"
  },
  history: {
    path: "/admin/user/:id/history",
    exact: false,
    param: "/:history"
  },
  appeals: {
    path: "/admin/appeals",
    exact: false
  },
  appeal: {
    path: "/admin/appeal",
    exact: false,
    param: "/:id"
  }
};

//  'a' resorved for ALL
const Roles = [
  {
    text: 'Пользователь',
    value: 'u', //  user
    icon: { name: 'circle', color: 'grey', size: 'small' },
  },
  {
    text: 'Контроллер',
    value: 'c', // consroller
    icon: { name: 'circle', color: 'yellow', size: 'small' },
  },
  {
    text: 'Администратор',
    value: 'd', // consroller
    icon: { name: 'circle', color: 'red', size: 'small' },
  },
  {
    text: 'Переводчик',
    value: 't', // translator
    icon: { name: 'circle', color: 'blue', size: 'small' },
  },
   {
    text: 'Стать переводчиком',
    value: 'p', // possibility
    icon: { name: 'circle', color: 'blue', size: 'small' },
  }, 
   {
    text: 'Отзыв',
    value: 'g', // grumble
    icon: { name: 'circle', color: 'red', size: 'small' },
  }, 
   {
    text: 'Прочее',
    value: 'o', // other
    icon: { name: 'circle', color: 'grey', size: 'small' },
  }, 
];


const ROLES = (num) => {
  switch(num){
  case('0') : return('d')
  case('1') : return('c')
  case('2') : return('t')
  case('3') : return ('u')
  default   : return('user')
  }
};

const APPEALS = (num) => {
  switch(num){
  case('0') : return('p')
  case('1') : return('g')
  case('2') : return('o')
  default   : return('o')
  }
};

const GETINITIALROLE = (num) => {
  switch(num){
  case('d') : return('0')
  case('c') : return('1')
  case('t') : return('2')
  case('u') : return ('3')
  default   : return('3')
  }
};


const findIcon = (objs, id, prop = 'icon') => Object.values(objs).find(o => o.value === id)[prop];


    // Types of user:
    // u - user
    // c - controller
    // t - translater
    // p - possibility
    // g - appeal
    // o - other

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.store = null;
    this._isMounted = false;
    this.renders = 0;
    this.updateLanguageHandler = this.updateLanguageHandler.bind(this);
    this.boundRef = this.boundRef.bind(this);
  }

  state = {
    items: [],
    mainScreen: true,
    secondScreen: false,
    sidebar: false,
    page:{
      pageType: 'users',
      id: undefined,
      historyId: undefined
    },
    translator: {},
    languages: [],
    redirectToMain: false
  };

  addStyleSeheet(){
    let style = document.createElement('link');
    style.rel = "stylesheet";
    style.href = "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css";
    let element = document.getElementsByTagName('style')[0];
    element.insertAdjacentElement('afterend',style);
  }

  async componentWillMount() {
    this.doAtDidMount.forEach(func => func());
    this.addStyleSeheet();

    let { location: { pathname, state: RouterState } } = this.props;
    if(!RouterState && pathname !== '/admin/users' ){
      if(pathname !== '/admin')
        this.setState({redirectToMain:true});
    }
    await this.setState({
      page:{
        pageType: RouterState ? RouterState.pageType : 'users',
        id: RouterState ? RouterState.id : undefined ,
        historyId: RouterState ? RouterState.historyId : undefined,
      },
      attachedUser: RouterState ? RouterState.attachedUser : null, // for history
      item: RouterState ? RouterState.item : null // for appeals
    })
  }

  componentDidMount(){
    this._isMounted = true;
    if(this.bg){
      this.listeners.push(
        delegate.call(this, window, "touchend", `.${Array.from(this.bg.classList).join(".")}`,
          event => {
            if (!this.state.sidebar || event.target.closest(".sidebar__menu")) return;
            this.setState({ sidebar: false });
          },
          false
        )
      );
    }

    
    this.languageStore = new Store('language');
    let languageStoredIds = Store.getIds('language');
    if(languageStoredIds && languageStoredIds.length) {
      let langsFromStore = languageStoredIds.map(id => Store.getItem(id));
      this.updateLanguageHandler({list : langsFromStore});
    }
    this.languageStore.start();
    this.languageStore.addListener('update', this.updateLanguageHandler);
  }
  
  // componentWillUpdate(nextProps, nextState){
  //   let { location: { pathname, state: RouterState } } = this.props;
  //   let activeTabA = pathname.split("/");
  //   let _self = this;
  //   this.setState({
  //     page:{
  //       pageType: RouterState ? RouterState.pageType : 'users',
  //       id: RouterState ? RouterState.id : undefined ,
  //       historyId: pathname.split("/")[activeTabA.length - 1] ,
  //     }
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    let { location: { pathname, state : {pageType , id, historyId} = {pageType: 'users'}} } = nextProps;
    let activeTabA = pathname.split("/");
    this.setState({
      page:{
        pageType: pageType ? pageType : 'users',
        id: id ? id : pathname.split("/").filter(el => el !== '').splice(-3)[0],
        historyId: historyId ? historyId :  pathname.split("/")[activeTabA.length - 1],
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.languageStore.stop();
    this.languageStore.removeListener('update', this.updateLanguageHandler);
    this.languageStore = null;
    this.listeners.forEach(removeEventListener => removeEventListener());
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  updateLanguageHandler({list}){
    if(!this._isMounted) return
    this.setState({languages: list})
  }

  boundRef = place => (n => (this[place] = n)).bind(this);


  render() {
    let {languages, attachedUser , item , redirectToMain, page:{ id }} = this.state;

    if(redirectToMain) {
      return(<Redirect to={'/admin/users'} />) 
    }

    return (
      <div className="f f-col outer admin">
        <Header currentRole={this.props.currentRole}/>
        <div className="f h100" ref={n => this.boundRef("bg")(n)}>
          <div className={`f f-align-2-2 outer-left__narrowed`}>
            {/* Starts Left SubMenu */}
            <div className="f sidebar sidebar__menu"> 
              <ul className="f f-align-1-1 f-col admin-menu">
                <NavLink
                  className={"f f-align-1-2 admin-menu__item admin-menu__item__level-1"}
                  to={{
                    pathname: Routes["users"].path,
                    state: { pageType: "users" }
                  }}
                >
                  <span className={"f f-align-2-2 admin-menu__item__icon"}><img src={users} alt='user' /></span>
                  <span>Пользователи</span>
                </NavLink>
                <div className="admin-menu__delimiter" />
                <NavLink
                  className={"f f-align-1-2 admin-menu__item admin-menu__item__level-1"}
                  to={{
                    pathname: Routes["appeals"].path,
                    state: { pageType: "appeals"}
                  }}
                >
                  <span className={"f f-align-2-2 admin-menu__item__icon"}><img src={appeals} alt={"appeals"}/></span>
                  <span>Запросы</span>
                </NavLink>
                <div className="admin-menu__delimiter" />
              </ul>
               {/* Ends Left SubMenu */}
            </div>
          </div>

          {/*  Left Expanded Area  */}
          <Route
            path={Routes["user"].path}
            render={() => (
              <div ref={n => (this.secondScreen = n)} className="f f-align-2-2 f-col outer-left__expanded">
                <SideList
                  route={`${Routes["user"].path}/${id}`}
                  page={this.state.page}
                  languages={languages}
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
                className={`f outer-main__full`}
              >
                <div className="main f f-col f-align-1-2">
                  <Switch>
                    <RoutePassProps
                      exact
                      redirect={Routes["users"].path}
                      path={Routes["root"].path}
                      component={Users}
                      _self={this}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["users"].path}
                      component={Users}
                      _self={this}
                      page={this.state.page}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["appeals"].path}
                      component={Users}
                      _self={this}
                      page={this.state.page}
                    />
                    <RoutePassProps 
                      path={`${Routes["user"].path}${Routes["user"].param}/pending${Routes["history"].param}`}
                      component={Pending} 
                      typePage={this.state.page.pageType} 
                      id={this.state.page.historyId} 
                      usedId={this.state.page.id} 
                      languages={languages}
                    />
                    <RoutePassProps
                      path={`${Routes["user"].path}${Routes["user"].param}/history${Routes["history"].param}`}
                      component={UserFullHistory}
                      page={this.state.page}
                      _self={this}
                      languages={languages}
                      attachedUser={attachedUser}
                    /> 
                    <RoutePassProps
                      path={`${Routes["appeal"].path}${Routes["appeal"].param}`}
                      component = {Appeal}
                      page = {this.state.page}
                      _self={this}
                      appeal={item}
                    />
                  </Switch>
                </div>
              </div>
            )}
          />
         {/* Ends Main Area  */}
        </div>
      </div>
    );
  }
}


class SideList extends React.PureComponent{
  constructor(p){
    super(p);
    let {page: {id}} = this.props;
    this.userId = id;
    this.updateHandler = this.updateHandler.bind(this);
    this._isMounted =  false;
    this.historyStore = null;
    this.languageStore = null;
  }
  
  state = {
    user: null,
    pendingTabs: [],
    workingTabs: [],
    historyTabs: [],
    languages: this.props.languages
  }

  componentDidMount(){
    this._isMounted = true;
    this.historyStore = new UserStore('user', this.userId);
    this.historyStore.start();
    this.historyStore.addListener('updateRooms', this.updateHandler);
  }

  componentWillReceiveProps({languages}){
    if(!this._isMounted) return
    if(this.state.languages !== languages)
      this.setState({languages})
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.historyStore.stop();
    this.historyStore.removeListener('updateRooms', this.updateHandler);
    this.historyStore = null;
  }

  async updateHandler(data){
    if(!this._isMounted) return
    this.setState({...data});
  } 

  getLangPropInObj({id,slug}){
    return this.state.languages && this.state.languages.length > 0 ? this.state.languages.find(o => o.id === id)[slug] : 0
  }

  render(){
    let {page: {pageType, id, historyId}} = this.props;
    let {user, pendingTabs, workingTabs, historyTabs} = this.state;
    let route = `/admin/${pageType}/${id}`;
    let activeTab = historyId;
    if(!user){
      return(<div className="f sidebar">
              <div className="admin-user-details">
                  <div className="admin-user-details__topArea">
                    <figure className="f f-align-2-2 admin-user-details__avatar">
                      <img src={(user && user.image) || avatar} alt="Textra" />
                    </figure>
                    <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                      <div className="admin-user-details__personalInfo__title">Загрузка</div>
                      <div className="admin-user-details__personalInfo__email"></div>
                    </div>
                  </div>
                  <div className="admin-user-details__delimiter"></div>
              </div>
          </div>
    )}

    let registrationTime = new Date(user.registrationTime);
    return(<ScrollRestortion scrollId={`admin-${id}`} className="f sidebar">
        <div className="admin-user-details">
            <div className="admin-user-details__topArea"> 
              <figure className="f f-align-2-2 admin-user-details__avatar">
                <img src={user.image || avatar} alt={user.nickname} />
              </figure>
              <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                <div className="admin-user-details__personalInfo__title">{user.nickname} </div>
                <div className="admin-user-details__personalInfo__email">{user.email}</div>
                <div className={`admin-user-details__personalInfo__type admin-user-details__personalInfo__type${String.prototype.toUpperCase.call(user.type)}`}>
                  {findIcon(Roles, user.type, 'text')}
                </div>
              </div>
            </div>
            <div className="admin-user-details__delimiter"></div>
            <div className="admin-user-details__serviceInfo">
              <div className="f f-align-13-2 admin-user-details__serviceInfo__regData"><span>Дата регистрации:</span>
                  <data>{registrationTime.getDate()}.{registrationTime.getMonth()}.{registrationTime.getFullYear()}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__spendTime"><span>Общее время переводов:</span><data>{humanReadableTime(user.totalTime)}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__amountSymble"><span>Кол-во символов перевода:</span><data>{user.amountLetters}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__balance"><span>Баланс:</span><data>{user.role === "3" ?  `${(user.balance/100).toFixed(2)}₴` : `${(user.earnBalance/100).toFixed(2)}₴`}</data></div>
            </div>  
        </div>
       {/* PENDINGS TABs */} 
        { pendingTabs.map(tab => {
          return (
            <Link key={getUniqueKey()} to={{pathname: `${route}/pending/${tab.id}`, state:{pageType: 'user', id: user.uuid, historyId: tab.source_messages.length > 0 &&  tab.source_messages[tab.source_messages.length-1].id}}} className={`f f-align-1-2 dashboard-user__tab ${tab.id === activeTab ? 'selected' : ''}`} >
              <figure className="f f-align-2-2 dashboard-user__tab-avatar"> <img src={tab.user && tab.user.image ||avatar } alt="Textra" /> </figure>
              <div className="f f-col f-align-1-1 dashboard-user__tab-details">
                <div className="dashboard-user__tab-title" title={tab.translator && `Ожидание переводчика ${tab.translator.first_name} ${tab.translator.last_name}`} 
                > 
                {tab.translator? `Ожидание переводчика ${tab.translator.first_name} ${tab.translator.last_name}`: 'Поиск переводчика'} 
                </div>
                <div className="dashboard-user__tab-content" title={`${tab.source_messages.length > 0 &&tab.source_messages[0].content}`}> {tab.source_messages.length > 0 &&  tab.source_messages[0].content}</div>
              </div>
              <div className="f f-col f-align-2-3 dashboard-user__tab-info">
              </div>
            </Link>
          )
        })}
        {/* INWORK TABs */}
        { workingTabs.map(tab => {
          let publishTime = new Date(tab.created_at);
          let outputPublishTime = getTabTime(publishTime);
          let attachedUser = tab.translator || tab.user; 

          return (
            <Link key={getUniqueKey()} to={{pathname: `${route}/pending/${tab.id}`, state:{pageType: 'user', id: user.uuid, historyId: tab.source_messages.length > 0 &&  tab.source_messages[tab.source_messages.length-1].id}}} className={`f f-align-1-2 dashboard-user__tab ${tab.id === activeTab ? 'selected' : ''}`} >
              <figure className="f f-align-2-2 dashboard-user__tab-avatar"> <img src={attachedUser && attachedUser.image||avatar} alt="Textra" /> </figure>
              <div className="f f-col f-align-1-1 dashboard-user__tab-details">
                <div className="dashboard-user__tab-title">{ attachedUser.first_name + ' ' + attachedUser.last_name}</div>
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
                  <LangLabel from={this.getLangPropInObj({id:tab.source_language_id, slug:'code'})} to={this.getLangPropInObj({id:tab.translate_language_id, slug: 'code'})} selected={tab.id === activeTab} />
                <div className="dashboard-user__tab-info__money">{(tab.price/100).toFixed(2)}₴</div>
              </div>
            </Link>
          )
        })}
        
         {/* delimiter */}
        <TabDelimiter title={'История'}/>

        {/* History TABs */}
        {historyTabs.map((tab, index) => {
          let attachedUser = tab.translator || tab.user;
          Object.assign(attachedUser, {role: tab.user  ? 'translator' : 'user'});
          let finishTime = new Date(tab.translated_at);
          let outputPublishTime = getTabTime(finishTime);
          let start = new Date(tab['started_at']);
          let durationShouldBe = tab.translate_messages[tab.translate_messages.length-1]['letters_count'] * this.getLangPropInObj({id:tab.translate_language_id, slug:'letter_time'})
          let finishShouldBe = new Date(+start + durationShouldBe*1000);
          let duration = (finishTime - start)/1000;
          return (
            <Link key={getUniqueKey()} to={{pathname: `${route}/history/${attachedUser.id}`, state:{pageType: 'user', id: user.uuid, historyId: attachedUser.id, attachedUser: attachedUser}}}  className={`f f-align-1-2 dashboard-user__tab dashboard-user__tab__history ${attachedUser.id === activeTab ? 'selected' : ''}`} >
              <figure className="f f-align-2-2 dashboard-user__tab-avatar"> <img src={attachedUser.image || avatar} alt="Textra" /> </figure>
              <div className="f f-col f-align-1-1 dashboard-user__tab-details">
                <div className="dashboard-user__tab-title"> {attachedUser.first_name + ' ' +
                attachedUser.last_name} </div>
                <div className="dashboard-user__tab-content"> {tab.translate_messages.length > 0 &&  tab.translate_messages[tab.translate_messages.length - 1].content}</div>
              </div>
              <div className="f f-col f-align-2-3 dashboard-user__tab-info">
                <div className="dashboard-user__tab-info__time">
                  {  /* <Timer start={start} duration={duration} finish={finishShouldBe}/> */ }
                  <time>{`${outputPublishTime}`}</time>
                </div>
                <LangLabel from={this.getLangPropInObj({id:tab.source_language_id, slug:'code'})} to={this.getLangPropInObj({id:tab.translate_language_id, slug: 'code'})} selected={tab.id === activeTab} />
                <div className="dashboard-user__tab-info__money">{(tab.price/100)}₴</div>
              </div>
            </Link>
          )
        })}
    </ScrollRestortion>
  )}
};

const RoutePassProps = ({ component: Component, redirect, ...rest }) =>
  (!redirect
    ? <Route {...rest} render={props => <Component {...props} {...rest} />} />
    : <Redirect to={`${redirect}`} />);


// Means Table with users data
class Users extends React.Component {

  constructor(p){
    super(p);
    this.store = null;
    this._isMounted = false;
    this.changeTypeOfUser = this.changeTypeOfUser.bind(this)
    this.changeUserStatus = this.changeUserStatus.bind(this)
    this.sortMe = this.sortMe.bind(this)
    this.changeFilter = this.changeFilter.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.rememberLastValue = this.rememberLastValue.bind(this)
    this.updateHandler = this.updateHandler.bind(this)
    this.requestUpdateHandler = this.requestUpdateHandler.bind(this)
    this.lastDropDownOpenedValue = undefined;

    
  }

  state = {
    loading: {
      is: false,
      uuid: undefined
    },
    deleting:{
      is: false,
      uuid: undefined
    },
    sorting:{
      columnNameToSort: undefined,
      columnSortDirection: 'descending'
    },
    filter:{
      text: 'Все',
      value: 'a'
    },
    search: {
      value: ''
    },
    usersList: null,
    usersListFetched: null,
    usedRoles: [],
    page: this.props.page
  }

  componentWillMount(){
    if(typeof window !== 'undefined'){
      if(this.state.page.pageType === 'users'){ // 
        let usersAdminListCached =  JSON.parse(window.sessionStorage.getItem('userList'));
        usersAdminListCached &&  this.setState({usersList: usersAdminListCached, usersListFetched: usersAdminListCached})
      }else{ // for user's appeals 
        let usersAdminListCached =  JSON.parse(window.sessionStorage.getItem('userRequest'));
        usersAdminListCached &&  this.setState({usersList: usersAdminListCached, usersListFetched: usersAdminListCached})
      }
    }
  }
  
  componentDidMount(){
    this._isMounted = true;
    let {page: {pageType, id}} = this.props;

    if(this.state.page.pageType === 'users'){
       TxRest.getData('user').then(this.updateHandler)
    }else{ // for user's appeals 
       TxRest.getData('request').then(this.requestUpdateHandler)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if(typeof window !== 'undefined'){
      if(this.state.page.pageType === 'users'){
         window.sessionStorage.setItem('userList', JSON.stringify(this.state.usersListFetched));
      }else{ // for user's appeals 
        window.sessionStorage.setItem('userRequest', JSON.stringify(this.state.usersListFetched));
      }
    }
  }

  requestUpdateHandler(data){
    if(!this._isMounted) return
    if(data.message){// todo: handle errror
      console.error(data.message)
      this.setState({usersList: [], usersListFetched: []})
      return
    }
    let usersList = data.map(item => {
      return {
        nickname: item.user ? item.user.first_name + ' ' + item.user.last_name : 'Unregistered', 
        uuid: item.id,
        email: item.user ? item.user.email : item.email, 
        type: APPEALS(item.type), 
        registrationTime: item.created_at,
        status: 0,
        publishTime: item.created_at,
        content: item.message
      }
    });

    this.setState({usersList, usersListFetched: usersList})
    this.setUsedRoled();
  }

  updateHandler(data){
    if(!this._isMounted) return
    if(data.message){ // todo: handle errror
      console.error(data.message)
      this.setState({usersList: [], usersListFetched: []})
      return
    }
    let usersList = data.map(item => {
      return {
        nickname: item.first_name + ' ' + item.last_name, 
        uuid: item.id,
        email: item.email,
        type: ROLES(item.role),
        registrationTime: item.created_at,
        status: item.status,
        role: item.role
      }
    });

    this.setState({usersList, usersListFetched: usersList})
    this.setUsedRoled();
    //let _self = this;
    // if( data.list[0] === null ) {
    //   Promise.all(data.ids.map(id => TxRest.getDataByID(this.props.page.pageType.slice(0, -1), id)))
    //         .then((list) => {
    //             list.map((item, index) => _self.store.itemUpdated(item.value, index))
    //             let {list: usersList , ids} = _self.store.getState();
    //             _self.setUsedRoled(usersList);
    //             _self.setState({usersList: usersList, usersListFetched: usersList})})
    // }else{
    //     _self.setUsedRoled(data.list);
    //     _self.setState({usersList: data.list, usersListFetched: data.list})
    //     Promise.all(data.ids.map(id => TxRest.getDataByID(this.props.page.pageType.slice(0, -1), id)))
    //         .then(async list => { await sleep(10000); return Promise.resolve(list)})
    //         .then((list) => {
    //             if(!this._isMounted) return
    //             list.map((item, index) => _self.store.itemUpdated(item.value, index))
    //             let {list: usersList , ids} = _self.store.getState();
    //             _self.setUsedRoled(usersList);
    //             _self.setState({usersList: usersList, usersListFetched: usersList})})
    // }
  }

  setUsedRoled(cb){
    let usedRoles = [],
        roles = [];
    if(this.state.page.pageType === 'users'){
      usedRoles = ['u','c','d', 't'];
    }else{
      usedRoles = ['p', 'g', 'o'];
    }   
    roles = Roles.filter(o => usedRoles.some(r => r === o.value));
    this.setState({
      usedRoles: roles
    },() =>{
      if(typeof cb === 'function'){
        cb();
      }
    })
  }

  changeUsersList(uuid, value){
    let self = this;
    let inx
    self.state.usersList.find((o,i) => {if(o.uuid == uuid) inx = i});
     return new Promise(r => {
       this.setState(Object.assign(self.state.usersList[inx], {type: value}),r)
     })
  }

  sortCollection({columnNameToSort, columnSortDirection}){
    const _self = this
    return new Promise(r => {
      console.time('sort');
      let sortedList = quickSort(Object.assign([], _self.state.usersList), null, null, columnNameToSort, (val1, val2, pos, item) => {
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
      console.timeEnd('sort');
      // sortedList = sortedList.reduce((acum, val, idx) => {
      //   acum[val['uuid']] = val;
      //   return acum;
      // }, {})

      if (columnSortDirection == 'ascending'){
        sortedList = sortedList.reverse();
      }

      _self.setState(Object.assign({}, _self.state, {usersList:sortedList}),r);
    });

  }



  rememberLastValue(_, {value}){ this.lastDropDownOpenedValue = value }

  changeTypeOfUser(uuid, _ , {value}){
    let _self = this;
    let searchValue = this.state.search.value;
    if( this.lastDropDownOpenedValue == value) // do nothing if nothing has changed
      return 

    this.setState(Object.assign({},this.state,{
      loading:{
        is: true,
        uuid
      }
    }))

    return TxRest.getDataByID(`user/${uuid}/role`,{"role": GETINITIALROLE(value)})
                  .then( data => {
                    if(data.message) return
                    let inx
                    _self.state.usersList.find((o,i) => {if(o.uuid == uuid) inx = i});
                    return new Promise(r => {
                      this.setState(Object.assign(_self.state.usersList[inx], {type: value}),r)
                    })
                  }).then(_ => {  
                    return new Promise(r => {
                        if(this.state.filter.value === 'a'){
                          _self.setState({
                            usersList: _self.state.usersListFetched.filter(o => o['nickname'].includes(searchValue))
                          },r)
                          return
                        }
                        _self.setState({
                          usersList: _self.state.usersListFetched.filter(o => o['nickname'].includes(searchValue) &&  o['type'] === _self.state.filter.value)
                        },r)
                      });
                  }).then(_ => {
                    this.setState(Object.assign({},this.state,{
                      loading:{
                        is: false,
                        uuid: undefined
                      }
                    }))
                  })
  }

  changeUserStatus (uuid, _, {checked}){
    let _self = this;
    this.setState(Object.assign({}, this.state, {
      deleting:{
        is: true,
        uuid
      }
    }))
    let newStatus = (checked) ? "2" : "0";
      
    return TxRest.getDataByID(`user/${uuid}/status`, {"status": newStatus})
              .then(data => {
                if(!_self._isMounted) return 
                this.setState(Object.assign(this.state,{
                  deleting:{
                    is: false,
                    uuid: undefined
                  }
                }))
                if(data.message) return
                _self.state.usersListFetched.filter(o => o.uuid === uuid)[0]['status'] = data.status
                let ItemToChange = _self.state.usersList.filter(o => o.uuid === uuid);
                ItemToChange[0]['status'] = data.status
                this.forceUpdate();
              })
  }

  deleteUser (uuid){
    let _self = this;
    this.setState(Object.assign({}, this.state,{
      deleting:{
        is: true,
        uuid
      }
    }))

    return TxRest.deleteData(`request/${uuid}`)
              .then( _ => {
                let inx, inx2;
                _self.state.usersList.find((o,i) => {if(o.uuid == uuid) inx = i});
                _self.state.usersListFetched.find((o,i) => {if(o.uuid == uuid) inx2 = i});

                return new Promise(r => {
                    let list = Object.assign([], this.state.usersList);
                    list.splice(inx,1);
                    _self.state.usersListFetched.splice(inx2,1);
                    this.setState(Object.assign(_self.state.usersList, {usersList:list}),r);
                  })
  
              }).then(_ => {
                this.setState(Object.assign(this.state,{
                  deleting:{
                    is: false,
                    uuid: undefined
                  }
                }))
              })
  }

  sortMe  = (columnNameToSort) => () => {
    let self = this;

    if(columnNameToSort == self.state.sorting.columnNameToSort){
      self.setState(Object.assign(self.state.sorting, {
        columnSortDirection: self.state.sorting.columnSortDirection === 'ascending' ? 'descending' : 'ascending'
      }), () => {
         self.sortCollection({
          columnNameToSort,
          columnSortDirection: self.state.sorting.columnSortDirection
        })
      })
      return
    }

    self.setState(Object.assign({},self.state,{
      sorting:{
        columnNameToSort,
        columnSortDirection: 'descending'
      }
    }), () => {
      self.sortCollection({
        columnNameToSort,
        columnSortDirection: 'descending'
      })
    })
  }

  changeFilter(_ , {options, value}){
    let _self = this,
        text = options.find(o => o.value === value)['text'];
    let filter = 'type';
    _self.setState(Object.assign({},_self.state,{
      filter:{
        text,
        value
      }
    }), () => {
      new Promise(r => {
        if(value === 'a'){
          _self.setState({usersList: _self.state.usersListFetched},r);
          return
        }
        _self.setState({
          usersList: _self.state.usersListFetched.filter(o => o['type'] === value)
        },r)
     });
    })
  }

  changeSearch(_ , {value}){
    let _self = this;
    _self.setState(Object.assign({}, ..._self.state, {
      search:{
        value
      }
    }), () => {
      Promise.resolve().then( _ => {
            return new Promise(r => {
              if(_self.state.filter.value === 'a'){
                _self.setState({
                  usersList: _self.state.usersListFetched.filter(o => o['nickname'].includes(value))
                },r)
                return
              }
              _self.setState({
                usersList: _self.state.usersListFetched.filter(o => o['nickname'].includes(value) &&  o['type'] === _self.state.filter.value)
              },r)
            });
          })
    })
  }

  render() {
  
    let {location: { pathname }, page: {pageType} } = this.props;
    let {loading, deleting, sorting:{columnNameToSort, columnSortDirection}, filter:{text}, search, usedRoles: roles} = this.state;
    let currentDate = this.state.usersList;
    let self = this;
    //hide admin from constollers
    if(Auth.role !== 'admin'){
      let idx;
      currentDate && currentDate.map((o, i) => { if(o.role === '0') idx = i; })
      if(idx) currentDate.splice(idx, 1);
    }

    if(currentDate === null){
      return(<div>
              <div className="f f-align-1-2 admin-list__topbar">
                <div className="admin-list__filter"></div>
                <Input icon='search' iconPosition='left' className='admin-list__search' value={!!search.value ? search.value : '' } onChange={self.changeSearch} />
              </div>
              <Table color={'blue'} compact fixed celled sortable={true} style={{ width: '90%', minWidth:'959px', marginLeft: 'auto', marginRight: 'auto'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={ columnNameToSort === 'nickname' ? columnSortDirection : null} onClick={this.sortMe('nickname')}>Name</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'email' ? columnSortDirection : null} onClick={this.sortMe('email')} >E-mail address</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'type' ? columnSortDirection : null} onClick={this.sortMe('type')}>User Type</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'registrationTime' ? columnSortDirection : null} onClick={this.sortMe('registrationTime')}>Registration Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center' >Status/Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className={"f f-align-2-33 admin-list "} textAlign='center'>
                    <Table.Cell >Загрузка</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
        </div>)
    }

    return  (<div>
              <div className="f f-align-1-2 admin-list__topbar">
                <Dropdown text={`${text}`} options={Object.assign([],roles,[{ 
                  text: 'Все',
                  value: 'a'
                  },...roles.map(o => {return { text: o.text, value: o.value }})])} 
                  icon='filter'
                  floating
                  labeled
                  button
                  header={ <Dropdown.Header icon='tags' content='Фильтр по ролям' /> }
                  className='icon admin-list__filter'
                  onChange={self.changeFilter}/>
                <Input icon='search' iconPosition='left' className='admin-list__search' value={!!search.value ? search.value : '' } onChange={self.changeSearch} />
              </div>
              <Table color={'blue'} compact fixed celled sortable={true} style={{ width: '90%', minWidth:'959px', margin: '50px auto 100px'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={ columnNameToSort === 'nickname' ? columnSortDirection : null} onClick={this.sortMe('nickname')}>Name</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'email' ? columnSortDirection : null} onClick={this.sortMe('email')} >E-mail address</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'type' ? columnSortDirection : null} onClick={this.sortMe('type')}>User Type</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'registrationTime' ? columnSortDirection : null} onClick={this.sortMe('registrationTime')}>Registration Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center' sorted={ columnNameToSort === 'status' ? columnSortDirection : null}  onClick={this.sortMe('status')}>Status/Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { Array.isArray(currentDate) && currentDate.length === 0 ?
                <Table.Row className={"f f-align-2-33 admin-list "} textAlign='center'>
                    <Table.Cell >Пользователи отсутствуют</Table.Cell>
                </Table.Row>
                :
                Array.isArray(currentDate) && currentDate.map(({nickname, uuid, email, type, registrationTime, status, role}, index) => (
                  <Table.Row key={index} >
                    <Table.Cell ><Link to={{
                        pathname: `/admin/${pageType.toLowerCase().slice(0,pageType.length - 1)}/${uuid}`,
                        state: {pageType: pageType.toLowerCase().slice(0,pageType.length - 1), id: uuid, item: currentDate[index] }
                        }}>
                        {nickname}
                      </Link></Table.Cell>
                    <Table.Cell  {...(status === "2" && {'disabled':true})}>{email}</Table.Cell>
                    <Table.Cell  {...((status === "2" || Auth.role !== "admin") && {'disabled':true})} style={{overflow: 'visible'}}> {!!roles.length && <Icon {...findIcon(roles, type)} />}
                     {  pageType ===  'users' ?
                       <Dropdown inline 
                      {...(loading.is && loading.uuid === uuid && {loading:true})} 
                      {...(loading.is && {disabled:true})} options={roles.map(o => {return { text: o.text, value: o.value }})} value={type}
                      onChange={this.changeTypeOfUser.bind(self, uuid)}
                      onOpen={this.rememberLastValue}/>
                      : findIcon(Roles, type, 'text')
                     }
                    </Table.Cell>
                    <Table.Cell  {...(status === "2" && {'disabled':true})} >{new Date(registrationTime).toDateString()} {new Date(registrationTime).getHours()}:{new Date(registrationTime).getMinutes()}</Table.Cell>
                   <Table.Cell className="f f-align-2-2">
                      {/*  checkbox for block/unblock user */}
                      {pageType === 'users' && 
                      <Checkbox toggle {...((deleting.is || role === '0') && {'disabled':true})} onClick={debounce(this.changeUserStatus.bind(self,uuid),200,false)} checked={status === "0"}/>}
                       {/*  delete for  user's request */}
                      {pageType === 'appeals' && 
                      <button {...(deleting.is && {'disabled':true})}  onClick={debounce(this.deleteUser.bind(self,uuid),200,false)} className="admin-list__delbtn btn btn-block btn-flat btn-normal f f-align-2-2"><img src={deleteIcon} alt="icon"/></button>}

                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        </div>)
  }
}


class UserFullHistory extends React.Component {
  constructor(props){
    super(props);
    this.massageStore = null;
    this.attachedUser = props.attachedUser;
    this.languages = props.languages;
    this.updateHandler = this.updateHandler.bind(this);
    this._isMounted = false;
  }

  state = {
    list: null,
    attachedUser: null,
    languages: []
  }

  componentWillMount(){
    this.setState({list: MessageStore.getMessages('user', this.userId), attachedUser: this.attachedUser})
  }


  componentDidMount(){
    this._isMounted = true;
    let {pageType, id, historyId} = this.props.page;

    if(this.attachedUser){
      var userId = this.attachedUser && this.attachedUser['role'] === 'translator' ? historyId : id;
      var translatorId = this.attachedUser && this.attachedUser['role'] === 'translator' ? id : historyId ;
    }else{
      var userId = historyId;
      var translatorId = id;
    }
    // we should do this mess, coz the request to server  
    this.massageStore = new MessageStore(`translated-topic/user/${userId}/translator`, translatorId );
    this.massageStore.start();
    this.massageStore.addListener('updateMessage', this.updateHandler)
  }


  updateHandler(list){
    if(!this._isMounted) return    
    if(list !== null){
      this.setState(list)
    }else{
      console.log('iis')
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.massageStore.removeListener('updateMessage', this.updateHandler);
    this.massageStore = null;
  }

  getLangPropInObj({id,slug}){
    return this.state.languages && this.state.languages.length > 0 ? this.state.languages.find(o => o.id === id)[slug] : 0
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  } 

  componentWillReceiveProps({languages}){
    if(this.state.languages !== languages){
      this.setState({languages})
    }
  }


  render() {
    let { list, attachedUser } = this.state || {list: []},
      _self = this; 

    this.lastCreatedDate = null;
    if (!list.length)
      return(<div/>)
    list = list.reverse();
    

    // based on info stored at sidebar
    this.userInfo = UserStore.getUser(this.props.page.id);
    
    // fix avatar, coz the attached user is always not beyong to page but for the cases we have the possition is different.
    if(this.attachedUser){
      var avatar1 = this.attachedUser && this.attachedUser['role'] === 'translator' ? this.attachedUser : this.userInfo;
      var avatar2 = this.attachedUser && this.attachedUser['role'] !== 'translator' ? this.attachedUser : this.userInfo ;
    }


    const renderCollection = renderItem => (
      <ScrollRestortion scrollId={`history-${this.props.id}-${this.props.historyId}`} scrollToEndByDefault={true} className={'f f-col dashboard-user__history'} >
        
        {/* ALl merged history */}

        {list.map((item, idx) => renderItem(item, idx))}
        

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
              <img src={(avatar1 && avatar1.image ) || avatar} alt={(avatar1 && avatar1.first_name)} />
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
              <img src={(avatar2 && avatar2.image) || avatar} alt={(avatar2 && avatar2.nickname)} />
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


class Appeal extends React.Component {

  constructor(props){
    super(props);
    this._isMounted = false;
    }

  state = {
    appeal: null
  }

  componentWillMount(){
    let {page:{ id }, appeal} = this.props;
    this.setState({appeal})
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  render() {
    let { _self  } = this.props;

    let { appeal } = this.state;

    let list= [appeal];
    if(!list.length){
      return(
        <div/>
      )

    }
    const RenderCollection = renderItem => {
      return (
        <div>
          {Object.values(list).map((data, index) => {
            let publishTime = new Date(data.publishTime);
            return renderItem(data, index, publishTime);
          })}
        </div>
      );
    };
    return (Object.entries(list).length === 0
            ? <div className={"f f-align-2-33 admin-appeal u-mx-3 u-my-2"}>
                <div className={"admin-feed__avatar"}>
                    <img src={avatar} />
                </div>
                <div className={"f f-align-2-2 admin-appeal__placeholder"}>
                    <span>Запрос отсутствует</span>
                </div>
              </div>
            : RenderCollection((currentDate, index, publishTime) => (
              <div key={getUniqueKey()}>
                <div className={"data__delimiter admin-history-data__delimiter "}>{publishTime.getDate()}{" "}{getMonthName(publishTime.getMonth())},{" "}{publishTime.getFullYear()}{" "}</div>
                <div key={index} className={"f f-row f-align-13-1 admin-history"}>
                    <div className={"f f-align-1-1 f-col f-gap-2 admin-history-post "}>
                      <div className="admin-user-details__topArea">
                        <figure className="f f-align-2-2 admin-user-details__avatar">
                          <img src={avatar} alt={currentDate.nickname} />
                        </figure>
                        <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                          <div className="admin-user-details__personalInfo__title">{currentDate.nickname} </div>
                          <div className="admin-user-details__personalInfo__email">{currentDate.email}</div>
                          <div className={`admin-user-details__personalInfo__type admin-user-details__personalInfo__type${String.prototype.toUpperCase.call(currentDate.type)}`}>
                            {findIcon(Roles, currentDate.type, 'text')}
                          </div>
                        </div>
                      </div>
                      <div className={"admin-history-post__content"}>
                          <p className={"admin-history-post__content__text"}>{currentDate.content}</p>
                      </div>
                    </div>
                    <div className={"admin-history-post__date"}>
                        {publishTime.getHours()}:{getFullTimeDigits(publishTime.getMinutes())}
                    </div>
                  </div>
                </div>
                ))
    );
  }
}

class Pending extends React.Component {
  constructor(p){
    super(p);
    this.store = this.props.store;
    this.id = this.props.id;
    this.userId = this.props.usedId;
    this._isMounted = false;
  }

  state = {
    currentData: null,
    languages:  this.props.languages,
    index: this.props.index,
    stale: false
  }

  componentDidMount(){
    this._isMounted = true;
    let _self = this;
    
    let currentDataFromStore = UserStore.getItem(this.userId, this.id);
    if( currentDataFromStore ) this.setState({currentData : currentDataFromStore})
    TxRest.getData(`topic/${this.id}`).then((data) => {
        if(data.message || !this._isMounted) return;
        if(_self.state.currentData)
          data =  Object.assign({}, _self.state.currentData, data, _self.state.currentData.index );
        _self.setState({ currentData: data, stale : data.status === '2' });
        _self.store && _self.store.itemUpdated(data, _self.state.index);
    })
  }

  componentWillReceiveProps({store, languages, id}){
    this.store = store;
    if(id !== this.id){
      this.id = id;
      console.log('ckeck why id was changed')
    }
    if(this.state.languages !== languages)
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
    let { currentData } = this.state,
      created_at = null;
    
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
    return (
        <div className={'f f-col f-align-1-1 dashboard-user__searching'}>
            {currentData.created_at && <div className={'data__delimiter'}>{created_at.getDate()} {getMonthName(created_at.getMonth())}, {created_at.getFullYear()} </div>}
            <div className={'f f-align-1-11 f-gap-2 dashboard-user__searching-post '}>
              <div className={'dashboard-user__searching-post__avatar'}>
                <img src={currentData.user && currentData.user.image || avatar } />
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
                {currentData.source_messages && currentData.source_messages.length > 0 &&
                  <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(duration)} hint={'Длительность перевода'} /> }
                {currentData.updated_at && currentData.status === '1' &&
                  <Batch
                    flushCount={0}
                    flushInterval={150}
                    count={1}
                    debug={false}
                    render={() => {
                      let value = ~~Math.abs(duration - (new Date - new Date(currentData.updated_at)) / 1000);
                      //console.log(value)
                      return(<Indicator
                        className={'f f-align-2-2'}
                        icon={
                          <Timer
                            start={currentData.updated_at}
                            duration={duration}
                            isBig={true} />}
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
              </div>
              {created_at && <div className={'dashboard-user__searching-post__date'}>
                {created_at.getHours()}:{getFullTimeDigits(created_at.getMinutes())}
              </div>}
            </div>
          </div>
    )
  }
}

export default withRouter(Admin);
