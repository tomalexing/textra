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
  dump
} from "./utils";

import Batch from "./components/Batch";

import Header, { NavLink } from "./components/Header";

import Test from "./Test";
import Timer from "./components/Timer";
import LangLabel from "./components/LangLabel";
import StatefulEditor from "./components/StatefulEditor";
import Indicator from "./components/Indicator";


import { Button, Checkbox, Icon, Table, Dropdown, Input } from 'semantic-ui-react'


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
    path: "/admin/appeals",
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


function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

function partition(items, left, right, item, comporator) {

    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;


    while (i <= j) {

        while (comporator(items[i], pivot, false, item)) {
            i++;
        }

        while (comporator(items[j], pivot, true, item)) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function quickSort(items, left, right, item, comporator) {

    var index;

    if (items.length > 1) {

        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(items, left, right, item, comporator);

        if (left < index - 1) {
            quickSort(items, left, index - 1, item, comporator)
        }

        if (index < right) {
            quickSort(items, index, right, item, comporator)
        }

    }

    return items;
};
    // Types of user :
    // u - user
    // c - controller
    // t - translater
    // p - possibility
    // a - appeal
    // o - other

const UsersList = [
      {
        uuid: "qwerqwerqwer",
        nickname: "aaaa",
        type: 'u',
        email: 'nickmy@yandex.ru',
        avatar: avatar,
        title: "Инна Константинопольская",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        registrationTime: new Date(new Date() - 10000),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
       {
        uuid: "lkhgghk",
        nickname: "zfdfsddf",
        email: 'helpme@yandex.ru',
        avatar: avatar,
        type: 'c',
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        registrationTime: new Date(new Date() - 10065500),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      },
      {
        uuid: "vnbmnbmhg",
        nickname: "alex",
        email: 'yiyiyiyi@mail.ru',
        avatar: avatar,
        type: 't',
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        registrationTime: new Date(new Date() - 10000000),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      {
        uuid: "bertu",
        nickname: "rgsgfgsa",
        email: 'yiyiyiyi@mail.ru',
        avatar: avatar,
        type: 'u',
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        registrationTime: new Date(new Date() - 10),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      },
      {
        uuid: "wasdffeq",
        nickname: "bfsbs",
        email: 'dsgsgsgdg@mail.ru',
        avatar: avatar,
        type: 'c',
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        registrationTime: new Date(new Date() - 1000),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      {
        uuid: "wasgfasrq",
        nickname: "asdasdas",
        email: 'mtnbvcx@mail.ru',
        avatar: avatar,
        type: 'c',
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        registrationTime: new Date(new Date() - 1000000),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      }
];


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];

    this.list = this.list.bind(this);
    this.renders = 0;

    this.boundRef = this.boundRef.bind(this);
    this.changeUsersList = this.changeUsersList.bind(this);
    this.deleteUserFromList = this.deleteUserFromList.bind(this);
    this.sortCollection = this.sortCollection.bind(this);
    this.changeListByFilter = this.changeListByFilter.bind(this);
    this.changeListBySearch = this.changeListBySearch.bind(this);
  }

  state = {
    redirectToReferrer: false,
    items: [],
    isTablet: false,
    mainScreen: true,
    secondScreen: false,
    sidebar: false,
    page:{
      pageType: 'users',
      id: undefined,
      historyId: undefined
    },
    UsersList: null,
    
  };

  addStyleSeheet(){
    let style = document.createElement('link');
    style.rel = "stylesheet";
    style.href = "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css";
    let element = document.getElementsByTagName('style')[0];
    element.insertAdjacentElement('afterend',style);
  }

  componentWillMount() {
    this.doAtDidMount.forEach(func => func());
    this.addStyleSeheet();
    // Responsive stuff
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

    if (window.innerWidth <= 768) {
      this.state.isTablet = true;
    }

    // Responsive end

    let { location: { pathname } } = this.props;
    let activeTabA = pathname.split("/");
    this.setState({
      page:{
        pageType: ((/user(\/.+)?$/.test(pathname))
                  ? 'User'
                  : /users/.test(pathname)
                  ? 'Users'
                  : (/appeals/.test(pathname))
                  ? 'Appeals'
                  : (/appeal(\/.+)?$/.test(pathname))) ,
        id: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 3] : pathname.split("/")[activeTabA.length - 1],
        historyId: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 1] : undefined,
      }
    })

    sleep(1000);
    this.setState({UsersList});

  }

  componentWillReceiveProps(nextProps){
    let { location: { pathname } } = nextProps;
    let activeTabA = pathname.split("/");
    this.setState({
      page:{
        pageType: ((/user(\/.+)?$/.test(pathname))
                  ? 'User'
                  : /users/.test(pathname)
                  ? 'Users'
                  : (/appeals/.test(pathname))
                  ? 'Appeals'
                  : (/appeal(\/.+)?$/.test(pathname))) ,
        id: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 3] : pathname.split("/")[activeTabA.length - 1],
        historyId: /history/.test(pathname) ? pathname.split("/")[activeTabA.length - 1] : undefined,
      }
    })
  }

  async componentDidMount() {
    console.log("componentDidMount");
    console.log(this.test);
    this.listeners.push(
      delegate.call(
        this,
        window,
        "touchend",
        `.${Array.from(this.bg.classList).join(".")}`,
        event => {
          if (!this.state.sidebar || event.target.closest(".sidebar__menu")) return;

          this.setState({ sidebar: false });
        },
        false
      )
    );
    while (1) {
      const prev = this.state.items;
      const items = [`Hello World #${prev.length}`, ...prev];
      this.setState({ items });
      await sleep(Math.random() * 3000000);
    }
    console.log(this);
  }

  changeUsersList(uuid, value){
    let self = this;
    let inx
    self.state.UsersList.find((o,i) => {if(o.uuid == uuid) inx = i});
     return new Promise(r => {
       this.setState(Object.assign(self.state.UsersList[inx], {type: value}),r)
     })
  }

  deleteUserFromList(uuid){
    let self = this;
    let inx, inx2;
    self.state.UsersList.find((o,i) => {if(o.uuid == uuid) inx = i});
    UsersList.find((o,i) => {if(o.uuid == uuid) inx2 = i});

    return new Promise(r => {
        let list = Object.assign([], this.state.UsersList);
        list.splice(inx,1);
        UsersList.splice(inx2,1);
        this.setState(Object.assign(self.state.UsersList, {UsersList:list}),r);
      })
  }

  sortCollection({columnNameToSort, columnSortDirection}){
    return new Promise(r => {
      console.time('sort');
      let sortedList = quickSort(Object.assign([], this.state.UsersList), null, null, columnNameToSort, (val1, val2, pos, item) => {
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

      this.setState(Object.assign(this.state, {UsersList:sortedList}),r);
    });

  }

  changeListByFilter({field, value}){
    return new Promise(r => {
      if(value === 'a'){
        this.setState({UsersList},r);
        return
      }
      this.setState({
        UsersList: this.state.UsersList.filter(o => o[field] === value)
      },r)
    });
  }

  changeListBySearch({value, field, filter}){
    return new Promise(r => {
      if(filter === 'a'){
        this.setState({
        UsersList: UsersList.filter(o => o['nickname'].includes(value))
        },r)
        return
      }
      this.setState({
        UsersList: UsersList.filter(o => o['nickname'].includes(value) &&  o[field] === filter)
      },r)
    });
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

  componentWillReceiveProps(props) {
    const { mainScreen, secondScreen } = this.props.location.state || {
      mainScreen: true,
      secondScreen: false
    };
    this.setState({ mainScreen, secondScreen });
  }

  componentWillUnmount() {
    this.listeners.forEach(removeEventListener => removeEventListener());
  }

  render() {
    let { location: { pathname } } = this.props;
    let activeTabA = pathname.split("/");
    let activeTab =
      (/user(\/.+)?$/.test(pathname) && pathname.split("/")[activeTabA.length - 1]) ||
      false;
    let allUsers = /users/.test(pathname);
    let activeHistory =
      (/appeals/.test(pathname) &&
        pathname.split("/")[activeTabA.length - 1]) ||
      false;

    const HistoryList = {
      alex: {
        uuid: "alex",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d",
        contentFull: "Создать запрос на перевод Создать запросна переводСоздать запроснапереводСоздать запросна d",
        opened: false,
        publishTime: new Date(new Date() - 100000).toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 24441,
        letterNumber: 213,
        startTime: "12:32",
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        postType: 'post'
      },
      wqerq: {
        uuid: "alex_alex",
        nickname: "alex_alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        contentFull: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date(new Date() - 100000).toISOString(),
        startWorkingTime: new Date(new Date() - 100000).toISOString(),
        duration: 634,
        startTime: "12:32",
        letterNumber: 213,
        opened: false,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        postType: 'reply'
      }
    };

    const find = (objs, id) => Object.values(objs).find(o => o.uuid == id);
    let {UsersList, page:{pageType, id, historyId}} = this.state;
    let currentDate, user;

    switch(pageType){
    case('Users'): 
      currentDate = UsersList;
      break;
    case('User'):
      currentDate = HistoryList;
      user = UsersList.find(v => v.uuid === id);
      break;
    }

    let { isTablet, sidebar, secondScreen, mainScreen } = this.state;

    return (
      <div className="f f-col outer admin">
        <Header />
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
                  className={
                    "f f-align-1-2 translator-menu__item translator-menu__item__level-1"
                  }
                  to={{
                    pathname: Routes["users"].path,
                    state: { mainScreen: true }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}>
                    <img src={users} />
                  </span>
                  <span>Пользователи</span>
                 
                </NavLink>
                <div className="translator-menu__delimiter" />
                <NavLink
                  className={
                    "f f-align-1-2 translator-menu__item translator-menu__item__level-1"
                  }
                  to={{
                    pathname: Routes["appeals"].path,
                    state: { mainScreen: false,
                            secondScreen: true }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}>
                    <img src={appeals} />
                  </span>
                  <span>Запросы</span>
                </NavLink>
                <div className="translator-menu__delimiter" />
              </ul>
               {/* Ends Left SubMenu */}
            </div>
          </div>

          {/*  Left Expanded Area  */}
          <Route
            path={Routes["user"].path}
            render={() => (
              <div
                ref={n => (this.secondScreen = n)}
                style={{
                  display: `${!isTablet ? "flex" : secondScreen ? "flex" : "none"}`
                }}
                className="f f-align-2-2 f-col outer-left__expanded"
              >
                <SideList
                  List={currentDate}
                  user={user}
                  uuidOfActiveTab={historyId}
                  route={`${Routes["user"].path}/${id}`}
                  title="Пользователь"
                  isTablet={isTablet}
                  this={this}
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
                  background: `${allUsers ? "#f5f5f5": "#fff"}`
                }}
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
                      isTablet={this.state.isTablet}
                      currentDate={currentDate}
                      _self={this}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["users"].path}
                      component={Users}
                      currentDate={currentDate}
                      isTablet={this.state.isTablet}
                      _self={this}
                      changeUsersList = {this.changeUsersList}
                      deleteUserFromList = {this.deleteUserFromList} 
                      sortCollection = {this.sortCollection}
                      changeListByFilter = {this.changeListByFilter}
                      changeListBySearch = {this.changeListBySearch}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["appeals"].path}
                      component={Users}
                      currentDate={currentDate}
                      isTablet={this.state.isTablet}
                      _self={this}
                      common
                    />
                    <RoutePassProps
                      path={`${Routes["user"].path}${Routes["user"].param}/history${Routes["history"].param}`}
                      component={UserAccount}
                      currentDate={currentDate}
                      user = {user}
                      _self={this}
                      isTablet={this.state.isTablet}
                    />
                    <RoutePassProps
                      path={`${Routes["appeals"].path}${Routes["appeals"].param}`}
                      component={Users}
                      currentDate={currentDate}
                      _self={this}
                      isTablet={this.state.isTablet}
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

const BreadCrumbs = ({
  this: _self,
  Title: {title, shownOnDesktop},
  Left: { leftBtn, leftBtnName, newLeftBtnState },
  Right: { rightBtn, rightBtnName, newRightBtnState },
  isTablet
}) => {
  return isTablet
    ? <div className="f f-align-1-2 breadcrumbs">
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
                style={{ transform: "rotate(180deg)" }}
              >
                <path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" />
              </svg>
            </button>
          : ""}
      </div>
    : shownOnDesktop &&  <div className="f f-align-1-2 translator-tab__topline"> <span>{title}</span> </div>;
};


const SideList = ({
  List,
  user,
  uuidOfActiveTab: activeTab,
  route,
  title = "В работе",
  isTablet,
  this: _rootSelf,
  Left = {
        leftBtn: true,
        leftBtnName: "Меню",
        newLeftBtnState: { mainScreen: false, sidebar: true, secondScreen: true }
  },
  Right = {
    rightBtn: false
  }
}) => {
  let registrationTime = new Date(user.registrationTime);
  return (
    <div className="f sidebar">
        <BreadCrumbs
          this={_rootSelf}
          isTablet={isTablet}
          Title={{
              title: title,
              shownOnDesktop: false
          }}
          Left={Left}
          Right={Right}
        />
        <div className="admin-user-details">
            <div className="admin-user-details__topArea">
              <figure className="f f-align-2-2 admin-user-details__avatar">
                <img src={user.avatar} alt="Textra" />
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
      {Object.values(List).map((tab, index) => {
        let publishTime = new Date(tab.publishTime);
        return (
          <Link
            to={`${route}/history/${tab.uuid}`}
            className={`f f-align-1-2 admin-tab ${tab.uuid === activeTab ? "selected" : ""}`}
            key={index}
          >
            <figure className="f f-align-2-2 admin-tab-avatar">
              {" "}<img src={tab.avatar} alt="Textra" />{" "}
            </figure>
            <div className="f f-col f-align-1-1 admin-tab-details">
              <div className="admin-tab-title">{tab.title} </div>
              <div className="admin-tab-content">
                {" "}{tab.content}
              </div>
            </div>
            <div className="f f-col f-align-2-3 admin-tab-info">
              <div className="admin-tab-info__time">
                <time
                >{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time>
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
  );
};

const RoutePassProps = ({ component: Component, redirect, ...rest }) =>
  (!redirect
    ? <Route {...rest} render={props => <Component {...props} {...rest} />} />
    : <Redirect to={`${redirect}`} />);



const lcMatch = (q, s) => s && s.toLowerCase().indexOf(q.toLowerCase()) >= 0;

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
          f => (f.diactivate ? true : item[f.name] === f.equals)
        );
      case "some":
        return Object.values(fieldList).some(
          f => (f.diactivate ? true : item[f.name] === f.equals)
        );
    }
  };
  isNotExeed = (q, ind) => {
    if (q.perPage < 0) return true;
    return q.perPage * q.page - 1 >= this.displayedCount++;
  };

  filter = () =>
    Object.values(this.data).filter(
      (item, idx) =>
        this.eqField(
          this.query["fielteredField"],
          item,
          this.query["fielteredFieldRule"]
        ) && this.isNotExeed(this.query, idx)
    );
}

class Users extends React.Component {

  constructor(p){
    super(p);

    this.changeTypeOfUser = this.changeTypeOfUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.sortMe = this.sortMe.bind(this)
    this.changeFilter = this.changeFilter.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.rememberLastValue = this.rememberLastValue.bind(this)
    this.lastDropDownOpenedValue = undefined;
  }

  state = {
    roles: [],
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
      value: undefined
    }
  }

  componentWillMount(){
    let {currentDate} = this.props,
        usedRoles = {},
        roles = [];
    currentDate.map(o => usedRoles[o.type] = true)
    roles = Roles.filter(o => Object.keys(usedRoles).some(r => r === o.value));
    this.setState({
      roles
    })
  }
  rememberLastValue(_, {value}) { this.lastDropDownOpenedValue = value }

  changeTypeOfUser(uuid, _ , {value}){
    let argsAr  = Array.prototype.slice.call(arguments);
    console.log(argsAr);

    if( this.lastDropDownOpenedValue == value) // do nothing if nothing has changed
      return 

    this.setState(Object.assign(this.state,{
      loading:{
        is: true,
        uuid
      }
    }))

    return new Promise(resolve => setTimeout(resolve ,1000))
                  .then(_ => {
                    return this.props.changeUsersList(uuid, value)
                  }).then(_ => {  
                    return this.props.changeListByFilter({field: 'type', value: this.state.filter.value || 'c'});
                  }).then(_ => {
                    this.setState(Object.assign(this.state,{
                      loading:{
                        is: false,
                        uuid: undefined
                      }
                    }))
                  })
  }

  deleteUser (uuid){

    this.setState(Object.assign(this.state,{
      deleting:{
        is: true,
        uuid
      }
    }))

    return new Promise(resolve => setTimeout(resolve ,1000))
              .then(_ => {
                return this.props.deleteUserFromList(uuid)
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
         self.props.sortCollection({
          columnNameToSort,
          columnSortDirection: self.state.sorting.columnSortDirection
        })
      })
      return
    }

    self.setState(Object.assign(self.state,{
      sorting:{
        columnNameToSort,
        columnSortDirection: 'descending'
      }
    }), () => {
      self.props.sortCollection({
        columnNameToSort,
        columnSortDirection: 'descending'
      })
    })
  }

  changeFilter(_ , {options, value}){
    let self = this,
        text = options.find(o => o.value === value)['text'];
        
    self.setState(Object.assign(self.state,{
      filter:{
        text,
        value
      }
    }), () => {
      this.props.changeListByFilter({field: 'type', value});
    })
  }

  changeSearch(_ , {value}){
    let self = this;

    self.setState(Object.assign(self.state,{
      search:{
        value
      }
    }), () => {
      Promise.resolve().then( _ => {
        return self.props.changeListBySearch({value, field: 'type', filter: self.state.filter.value})})
      .then(_ => {  
        //return self.props.changeListByFilter({field: 'type', value: self.state.filter.value || 'c'});
    })
    })
  }

  render() {
  
    let { currentDate, location: { pathname }, isTablet, _self } = this.props;
    let {loading, deleting, sorting:{columnNameToSort, columnSortDirection}, filter:{text}, search, roles} = this.state;
    let self = this;

    return  (<div>
              <div className="f f-align-1-2 admin-list__topline"><span>Пользователи</span></div>
              <div className="f f-align-1-2 admin-list__topbar">
                <Dropdown text={`${text}`} options={Object.assign([],roles,[{ 
                  text: 'Все',
                  value: 'a', 
                  icon: { name: 'circle', color: 'teal', size: 'small' },
                  },...roles])} 
                  icon='filter'   
                  floating
                  labeled 
                  button 
                  className='icon admin-list__filter'
                  onChange={self.changeFilter}/>
                <Input icon='search' iconPosition='left' className='admin-list__search' value={!!search.value ? search.value : '' } onChange={self.changeSearch} />
              </div>
              <Table compact fixed celled  sortable={true} style={{maxWidth:'959px', marginLeft: 'auto', marginRight: 'auto'}}>
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
                { currentDate.length === 0 ?
                <Table.Row className={"f f-align-2-33 admin-list "} textAlign='center'>
                    <Table.Cell >Пользователи отсутствуют</Table.Cell>
                </Table.Row>
                :
                currentDate.map(({nickname, uuid, email, type, registrationTime}, index) => (
                  <Table.Row key={index}>
                    <Table.Cell><Link to={`/admin/user/${uuid}`}>{nickname}</Link></Table.Cell>
                    <Table.Cell>{email}</Table.Cell>
                    <Table.Cell style={{overflow: 'visible'}}><Icon {...findIcon(roles, type)} />
                      <Dropdown inline 
                      {...(loading.is && loading.uuid === uuid && {loading:true})} 
                      {...(loading.is && {disabled:true})} options={roles} value={type}
                      onChange={this.changeTypeOfUser.bind(self, uuid)}
                      onOpen={this.rememberLastValue}/>
                    </Table.Cell>
                    <Table.Cell>{new Date(registrationTime).toDateString()} {new Date(registrationTime).getHours()}:{new Date(registrationTime).getMinutes()}</Table.Cell>
                    <Table.Cell  textAlign='center'>
                      <Button  {...(deleting.is && {disabled:true})}  onClick={debounce(this.deleteUser.bind(self,uuid),200,false)} icon color='blue' size='small'><Icon name='delete' /></Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        </div>)
  }
}


class UserAccount extends React.Component {


  render() {

    let { currentDate, user, isTablet, _self } = this.props;

    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={_self}
                isTablet={isTablet}
                Title={{
                    title:  user.nickname, 
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
          {
            Object.values(currentDate).map( (item ,index) => {
                return renderItem(item, index, new Date(item.publishTime))
            })
          }
          
        </div>
      );
    };
    return (Object.entries(currentDate).length === 0
            ? <div className={"f f-align-2-33 admin-feed u-mx-3 u-my-2"}>
                <div className={"admin-feed__avatar"}>
                    <img src={avatar} />
                </div>
                <div className={"f f-align-2-2 admin-feed__placeholder"}>
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


class HistoryList extends React.Component {
  render() {
    let { currentDate, isTablet, _self,  } = this.props;
    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={_self}
                isTablet={isTablet}
                Title={{
                    title:  currentDate[Object.keys(currentDate)[0]].uuid,  // we get [0] because the very first item in thread can be only from user
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
          {Object.values(currentDate).map((data, index) => {
            let publishTime = new Date(data.publishTime);
            return renderItem(data, index, publishTime);
          })}
        </div>
      );
    };
    return (Object.entries(currentDate).length === 0
            ? <div className={"f f-align-2-33 translator-feed u-mx-3 u-my-2"}>
                <div className={"translator-feed__avatar"}>
                    <img src={avatar} />
                </div>
                <div className={"f f-align-2-2 translator-feed__placeholder"}>
                    <span>История отсутствуют</span>
                </div>
              </div>
            : RenderCollection((currentDate, index, publishTime) => (
                <div key={index} className={"f f-col f-align-1-1 translator-history"}>
                    <div className={"data__delimiter"}>
                    {publishTime.getDate()}{" "}{getMounthName(publishTime.getMonth())}
                    ,
                    {" "}{publishTime.getFullYear()}{" "}
                    </div>
                    <div className={"f f-align-1-1 f-gap-2 translator-history-post "}>
                    <div className={"translator-history-post__avatar"}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={"translator-history-post__content"}>
                        <div className={"translator-history-post__content__text"}>
                        {currentDate.content}
                        </div>
                        <div
                        className={
                            "f f-align-1-2 f-gap-4 translator-history-post__content__bottombar"
                        }
                        >
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

                        </div>
                    </div>
                    <div className={"translator-history-post__constols"} />
                    <div className={"translator-history-post__date"}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                    </div>

                    <div className={"f f-align-1-1 f-gap-2 translator-history-reply"}>
                    <div className={"translator-history-reply__avatar"}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={"translator-history-reply__content"}>
                        <textarea
                        className={"translator-history-reply__content__text"}
                        disabled
                        value={currentDate.content}
                        />
                    </div>
                    <div className={"translator-history-reply__constols"}>
                        <button
                        className={"btn btn-primiry btn-mini f f-align-2-2"}
                        onClick={this.copy}
                        >
                        <img src={copy} alt="copy" />
                        <span>Копировать</span>

                        </button>
                    </div>
                    <div className={"translator-history-post__date"}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                    </div>
                    <div className={"f f-align-1-1 f-gap-2 translator-history-reply"}>
                    <div className={"translator-history-reply__avatar"}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={"translator-history-reply__content"}>
                        <textarea
                        className={"translator-history-reply__content__text"}
                        disabled
                        value={currentDate.content}
                        />
                    </div>
                    <div className={"translator-history-reply__constols"}>
                        <button
                        className={"btn btn-primiry btn-mini f f-align-2-2"}
                        onClick={this.copy}
                        >
                        <img src={copy} alt="copy" />
                        <span>Копировать</span>
                        <input type="hidden" value={currentDate.content} />
                        </button>
                    </div>
                    <div className={"translator-history-post__date"}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                    </div>

                </div>
                ))
    );
  }
}

export default withRouter(Admin);
