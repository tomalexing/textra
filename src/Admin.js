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
import users from "./assets/users.svg";
import appeals from "./assets/appeals.svg";
import deleteIcon from './assets/delete.svg';

import "./polyfill";
import { Auth } from "./index";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
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
  getMounthName,
  getFullMinutes,
  dump,
  quickSort
} from "./utils";

import Batch from "./components/Batch";

import Header, { NavLink } from "./components/Header";

import Test from "./Test";
import Timer from "./components/Timer";
import LangLabel from "./components/LangLabel";
import StatefulEditor from "./components/StatefulEditor";
import Indicator from "./components/Indicator";
import deepEqual from 'deep-equal';

import { Button, Checkbox, Icon, Table, Dropdown, Input } from 'semantic-ui-react'

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
    text: 'Жалоба',
    value: 'g', // grumble
    icon: { name: 'circle', color: 'red', size: 'small' },
  }, 
   {
    text: 'Другое',
    value: 'o', // other
    icon: { name: 'circle', color: 'grey', size: 'small' },
  }, 
];

const findIcon = (objs, id, prop = 'icon') => Object.values(objs).find(o => o.value == id)[prop];


    // Types of user :
    // u - user
    // c - controller
    // t - translater
    // p - possibility
    // a - appeal
    // o - other

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
    this.store = null;
    this._isMounted = false;
    this.list = this.list.bind(this);
    this.renders = 0;

    this.boundRef = this.boundRef.bind(this);
  }

  state = {
    redirectToReferrer: false,
    items: [],
    mainScreen: true,
    secondScreen: false,
    sidebar: false,
    page:{
      pageType: 'users',
      id: undefined,
      historyId: undefined
    }
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
    let activeTabA = pathname.split("/");
    let _self = this;
    await this.setState({
      page:{
        pageType: RouterState ? RouterState.pageType : 'users',
        id: RouterState ? RouterState.id : undefined ,
        historyId: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 1] : undefined,
      }
    })
  }

  componentDidMount(){
    this._isMounted = true;
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
  
  componentWillReceiveProps(nextProps){
    let { location: { pathname, state: {pageType} } } = nextProps;
    let activeTabA = pathname.split("/");
    let _self = this;
    this.setState({
      page:{
        pageType: pageType ? pageType : 'users',
        id: /history/.test(pathname) ? pathname.split("/").filter(el => el !== '').splice(-3)[0] : pathname.split("/").filter(el => el !== '').splice(-1)[0],
        historyId: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 1] : undefined,
      }
    })

  }

  componentWillReceiveProps(props) {
    const { mainScreen, secondScreen } = this.props.location.state || {
      mainScreen: true,
      secondScreen: false
    };
    this.setState({ mainScreen, secondScreen });
  }
  
  componentWillUpdate(nextProps, nextState){
    let { location: { pathname, state: RouterState } } = this.props;
    let activeTabA = pathname.split("/");
    let _self = this;
    this.setState({
      page:{
        pageType: RouterState ? RouterState.pageType : 'users',
        id: RouterState ? RouterState.id : undefined ,
        historyId: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 1] : undefined,
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listeners.forEach(removeEventListener => removeEventListener());
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

 

  list() {
    const { items } = this.state;

    return (
      <div>
        <p>Count: {items.length}</p>
        <p>Renders: {this.renders++}</p>
        <ul>
          {items.map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      </div>
    );
  }

  boundRef = place => (n => (this[place] = n)).bind(this);


  render() {


    const find = (objs, id) => Object.values(objs).find(o => o.uuid == id);
    let {usersList, usersListFetched, page:{pageType, id, historyId}, usedRoles} = this.state;
    let currentDate, user, allUsers = false;

    switch(pageType){
    case('user'):
      user = Store.getItem(this.state.page.id)
      break;
    }

    let { sidebar, secondScreen, mainScreen } = this.state;

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
                  <span className={"f f-align-2-2 admin-menu__item__icon"}><img src={users} /></span>
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
                  <span className={"f f-align-2-2 admin-menu__item__icon"}><img src={appeals} /></span>
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
                  user={user}
                  route={`${Routes["user"].path}/${id}`}
                  page={this.state.page}
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
                style={{background: `${allUsers ? "#f5f5f5": "#fff"}`}}
                className={`f outer-main__full`}
                ref={n => (this.toggleElem = n)}
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
                      path={`${Routes["user"].path}${Routes["user"].param}/history${Routes["history"].param}`}
                      component={UserAccount}
                      page={this.state.page}
                      _self={this}
                    /> 
                    <RoutePassProps
                      path={`${Routes["appeal"].path}${Routes["appeal"].param}`}
                      component = {Appeal}
                      page = {this.state.page}
                      _self={this}
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
    let {user, page: {pageType, id}} = this.props;
    this.userId = id;
    this.updateHandler = this.updateHandler.bind(this);
    this._isMounted =  false;
    this.historyStore = null;
  }
  
  state = {
    list: null,
    ids: null
  }

  componentDidMount(){
    this._isMounted = true;
    this.historyStore = new UserStore('historyrooms', this.userId);
    this.historyStore.start();
    this.historyStore.addListener('updateRooms', this.updateHandler);

  }

  componentWillUnmount() {
    this._isMounted = false;
    this.historyStore.stop();
    this.historyStore.removeListener('updateRooms', this.updateHandler);
    this.historyStore = null;
  }

  async updateHandler(data){
    if(!this._isMounted) return
    if(data.list[0] === null){ // not cached
       Promise.all(data.ids.map(id => {
            return TxRest.getDataByID('historyroom', id);
        })).then((data => {
            data.map(((item, index) => {
              if(!this._isMounted) return
              this.historyStore.itemUpdated(item.value, this.userId, index)
            }).bind(this))
            this.setState(this.historyStore.getState())
        }).bind(this));
    }else{
      
        this.setState(this.historyStore.getState())
        Promise.all(data.ids.map(id => {
            if(!this._isMounted) return
            return TxRest.getDataByID('historyroom', id);
        })).then((data => {
              if(!this._isMounted) return
              this.setState(this.historyStore.getState())
        }).bind(this))
    }
  } 

  render(){
    let {user, page: {pageType, id, historyId}} = this.props;

    let {list} = this.state;
    let route = `/admin/${pageType}/${id}`;
    let activeTab = historyId;
    if(!user){
      
      return(<div className="f sidebar">
              <div className="admin-user-details">
                  <div className="admin-user-details__topArea">
                    <figure className="f f-align-2-2 admin-user-details__avatar">
                      <img src={avatar} alt="Textra" />
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

    if(user && !list){
      let registrationTime = new Date(user.registrationTime);
      return(<div className="f sidebar">
                <div className="admin-user-details">
                <div className="admin-user-details__topArea">
                  <figure className="f f-align-2-2 admin-user-details__avatar">
                    <img src={avatar} alt="Textra" />
                  </figure>
                  <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                    <div className="admin-user-details__personalInfo__title">{user.title} </div>
                    <div className="admin-user-details__personalInfo__email">{user.email}</div>
                    <div className={`admin-user-details__personalInfo__type admin-user-details__personalInfo__type${String.prototype.toUpperCase.call(user.type)}`}>
                      {findIcon(Roles, user.type, 'text')}
                    </div>
                  </div>
                </div>
                <div className="admin-user-details__delimiter"></div>
                <div className="admin-user-details__serviceInfo">
                  <div className="f f-align-13-2 admin-user-details__serviceInfo__regData"><span>Дата регистрации:</span>
                      <data>{registrationTime.getDay()}.{registrationTime.getMonth()}.{registrationTime.getFullYear()}</data></div>
                  <div className="f f-align-13-2 admin-user-details__serviceInfo__spendTime"><span>Общее время переводов:</span><data>{humanReadableTime(user.duration)}</data></div>
                  <div className="f f-align-13-2 admin-user-details__serviceInfo__amountSymble"><span>Кол-во символов перевода:</span><data>{user.letterNumber}</data></div>
                  <div className="f f-align-13-2 admin-user-details__serviceInfo__balance"><span>Баланс:</span><data>{user.cost}</data></div>
                </div>  
              </div>
            </div>
    )}
    let registrationTime = new Date(user.registrationTime);

    return(<div className="f sidebar">
        <div className="admin-user-details">
            <div className="admin-user-details__topArea">
              <figure className="f f-align-2-2 admin-user-details__avatar">
                <img src={avatar} alt="Textra" />
              </figure>
              <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                <div className="admin-user-details__personalInfo__title">{user.title} </div>
                <div className="admin-user-details__personalInfo__email">{user.email}</div>
                <div className={`admin-user-details__personalInfo__type admin-user-details__personalInfo__type${String.prototype.toUpperCase.call(user.type)}`}>
                  {findIcon(Roles, user.type, 'text')}
                </div>
              </div>
            </div>
            <div className="admin-user-details__delimiter"></div>
            <div className="admin-user-details__serviceInfo">
              <div className="f f-align-13-2 admin-user-details__serviceInfo__regData"><span>Дата регистрации:</span>
                  <data>{registrationTime.getDay()}.{registrationTime.getMonth()}.{registrationTime.getFullYear()}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__spendTime"><span>Общее время переводов:</span><data>{humanReadableTime(user.duration)}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__amountSymble"><span>Кол-во символов перевода:</span><data>{user.letterNumber}</data></div>
              <div className="f f-align-13-2 admin-user-details__serviceInfo__balance"><span>Баланс:</span><data>{user.cost}</data></div>
            </div>  
        </div>
      {Object.values(list).map((tab, index) => {
        let publishTime = new Date(tab.publishTime);
        return (
          <Link
            to={{pathname: `${route}/history/${tab.uuid}`, state:{pageType: 'user', id: user.uuid, historyId: tab.uuid}}}
            className={`f f-align-1-2 admin-tab ${tab.uuid === activeTab ? "selected" : ""}`}
            key={index}
          >
            <figure className="f f-align-2-2 admin-tab-avatar">
              {" "}<img src={avatar} alt="Textra" />{" "}
            </figure>
            <div className="f f-col f-align-1-1 admin-tab-details">
              <div className="admin-tab-title">{tab.title} </div>
              <div className="admin-tab-content">
                {" "}{tab.content}
              </div>
            </div>
            <div className="f f-col f-align-2-3 admin-tab-info">
              <div className="admin-tab-info__time">
                <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time>
              </div>
              <LangLabel
                from={tab.from}
                to={tab.to}
                selected={tab.uuid === activeTab}
              />
              <div className="admin-tab-info__duration">
                {humanReadableTime(tab.duration)}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )}
};

const RoutePassProps = ({ component: Component, redirect, ...rest }) =>
  (!redirect
    ? <Route {...rest} render={props => <Component {...props} {...rest} />} />
    : <Redirect to={`${redirect}`} />);



class Users extends React.Component {

  constructor(p){
    super(p);
    this.store = null;
    this._isMounted = false;
    this.changeTypeOfUser = this.changeTypeOfUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.sortMe = this.sortMe.bind(this)
    this.changeFilter = this.changeFilter.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.rememberLastValue = this.rememberLastValue.bind(this)
    this.updateHandler = this.updateHandler.bind(this)
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
    usedRoles: []
  }

  componentDidMount(){
    this._isMounted = true;
    let {page: {pageType, id}} = this.props;
    this.store = new Store(pageType);
    this.store.start();
    this.store.addListener('update', this.updateHandler);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.store.stop();
    this.store.removeListener('update', this.updateHandler);
    this.store = null;
  }

  updateHandler(data){
    if(!this._isMounted) return
    let _self = this;
    if( data.list[0] === null ) {
      Promise.all(data.ids.map(id => TxRest.getDataByID(this.props.page.pageType.slice(0, -1), id)))
            .then((list) => {
                list.map((item, index) => _self.store.itemUpdated(item.value, index))
                let {list: usersList , ids} = _self.store.getState();
                _self.setUsedRoled(usersList);
                _self.setState({usersList: usersList, usersListFetched: usersList})})
    }else{
        _self.setUsedRoled(data.list);
        _self.setState({usersList: data.list, usersListFetched: data.list})
        Promise.all(data.ids.map(id => TxRest.getDataByID(this.props.page.pageType.slice(0, -1), id)))
            .then(async list => { await sleep(10000); return Promise.resolve(list)})
            .then((list) => {
                if(!this._isMounted) return
                list.map((item, index) => _self.store.itemUpdated(item.value, index))
                let {list: usersList , ids} = _self.store.getState();
                _self.setUsedRoled(usersList);
                _self.setState({usersList: usersList, usersListFetched: usersList})})
    }
  }

  setUsedRoled(currentDate,cb){
    let usedRoles = {},
        roles = [];
    currentDate.map(o => usedRoles[o.type] = true)
    roles = Roles.filter(o => Object.keys(usedRoles).some(r => r === o.value));
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

    return new Promise(resolve => setTimeout(resolve ,1000))
                  .then(_ => {
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

  deleteUser (uuid){
    let _self = this;
    this.setState(Object.assign({}, this.state,{
      deleting:{
        is: true,
        uuid
      }
    }))

    return new Promise(resolve => setTimeout(resolve ,1000))
              .then(_ => {
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
                  <Table.HeaderCell textAlign='center' >Delete</Table.HeaderCell>
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
              <Table color={'blue'} compact fixed celled sortable={true} style={{ width: '90%', minWidth:'959px', marginLeft: 'auto', marginRight: 'auto'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={ columnNameToSort === 'nickname' ? columnSortDirection : null} onClick={this.sortMe('nickname')}>Name</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'email' ? columnSortDirection : null} onClick={this.sortMe('email')} >E-mail address</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'type' ? columnSortDirection : null} onClick={this.sortMe('type')}>User Type</Table.HeaderCell>
                  <Table.HeaderCell sorted={ columnNameToSort === 'registrationTime' ? columnSortDirection : null} onClick={this.sortMe('registrationTime')}>Registration Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center' >Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { Array.isArray(currentDate) && currentDate.length === 0 ?
                <Table.Row className={"f f-align-2-33 admin-list "} textAlign='center'>
                    <Table.Cell >Пользователи отсутствуют</Table.Cell>
                </Table.Row>
                :
                Array.isArray(currentDate) && currentDate.map(({nickname, uuid, email, type, registrationTime}, index) => (
                  <Table.Row key={index}>
                    <Table.Cell><Link to={{
                        pathname: `/admin/${pageType.toLowerCase().slice(0,pageType.length - 1)}/${uuid}`,
                        state: {pageType: pageType.toLowerCase().slice(0,pageType.length - 1), id: uuid }
                        }}>
                        {nickname}
                      </Link></Table.Cell>
                    <Table.Cell>{email}</Table.Cell>
                    <Table.Cell style={{overflow: 'visible'}}> {!!roles.length && <Icon {...findIcon(roles, type)} />}
                     {  pageType ===  'users' ?
                       <Dropdown inline 
                      {...(loading.is && loading.uuid === uuid && {loading:true})} 
                      {...(loading.is && {disabled:true})} options={roles.map(o => {return { text: o.text, value: o.value }})} value={type}
                      onChange={this.changeTypeOfUser.bind(self, uuid)}
                      onOpen={this.rememberLastValue}/>
                      : findIcon(Roles, type, 'text')
                     }
                    </Table.Cell>
                    <Table.Cell>{new Date(registrationTime).toDateString()} {new Date(registrationTime).getHours()}:{new Date(registrationTime).getMinutes()}</Table.Cell>
                    <Table.Cell className="f f-align-2-2">
                      <button {...(deleting.is && {'disabled':true})}  onClick={debounce(this.deleteUser.bind(self,uuid),200,false)} className="admin-list__delbtn btn btn-block btn-flat btn-normal f f-align-2-2"><img src={deleteIcon} alt="icon"/></button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        </div>)
  }
}


class UserAccount extends React.Component {
  constructor(props){
    super(props);
    this.massageStore =null;
    this.user = Store.getItem(this.props.page.id)
    if( this.user )
    this.userId = this.user.uuid;
    this.updateHandler = this.updateHandler.bind(this);
    this._isMounted = false;
    
  }

  state = {
    list: null
  }

  componentWillMount(){
    this.setState({list: MessageStore.getMassage('historymassage', this.userId) })
  }


  componentDidMount(){
    this._isMounted = true;
    let {pageType ,historyId} = this.props.page;
    this.massageStore = new MessageStore('historymassage', this.userId);
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

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }  

  render() {
    let { _self  } = this.props;

    let { list } = this.state;

    if(!list){
      return(
        <div/>
      )

    }

    const RenderCollection = renderItem => {
      return (
        <div>
          {
            Object.values(list).map( (item ,index) => {
                return renderItem(item, index, new Date(item.publishTime))
            })
          }
          
        </div>
      );
    };
    return (Object.entries(list).length === 0
            ? <div className={"f f-align-2-33 admin-historypost u-mx-3 u-my-2"}>
                <div className={"admin-historypost__avatar"}>
                    <img src={avatar} />
                </div>
                <div className={"f f-align-2-2 admin-historypost__placeholder"}>
                    <span>История отсутствуют</span>
                </div>
              </div>
            : RenderCollection((currentDate, index, publishTime) => (
            <div key={index} className={"f f-col f-align-1-1 admin-historypost"}>
                {currentDate.postType === 'post' &&<div className={"data__delimiter"}>
                  {publishTime.getDate()}{" "}{getMounthName(publishTime.getMonth())},{" "}{publishTime.getFullYear()}{" "}
                </div>}
                <div className={`f f-align-1-1 admin-historypost-${currentDate.postType}`}>
                <div className={`admin-historypost-${currentDate.postType}__content`}>
                    <div className={`admin-historypost-${currentDate.postType}__content__text`}>
                    {currentDate.content}
                    </div>
                    {currentDate.postType === 'post' && <div className={`f f-align-1-2 f-gap-4 admin-historypost-${currentDate.postType}__content__bottombar`}>
                      <LangLabel from={currentDate.from} to={currentDate.to} />
                      <Indicator
                          className={"f f-align-2-2"}
                          icon={icon_dur}
                          value={humanReadableTime(currentDate.duration)}
                          hint={"Длительность перевода"}
                      />
                      <Indicator
                          className={"f f-align-2-2"}
                          icon={
                          <Timer
                              start={currentDate.startWorkingTime}
                              duration={currentDate.duration}
                              isBig={true}
                          />
                          }
                          value={humanReadableTime(
                          currentDate.duration -
                              (new Date() - new Date(currentDate.startWorkingTime)) / 1000
                          )}
                          hint={"Оставшееся время"}
                      />
                      <Indicator
                          className={"f f-align-2-2"}
                          icon={icon_letternum}
                          value={currentDate.letterNumber}
                          hint={"Количество символов"}
                      />
                      <Indicator
                          className={"f f-align-2-2"}
                          icon={icon_cost}
                          value={currentDate.cost}
                          hint={"Стоимость"}
                      />

                    </div>}
                </div>
                <div className={`admin-historypost-${currentDate.postType}__date`}>
                    {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                </div>
                </div>
            </div>)
    ));
  }
}


class Appeal extends React.Component {

  constructor(props){
    super(props);
    this.massageStore = null; 
    this.user = Store.getItem(this.props.page.id)
    if( this.user )
    this.userId = this.user.uuid;
    this.updateHandler = this.updateHandler.bind(this);
    this._isMounted = false;
    }

  state = {
    list: null
  }

  componentWillMount(){
    this.setState({list: MessageStore.getMassage('appeal', this.userId) })
  }

  componentDidMount(){
    this._isMounted = true;
    let {historyId} = this.props.page;
    this.massageStore = new MessageStore('appeal', this.userId);
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
    this.massageStore.removeListener('updateMessage', this.updateHandler);
    this.massageStore = null;
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

    let { list } = this.state;

    if(!list){
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
                    <span>История отсутствуют</span>
                </div>
              </div>
            : RenderCollection((currentDate, index, publishTime) => (
              <div>
                <div className={"data__delimiter admin-history-data__delimiter "}>{publishTime.getDate()}{" "}{getMounthName(publishTime.getMonth())},{" "}{publishTime.getFullYear()}{" "}</div>
                <div key={index} className={"f f-row f-align-13-1 admin-history"}>
                    <div className={"f f-align-1-1 f-col f-gap-2 admin-history-post "}>
                      <div className="admin-user-details__topArea">
                        <figure className="f f-align-2-2 admin-user-details__avatar">
                          <img src={avatar} alt={currentDate.nickname} />
                        </figure>
                        <div className="f f-col f-align-1-1 admin-user-details__personalInfo">
                          <div className="admin-user-details__personalInfo__title">{currentDate.title} </div>
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
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                  </div>
                </div>
                ))
    );
  }
}

export default withRouter(Admin);
