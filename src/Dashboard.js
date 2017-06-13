import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import logo from './assets/logo.png';
import avatar from './assets/default-avatar.png';
import icon_arrow from './assets/arrow-down.png';
import icon_cost from './assets/cost-of-translation.png';
import icon_dur from './assets/duration-of-translation.svg';
import icon_letternum from './assets/letter-number.svg';
import icon_search from './assets/search.svg';
import sl from './assets/swap-lang.svg';
import copy from './assets/icon-copy.svg';
import './polyfill'
import { fakeAuth } from './index'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from 'react-router-dom';
import { createBrowserHistory } from 'history'
import { getUniqueKey, addClass, hasClass, removeClass, debounce, listener } from './utils';

import Select from 'react-select-plus';

import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';


// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select-plus/dist/react-select-plus.css';
import Batch from './components/Batch';
import Header from './components/Header';




function sleep(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
};


class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];

    this.list = this.list.bind(this)
    this.renders = 0
  }

  state = {
    redirectToReferrer: false,
    isTablet: false,
    items: []
  }

  switchPanel = (e) => {
    !hasClass(this.toggleElem, 'toggled') ? addClass(this.toggleElem, 'toggled') : removeClass(this.toggleElem, 'toggled');
  }

  componentWillMount() {
    this.listeners.push(
      listener(window, 'resize', debounce((e) => {
        let isTablet = e.target.innerWidth < 768 ? true : false;
        if (this.state.isTablet !== isTablet) this.setState({ isTablet })
      }, 200, false), false)
    );
    this.doAtDidMount.forEach(func => func());
  }

  async componentDidMount() {
    console.log('componentDidMount')
    while (1) {
      const prev = this.state.items
      const items = [`Hello World #${prev.length}`, ...prev]
      this.setState({ items })
      await sleep(Math.random() * 3000000)
    }
  }

  list() {
    const { items } = this.state

    return <div>
      <p>Count: {items.length}</p>
      <p>Renders: {this.renders++}</p>
      <ul>
        {items.map((v, i) => <li key={i}>{v}</li>)}
      </ul>
    </div>
  }

  componentWillUnmount() {
    this.listeners.forEach(removeEventListener => removeEventListener())
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
        contentFull: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
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

    return (
      <div className="f f-col outer dashboard-user">
        <Header />
        <div className="f h100">
          <div className="f f-align-2-2 outer-left">
            <div className="f sidebar">
              <Link to={'/dashboard/create'} className="f f-align-1-2 dashboard-user__create-tab" >
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
                  <Link to={`/dashboard/searching/${tab.uuid}`} className={`f f-align-1-2 dashboard-user__search-tab ${tab.uuid === activeSearch ? 'selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__search-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__search-tab-details">
                      <div className="dashboard-user__search-tab-title">{tab.title} </div>
                      <div className="dashboard-user__search-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f  f-col f-align-2-3 dashboard-user__search-tab-info">
                      <div className="dashboard-user__search-tab-info-time">
                        <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time></div>
                      <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
                      <div className="dashboard-user__search-tab-info-money">{tab.cost}</div>
                    </div>
                  </Link>
                )
              })}

              {Object.values(Users).map((tab, index) => {
                let publishTime = new Date(tab.publishTime);
                return (
                  <Link to={`/dashboard/user/${tab.uuid}`} className={`f f-align-1-2 dashboard-user__history-tab ${tab.uuid === activeTab ? 'selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                      <div className="dashboard-user__history-tab-title"> {tab.title} </div>
                      <div className="dashboard-user__history-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f f-col f-align-2-3 dashboard-user__history-tab-info">
                      <div className="dashboard-user__history-tab-info-time">
                        <Timer start={tab.startWorkingTime} duration={tab.duration} />
                        <time>{`${publishTime.getHours()}:${getFullMinutes(publishTime.getMinutes())}`}</time></div>
                      <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
                      <div className="dashboard-user__history-tab-info-money">{tab.cost}</div>
                    </div>
                  </Link>
                )
              })}

              <div className="f f-col">
                <p className="u-mb-4"> переключит? {(
                  this.state.isTablet ? (
                    <button className="btn btn-flat" onClick={debounce(this.switchPanel.bind(this), 500, false)} > переключит</button>
                  ) : (
                      null
                    )
                )}</p>
              </div>
            </div>
          </div>
          <div className="f outer-right" ref={n => this.toggleElem = n}>
            <div className="main f f-col f-align-2-2">
              <Switch>
                <RoutePassProps path="/dashboard/create" component={Create} currentDate={currentDate} />
                <RoutePassProps path="/dashboard/searching/:id" component={Search} currentDate={currentDate} />
                <RoutePassProps path="/dashboard/user/:id" component={UserFromHistory} currentDate={currentDate} />
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

