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
  getFullMinutes
} from "./utils";

import Batch from "./components/Batch";

import Header, { NavLink } from "./components/Header";

import Test from "./Test";
import Timer from "./components/Timer";
import LangLabel from "./components/LangLabel";
import StatefulEditor from "./components/StatefulEditor";
import Indicator from "./components/Indicator";


import { Button, Checkbox, Icon, Table } from 'semantic-ui-react'


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

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];

    this.list = this.list.bind(this);
    this.renders = 0;

    this.boundRef = this.boundRef.bind(this);
  }

  state = {
    redirectToReferrer: false,
    items: [],
    isTablet: false,
    mainScreen: true,
    secondScreen: false,
    sidebar: false
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
      
    let Feed = {
      wqefeq: {
        uuid: "wqefeq",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      wqerq: {
        uuid: "wqerq",
        nickname: "alex_alexexe",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      },
      wqtdsq: {
        uuid: "wqefeq",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      wqegsfgs: {
        uuid: "wqerq",
        nickname: "alex_alexexe",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      },
      wasdffeq: {
        uuid: "wqefeq",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      wasgfasrq: {
        uuid: "wqerq",
        nickname: "alex_alexexe",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: true
      },
      wagsas: {
        uuid: "wqefeq",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      gasfrq: {
        uuid: "wqerq",
        nickname: "alex_alexexe",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: false
      },
      iytlk: {
        uuid: "wqefeq",
        nickname: "alex",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date(new Date() - 1000000).toISOString(),
        duration: 1341,
        letterNumber: 213,
        from: "RUS",
        to: "ENG",
        cost: "$0.33",
        isPersonal: false
      },
      wryhrjrrq: {
        uuid: "wqerq",
        nickname: "alex_alexexe",
        avatar: avatar,
        title: "Создать запрос на перевод",
        content: "Создать запрос на перевод",
        publishTime: new Date().toISOString(),
        startWorkingTime: new Date().toISOString(),
        duration: 431241,
        letterNumber: 123,
        from: "ENG",
        to: "CHN",
        cost: "$11.33",
        isPersonal: false
      }
    };
    // Feed = {

    // }

    const inProgress = {
      wqefeq: {
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
        cost: "$0.33"
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
        cost: "$11.33"
      }
    };

    const HistoryObject = {
      wqefeq: {
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
        cost: "$0.33"
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
        cost: "$11.33"
      }
    };

    const find = (objs, id) => Object.values(objs).find(o => o.uuid == id);

    let currentDate = activeTab
      ? find(inProgress, activeTab)
      : activeHistory
          ? HistoryObject
          : allUsers ? Feed : {};
      

    let { isTablet, sidebar, secondScreen, mainScreen } = this.state;

    Object.defineProperty(currentDate, "isTablet", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: isTablet
    });

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
                className="f f-align-2-2 outer-left__expanded"
              >
                <SideList
                  List={HistoryObject}
                  uuidOfActiveTab={activeHistory}
                  route={"history"}
                  title="История"
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
                      personal
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
                      path={`${Routes["user"].path}${Routes["user"].param}`}
                      component={Users}
                      currentDate={currentDate}
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

  return (
    <div className="f sidebar">
        <BreadCrumbs
          this={_rootSelf}
          isTablet={isTablet}
          Title={{
              title: title,
              shownOnDesktop: true
          }}
          Left={Left}
          Right={Right}
        />
      {/*<Batch
                flushCount={10}
                flushInterval={150}
                count={this.state.items.length}
                render={this.list}
                debug
            />*/}

      {Object.values(List).map((tab, index) => {
        let publishTime = new Date(tab.publishTime);
        return (
          <Link
            to={`${Routes[route].path}/${tab.uuid}`}
            className={`f f-align-1-2 translator-tab ${tab.uuid === activeTab ? "selected" : ""}`}
            key={index}
          >
            <figure className="f f-align-2-2 translator-tab-avatar">
              {" "}<img src={tab.avatar} alt="Textra" />{" "}
            </figure>
            <div className="f f-col f-align-1-1 translator-tab-details">
              <div className="translator-tab-title">{tab.title} </div>
              <div className="translator-tab-content">
                {" "}{tab.content}
              </div>
            </div>
            <div className="f f-col f-align-2-3 translator-tab-info">
              <div className="translator-tab-info__time">
                <time
                >{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time>
              </div>
              <LangLabel
                from={tab.from}
                to={tab.to}
                selected={tab.uuid === activeTab}
              />
              <div className="translator-tab-info__duration">
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
  render() {
    let { currentDate, location: { pathname }, isTablet, _self } = this.props;


    return Object.entries(currentDate).length === 0
      ? <div className={"f f-align-2-33 admin-list "}>
            <span>Пользователи отсутствуют</span>
        </div>
      :  <div>
           <div className="f f-align-1-2 admin-list__topline"><span>Пользователи</span></div>
              <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Registration Date</Table.HeaderCell>
                  <Table.HeaderCell>E-mail address</Table.HeaderCell>
                  <Table.HeaderCell>Premium Plan</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>
                    <Checkbox slider />
                  </Table.Cell>
                  <Table.Cell>John Lilki</Table.Cell>
                  <Table.Cell>September 14, 2013</Table.Cell>
                  <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
                  <Table.Cell>No</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                    <Checkbox slider />
                  </Table.Cell>
                  <Table.Cell>Jamie Harington</Table.Cell>
                  <Table.Cell>January 11, 2014</Table.Cell>
                  <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
                  <Table.Cell>Yes</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                    <Checkbox slider />
                  </Table.Cell>
                  <Table.Cell>Jill Lewis</Table.Cell>
                  <Table.Cell>May 11, 2014</Table.Cell>
                  <Table.Cell>jilsewris22@yahoo.com</Table.Cell>
                  <Table.Cell>Yes</Table.Cell>
                </Table.Row>
              </Table.Body>

              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell colSpan='4'>
                    <Button floated='right' icon labelPosition='left' primary size='small'>
                      <Icon name='user' /> Add User
                    </Button>
                    <Button size='small'>Approve</Button>
                    <Button disabled size='small'>Approve All</Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
        </div>
  }
}


class Reply extends React.Component {

  currentNumberOfChar({target: {value}}){
      console.log(value);
  }

  render() {
    let { currentDate, isTablet, _self } = this.props;
    let publishTime = new Date(currentDate.publishTime);

    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={_self}
                isTablet={isTablet}
                Title={{
                    title:  currentDate.uuid,  // we get [0] because the very first item in thread can be only from user
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
            renderItem(Object.assign({},currentDate), 1, new Date(currentDate.publishTime))
          }
          
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
            <div className={"f f-col f-align-1-1 translator-replypost"}>
                
                <div className={"data__delimiter"}>
                {publishTime.getDate()}
                {" "}
                {getMounthName(publishTime.getMonth())}
                ,
                {" "}
                {publishTime.getFullYear()}
                {" "}
                </div>
                <div className={"f f-align-1-1 translator-post "}>
                <div className={"translator-post__content"}>
                    <div className={"translator-post__content__text"}>
                    {currentDate.content}
                    </div>
                    <div
                    className={
                        "f f-align-1-2 f-gap-4 translator-post__content__bottombar"
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
                <div className={"translator-post__date"}>
                    {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                </div>
                </div>
                <div className={"f f-align-2-3 translator-reply"}>
                    <textarea
                    type="text"
                    tabIndex={1}
                    name="translator[reply]"
                    placeholder={'Ваш запрос на перевод...'}
                    onChange={this.currentNumberOfChar.bind(this)}
                    />
                <div className={"translator-reply__sent u-ml-3 u-mt-3"}>
                    <button className={"btn btn-mini btn-primiry"}>Отправить</button>
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
