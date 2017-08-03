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
import deepEqual from 'deep-equal';

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

  componentWillMount() {
    this.doAtDidMount.forEach(func => func());

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

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
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
  }

  render() {
    let { location: { pathname } } = this.props;
    let activeTabA = pathname.split("/");
    let activeTab =
      (/reply/.test(pathname) && pathname.split("/")[activeTabA.length - 1]) ||
      false;
    let activeFeed = /feed/.test(pathname);
    let activeHistory =
      (/history/.test(pathname) &&
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
          : activeFeed ? Feed : {};
    let { isTablet, sidebar, secondScreen, mainScreen } = this.state;

    Object.defineProperty(currentDate, "isTablet", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: isTablet
    });

    return (
      <div className="f f-col outer translator">
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
                    pathname: Routes["feed"].path,
                    state: { mainScreen: true }
                  }}
                >
                  <span className={"f f-align-2-2 translator-menu__item__icon"}>
                    <img src={icon_posts} />
                  </span>
                  <span>Запросы</span>
                  <span className={"f f-align-2-2 translator-menu__item__info"}>
                    3
                  </span>
                </NavLink>
                <NavLink
                  className={
                    "f f-align-1-2 translator-menu__item translator-menu__item__level-2"
                  }
                  to={{
                    pathname: Routes["common"].path,
                    state: { mainScreen: true }
                  }}
                >
                  <span
                    className={"f f-align-2-2 translator-menu__item__icon"}
                  />
                  <span>Общие</span>
                  <span className={"f f-align-2-2 translator-menu__item__info"}>
                    2
                  </span>
                </NavLink>
                <NavLink
                  className={
                    "f f-align-1-2 translator-menu__item translator-menu__item__level-2"
                  }
                  to={{
                    pathname: Routes["personal"].path,
                    state: { mainScreen: true }
                  }}
                >
                  <span
                    className={"f f-align-2-2 translator-menu__item__icon"}
                  />
                  <span>Персональные</span>
                  <span className={"f f-align-2-2 translator-menu__item__info"}>
                    1
                  </span>
                </NavLink>
                <NavLink
                  className={
                    "f f-align-1-2 translator-menu__item translator-menu__item__level-1"
                  }
                  to={{
                    pathname: Routes["history"].path,
                    state: { mainScreen: false,
                            secondScreen:true }
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
          <Route
            ref={n => (this.sidebar = n)}
            path={Routes["reply"].path}
            render={() => (
              <div
                ref={n => (this.secondScreen = n)}
                style={{
                  display: `${!isTablet ? "flex" : secondScreen ? "flex" : "none"}`
                }}
                className="f f-align-2-2 outer-left__expanded"
              >
                <SideList
                  List={inProgress}
                  uuidOfActiveTab={activeTab}
                  route={"reply"}
                  title="В работе"
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
                  background: `${activeFeed ? "#f5f5f5": "#fff"}`
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
                      isTablet={this.state.isTablet}
                      currentDate={currentDate}
                      _self={this}
                    />
                    <RoutePassProps
                      exact
                      path={Routes["feed"].path}
                      component={FeedList}
                      currentDate={currentDate}
                      isTablet={this.state.isTablet}
                      _self={this}
                      personal
                    />
                    <RoutePassProps
                      exact
                      path={Routes["common"].path}
                      component={FeedList}
                      currentDate={currentDate}
                      isTablet={this.state.isTablet}
                      _self={this}
                      common
                    />
                    <RoutePassProps
                      path={Routes["personal"].path}
                      component={FeedList}
                      currentDate={currentDate}
                      _self={this}
                      isTablet={this.state.isTablet}
                    />
                    <RoutePassProps
                      path={`${Routes["history"].path}${Routes["history"].param}`}
                      component={HistoryList}
                      currentDate={currentDate}
                      _self={this}
                      isTablet={this.state.isTablet}
                    />
                    <RoutePassProps
                      path={`${Routes["reply"].path}${Routes["reply"].param}`}
                      component={Reply}
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
                  List={inProgress}
                  uuidOfActiveTab={activeTab}
                  route={"reply"}
                  title="В работе"
                  isTablet={isTablet}
                  this={this}
                   Left={{
                        leftBtn: true,
                        leftBtnName: "Меню",
                        newLeftBtnState: { mainScreen: false, sidebar: true, secondScreen: true }
                  }}
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
    console.log('not rerender')
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

class FeedList extends React.Component {

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

  render() {
    let { currentDate, location: { pathname }, isTablet, _self } = this.props;
    let personal = /personal/.test(pathname);
    let common = /common/.test(pathname);
    let query = {
      perPage: !personal && !common ? -1 : 5,
      page: 1,
      fielteredField: {
        field1: {
          name: "isPersonal",
          equals: personal && !common, // personal and not common at one time
          diactivate: !personal && !common // is active
        }
      },
      fielteredFieldRule: "some" // some || every
    };
    let FeedQuery = new Query(currentDate, query),
      filteredFeed = FeedQuery.filter();

    const RenderCollection = renderItem => {
      return (
        <div>
            <BreadCrumbs
                this={_self}
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
            {!isTablet && <div className="f f-align-1-2 translator-feed__topline"><span>Запросы</span></div>}
          {filteredFeed.map((feedData, index) => {
            let publishTime = new Date(feedData.publishTime);
            return renderItem(feedData, index, publishTime);
          })}
        </div>
      );
    };
    return Object.entries(currentDate).length === 0
      ? <div className={"f f-align-2-33 translator-feed u-mx-3 u-my-2"}>
          <div className={"translator-feed__avatar"}>
            <img src={avatar} />
          </div>
          <div className={"f f-align-2-2 translator-feed__placeholder"}>
            <span>Запросы на перевод отсутствуют</span>
          </div>
        </div>
      : RenderCollection((feed, index, publishTime) => (
          <div key={index} className={"f f-align-1-33 translator-feed u-mx-3 u-my-2"}>
            <div className={"translator-feed__avatar"}>
              <img src={feed.avatar} alt={feed.nickname} />
              {currentDate.isTablet &&
                <div className={"translator-feed__content__topbar__name"}>
                  {feed.nickname}
                </div>}
              {currentDate.isTablet &&
                feed.isPersonal &&
                <div className={"translator-feed__content__topbar__personal"}>
                  персональный
                </div>}
              {currentDate.isTablet &&
                <div className={"translator-feed__content__topbar__date"}>
                  {publishTime.getDate()}{" "}{getMounthName(publishTime.getMonth())}
                  ,
                  {" "}{publishTime.getFullYear()}{" "}
                  -
                  {" "}{publishTime.getHours()}
                  :
                  {getFullMinutes(publishTime.getMinutes())}
                </div>}
            </div>
            <div className={"f f-1-2 f-col translator-feed__content"}>
              <div className={"f f-1-2 translator-feed__content__topbar"}>
                {!currentDate.isTablet &&
                  <div className={"translator-feed__content__topbar__name"}>
                    {feed.nickname}
                  </div>}
                {!currentDate.isTablet &&
                  feed.isPersonal &&
                  <div className={"translator-feed__content__topbar__personal"}>
                    персональный
                  </div>}
                {!currentDate.isTablet &&
                  <div className={"translator-feed__content__topbar__date"}>
                    {publishTime.getDate()}
                    {" "}
                    {getMounthName(publishTime.getMonth())}
                    ,
                    {" "}
                    {publishTime.getFullYear()}
                    {" "}
                    -
                    {" "}
                    {publishTime.getHours()}
                    :
                    {getFullMinutes(publishTime.getMinutes())}
                  </div>}
              </div>
              <div className={"translator-feed__content__text"}>
                {feed.content}
              </div>
              <div
                className={
                  "f f-align-1-2 f-gap-4 translator-feed__content__bottombar"
                }
              >
                <LangLabel from={feed.from} to={feed.to} />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_dur}
                  value={humanReadableTime(feed.duration)}
                  hint={"Длительность перевода"}
                />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={
                    <Timer
                      start={feed.startWorkingTime}
                      duration={feed.duration}
                      isBig={true}
                    />
                  }
                  value={humanReadableTime(feed.duration - (new Date() - new Date(feed.startWorkingTime)) / 1000)}
                  hint={"Оставшееся время"}
                />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_letternum}
                  value={feed.letterNumber}
                  hint={"Количество символов"}
                />
                <Indicator
                  className={"f f-align-2-2"}
                  icon={icon_cost}
                  value={feed.cost}
                  hint={"Стоимость"}
                />
              </div>
            </div>
            <div className={"f f-align-2-2 translator-feed__constols"}>
              <svg
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
            </div>
          </div>
        ));
  }
}


class Reply extends React.Component {

  currentNumberOfChar({target: {value}}){
      console.log(value);
  }

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
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

  shouldComponentUpdate(nextProps, nextState){

    if( !deepEqual(this.state, nextState) || !deepEqual(this.props, nextProps) ){
      return true
    }
    console.log('not rerender')
    return false
  }

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

export default withRouter(Translator);