const LangLabel = ({ from = 'Rus', to = 'Eng', selected = false, className = '' } = {}) => {
  return (
    <div className={`LangLabel  ${selected ? 'selected' : ''} ${className}`}>
      <span className="LangLabel-from" >{from}</span>
      <span className="LangLabel-to" >{to}</span>
    </div>
  )
}

const Timer = ({ start, duration, isBig = false } = {}) => {

  const percentage = ((new Date() - new Date(start))) / duration / 1000;
  console.log(percentage);
  const START = Math.PI * 0.5;
  const TAU = Math.PI * 2;
  const radius = isBig ? 7 : 5;
  //const percentage = .8;
  const targetX = radius - Math.cos(START + (percentage * TAU)) * radius;
  const targetY = radius - Math.sin(START - (percentage * TAU)) * radius;
  const largeArcFlag = percentage > 0.5 ? 1 : 0;
  const points = [
    // Top center.
    `M ${radius} 0`,

    // Arc are applied to whatever parcentage, swap flag equals 1 and I dont know what is mean. :)
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${targetX} ${targetY}`,

    // Back to the center.
    `L ${radius} ${radius}`,

    // Close path
    'Z'
  ];

  return (
    <svg className={`Timer ${isBig ? 'Timer-big' : ''}`} xmlns="http://www.w3.org/2000/svg">
      <path d={points.join(' ')} />
    </svg>
  )
}

class UserFromHistory extends React.Component { // !naming

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

    let { currentDate } = this.props
    let publishTime = new Date(currentDate.publishTime);
    return (
      <div className={'f f-col f-align-1-1 dashboard-user__history'}>
        <div className={'dashboard-user__date-delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
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
              <Inditator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(currentDate.duration)} hint={'Длительность перевода'} />
              <Inditator
                className={'f f-align-2-2'}
                icon={
                  <Timer
                    start={currentDate.startWorkingTime}
                    duration={currentDate.duration}
                    isBig={true} />
                }
                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)}
                hint={'Оставшееся время'} />
              <Inditator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
              <Inditator className={'f f-align-2-2'} icon={icon_cost} value={currentDate.cost} hint={'Стоимость'} />

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
            <textarea className={'dashboard-user__history-reply__content__text'} disabled value={currentDate.content} />
          </div>
          <div className={'dashboard-user__history-reply__constols'}>
            <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy}>
              <img src={copy} alt="copy" />
              <span>Копировать</span>

            </button>
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
            <textarea className={'dashboard-user__history-reply__content__text'} disabled value={currentDate.content} />
          </div>
          <div className={'dashboard-user__history-reply__constols'}>
            <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy} >
              <img src={copy} alt="copy" />
              <span>Копировать</span>
              <input type="hidden" value={currentDate.content} />
            </button>
          </div>
          <div className={'dashboard-user__history-post__date'}>
            {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
          </div>
        </div>

        <div className={'f f-align-1-1 f-gap-2 dashboard-user__history-create'}>
          <div className={'dashboard-user__history-reply__avatar'}></div>
          <Link to={'/dashboard/create'} className="f f-align-1-2 dashboard-user__history-create__content" >
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

  render() {

    let { currentDate } = this.props
    let publishTime = new Date(currentDate.publishTime);
    return (
      <div className={'f f-col f-align-1-1 dashboard-user__searching'}>
        <div className={'dashboard-user__date-delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
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
              <Inditator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(currentDate.duration)} hint={'Длительность перевода'} />
              <Inditator
                className={'f f-align-2-2'}
                icon={
                  <Timer
                    start={currentDate.startWorkingTime}
                    duration={currentDate.duration}
                    isBig={true} />
                }
                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)}
                hint={'Оставшееся время'} />
              <Inditator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
              <Inditator className={'f f-align-2-2'} icon={icon_cost} value={currentDate.cost} hint={'Стоимость'} />
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
    isSearchMenuTranslatorVisible: false
  }

  currentNumberOfChar(currentNumberOfChar) {
    this.setState({ currentNumberOfChar })
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
      valueTranslator, isSearchMenuTranslatorVisible } = this.state;
    return (
      <form ref={(n) => this.createFrom = n} className={'f f-col dashboard-user__create-forms'}>
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
            searchable={true}
            autosize={false}
            clearable={false}
            arrowRenderer={this.arrowElementLangs} />
          <div className={'dashboard-user__create-swaplang'} onClick={this.swapLang} ><img src={sl} alt="swap language" /></div>
          <Select
            ref={(n) => this.createLangTo = n}
            name="create[to]"
            autofocus
            options={optionsLang}
            simpleValue
            disabled={false}
            value={valueLangTo}
            onChange={this.updateValueLangTo}
            searchable={true}
            autosize={false}
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
          <StatefulEditor
            type="text"
            tabindex={1}
            name="create[posteditor]"
            placeholder={'Ваш запрос на перевод...'}
            currentNumberOfChar={this.currentNumberOfChar.bind(this)}
          />
        </div>
        <div className={'f f-align-1-2 f-row dashboard-user__create-bottombar f-gap-4'}>

          <Inditator className={'f f-align-2-2 '} icon={icon_dur} value={humanReadableTime(currentNumberOfChar * 1)} hint={'Длительность перевода'} />
          <Inditator className={'f f-align-2-2 '} icon={icon_letternum} value={currentNumberOfChar} hint={'Количество символов'} />
          <Inditator className={'f f-align-2-2 '} icon={icon_cost} value={`$${Number(0.05 * currentNumberOfChar).toFixed(2)}`} hint={'Стоимость перевода'} />

          <input type="submit" value='Отправить' className={'submit-post btn btn-primiry btn-mini '} />
        </div>
      </form>
    )


  }
}

const Inditator = ({ icon: Icon = false, value = '', hint = '', className = '' } = {}) => (
  <div className={`String-indicator ${className} `}>
    {(Icon === false) ? "" : ((typeof Icon === "string") ? <img src={Icon} alt={hint} /> : Icon)}
    <span>{value}</span>
  </div>
);

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Жырный', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Курсив', style: 'ITALIC' },
    { label: 'Подчеркнутый', style: 'UNDERLINE' }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Нормальный', style: 'unstyled' },
    { label: 'Большое заглявье', style: 'header-one' },
    { label: 'Средние заглявье', style: 'header-two' },
    { label: 'Маленькое заглявье', style: 'header-three' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: '', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' }
  ],
  HISTORY_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class1' },
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class2' }
  ]
};

class StatefulEditor extends Component {

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  letterNumber(value) {

    value = value.toString('html')
      .replace(/<.?\/?\b[^>]*>/gi, '') // strip html
      .replace(/\n/gi, '') // do not count new line
      .replace(/&nbsp;/gi, ' '); // space like one char

    if (this.props.currentNumberOfChar) {
      this.props.currentNumberOfChar(value.length)
    }
  }

  onChange = (value) => {
    this.setState({ value });
    debounce(this.letterNumber.bind(this, value), 1000, false)() //actually trottling, because dynamic args
  }

  render() {
    return (
      <RichTextEditor
        {...this.props}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        toolbarConfig={toolbarConfig}
      />
    );
  }
}


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
)


export default withRouter(DashBoard);



export function humanReadableTimeDiff(date) {
  var dateDiff = Date.now() - date;
  if (dateDiff <= 0 || Math.floor(dateDiff / 1000) == 0) {
    return 'now';
  }
  if (dateDiff < 1000 * 60) {
    return Math.floor(dateDiff / 1000) + 's';
  }
  if (dateDiff < 1000 * 60 * 60) {
    return Math.floor(dateDiff / (1000 * 60)) + 'm';
  }
  if (dateDiff < 1000 * 60 * 60 * 24) {
    return Math.floor(dateDiff / (1000 * 60 * 60)) + 'h';
  }
  return Math.floor(dateDiff / (1000 * 60 * 60 * 24)) + 'd';
}

export function humanReadableTime(date) {
  if (date <= 0 || Math.floor(date) == 0) {
    return '0'; // not sure
  }
  if (date < 60) {
    return Math.floor(date) + 'с ';
  }
  if (date < 60 * 60) {
    return Math.floor(date / 60) + 'м ' + humanReadableTime(date - Math.floor(date / 60) * 60);
  }
  if (date < 60 * 60 * 24) {
    return Math.floor(date / (60 * 60)) + 'ч ' + humanReadableTime(date - Math.floor(date / (60 * 60)) * 60 * 60);
  }
  return Math.floor(date / (60 * 60 * 24)) + 'д ' + humanReadableTime(date - Math.floor(date / (60 * 60 * 24)) * 60 * 60 * 24);
}
const getMounthName = (numberOfMonth) => {
  let Mounth = 'Янв';
  switch (numberOfMonth) {
    case (0):
      Mounth = 'Янв'
      break;
    case (1):
      Mounth = 'Фев'
      break;
    case (2):
      Mounth = 'Мрт'
      break;
    case (3):
      Mounth = 'Апр'
      break;
    case (4):
      Mounth = 'Май'
      break;
    case (5):
      Mounth = 'Июн'
      break;
    case (6):
      Mounth = 'Июл'
      break;
    case (7):
      Mounth = 'Авг'
      break;
    case (8):
      Mounth = 'Сен'
      break;
    case (9):
      Mounth = 'Окт'
      break;
    case (10):
      Mounth = 'Нбр'
      break;
    case (11):
      Mounth = 'Дек'
      break;
  }
  return Mounth
}
const getFullMinutes = (Minutes) => {
  return (('' + Minutes).length == 1) ? ('0' + Minutes) : Minutes
}