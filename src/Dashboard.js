import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import logo from './assets/logo.png';
import avatar from './assets/default-avatar.png';
import icon_arrow from './assets/arrow-down.png';
import icon_cost from  './assets/cost-of-translation.png';
import icon_dur from  './assets/duration-of-translation.svg';
import icon_letternum from  './assets/letter-number.svg';

import sl from './assets/swap-lang.svg';
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

const Header = () => (
  <header className="f dashboard-user__header">
    <div className="f f-align-2-2 header-logo">
      <Link to={'/'} ><img src={logo} alt="Textra" /> </Link>
    </div>
    <ul className="f f-align-2-2 header-menu">
      <NavLink className={'active'} to={'/'} >Рабочий стол</NavLink>
      <NavLink to={'/about'}>О нас</NavLink>
      <NavLink to={'/help'}>Поддержка</NavLink>
    </ul>
    <div className="f f-align-2-2 header-account">
      <div className="f f-col f-align-1-3 header-details">
        <div className="header-email">mikehanser@gmail.com</div>
        <div className="header-details__more">
          <Link to={'/'} className="header-replenish">пополнить</Link>
          <span className="header-balance">$0.91</span>
        </div>
      </div>
      <div className="f f-align-2-2 header-avatar">
        <figure className="f f-align-2-2 header-avatar__in"> <img src={avatar} alt="Textra" /> </figure>
        <div className="header-logout">Выйти</div>
      </div>
    </div>
  </header>
);



const NavLink = (props) => (
  <li >
    <Link {...props} />
  </li>
)

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

    const START = Math.PI * 0.5;
    const TAU = Math.PI * 2;
    const radius = 5;
    const percentage = .8;
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

    const Searching = {
      'wqefeq': {
        uuid: 'wqefeq',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        publishTime: (new Date).toISOString(),
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
        from: 'ENG',
        to: 'CHN',
        cost: '$11.33'
      }
    }
    const Tabs = {
      'wqefeq': {
        uuid: 'alex',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        contentFull: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        opened: false,
        publishTime: (new Date).toISOString(),
        startTime: '12:32',
        from: 'RUS',
        to: 'ENG',
        cost: '$0.33'
      },
      'wqerq': {
        uuid: 'alex_alex',
        avatar: avatar,
        title: 'Создать запрос на перевод',
        content: 'Создать запрос на перевод',
        contentFull: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
        publishTime: (new Date).toISOString(),
        startTime: '12:32',
        duration: '12мин',
        opened: false,
        from: 'ENG',
        to: 'CHN',
        cost: '$11.33'
      }
    }

    const find = (objs, id) => Object.values(objs).find(o => o.uuid == id)

    let currentDate = activeTab ? find(Tabs, activeTab) : activeSearch ? find(Searching, activeSearch) : {};

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
                  <Link to={`/dashboard/searching/${tab.uuid}`} className={`f f-align-1-2 dashboard-user__search-tab ${tab.uuid === activeSearch ? 'dashboard-user__search-tab-selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__search-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__search-tab-details">
                      <div className="dashboard-user__search-tab-title">{tab.title} </div>
                      <div className="dashboard-user__search-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f  f-col f-align-2-2 dashboard-user__search-tab-info">
                      <div className="dashboard-user__search-tab-info-time">

                        <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time></div>
                      <div className="dashboard-user__search-tab-info-lang">
                        <span className="dashboard-user__search-tab-info-lang-from" >{tab.from}</span>
                        <span className="dashboard-user__search-tab-info-lang-to" >{tab.to}</span>
                      </div>
                      <div className="dashboard-user__search-tab-info-money">{tab.cost}</div>
                    </div>
                  </Link>
                )
              })}

              {Object.values(Tabs).map((tab, index) => {
                let publishTime = new Date(tab.publishTime);
                return (
                  <Link to={`/dashboard/user/${tab.uuid}`} className={`f f-align-1-2 dashboard-user__history-tab ${tab.uuid === activeTab ? 'dashboard-user__history-tab-selected' : ''}`} key={index}>
                    <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                    <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                      <div className="dashboard-user__history-tab-title"> {tab.title} </div>
                      <div className="dashboard-user__history-tab-content"> {tab.content}</div>
                    </div>
                    <div className="f f-col f-align-2-2 dashboard-user__history-tab-info">
                      <div className="dashboard-user__history-tab-info-time">
                        <svg xmlns="http://www.w3.org/2000/svg">
                          <path d={points.join(' ')} />
                        </svg>
                        <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time></div>
                      <div className="dashboard-user__history-tab-info-lang">
                        <span className="dashboard-user__history-tab-info-lang-from" >{tab.from}</span>
                        <span className="dashboard-user__history-tab-info-lang-to" >{tab.to}</span>
                      </div>
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
            <div className="main f f-col  f-align-2-2">
              <Switch>
                <RoutePassProps path="/dashboard/create" component={Create} currentDate={currentDate}/>
                <RoutePassProps path="/dashboard/searching/:id" component={Create} currentDate={currentDate} />
                <RoutePassProps path="/dashboard/user/:id" component={User} currentDate={currentDate} />
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


class Create extends React.Component {
    constructor(props){
      super(props);
      this.cleanInput = this.cleanInput.bind(this);
    }
    state = {
        multi: true,
        multiValue: [],
        options: [
            { value: 'Eng', label: 'Английский' },
            { value: 'Rus', label: 'Русский' },
        ],
        value: undefined,
        currentNumberOfChar: 0
    }

    currentNumberOfChar(currentNumberOfChar){
      this.setState({currentNumberOfChar})
    }

    handleOnChange (value) {
      const { multi } = this.state;
      if (multi) {
        this.setState({ multiValue: value });
      } else {
        this.setState({ value });
      }
    }

    cleanInput(inputValue) {
    // Strip all non-number characters from the input
      return inputValue.replace(/[^0-9]/g, "");
    }   

    render() {

        const { multi, multiValue, options, value, currentNumberOfChar } = this.state;
        console.log(options);
        return (
          <form className={'f f-col dashboard-user__create-forms'}>
              <div className={'dashboard-user__create-topbar f f-align-1-2 f-row f-gap-4'}>
              <Select 
                    ref="create-from"
                    name="create[from]"
                    autofocus
                    options={options} 
                    onInputChange={this.cleanInput}
                    disabled={false} 
                    value={value || 'Rus'} 
                    onChange={this.updateValue} 
                    searchable={true} />
              <div className={'dashboard-user__create-swaplang'}><img src={sl} alt="swap language"/></div>
              <Select 
                    ref="create-to"
                    name="create[to]"
                    autofocus
                    options={options} 
                    simpleValue 
                    disabled={false} 
                    value={value || 'Eng'} 
                    onChange={this.updateValue} 
                    searchable={true} />
    
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

                <Inditator icon={icon_dur} value={humanReadableTime(currentNumberOfChar*1)} hint={'Длительность перевода'}/>
                <Inditator icon={icon_letternum} value={currentNumberOfChar} hint={'Количество символов'}/>
                <Inditator icon={icon_cost} value={`$${Number(0.05*currentNumberOfChar).toFixed(2) }`} hint={'Стоимость перевода'}/>

                <input type="submit" value='Отправить' className={'submit-post btn btn-primiry btn-mini '} />
              </div>
            </form>
        )


    }
}
const Inditator = ({icon, value, hint }) => (
  <div className={'f f-align-2-2 dashboard-user__create-bottombar__indicator'}>
    <img src={icon} alt={hint} />
    <span>{value}</span>
  </div>
);

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_DROPDOWN: [
    {label: 'Normal', style: 'unstyled'},
    {label: 'Heading Large', style: 'header-one'},
    {label: 'Heading Medium', style: 'header-two'},
    {label: 'Heading Small', style: 'header-three'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ],
  HISTORY_BUTTONS: [
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class1'},
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class2'}
  ]
};

class StatefulEditor extends Component {

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  letterNumber(value){
    
    value = value.toString('html')
                    .replace(/<.?\/?\b[^>]*>/gi,'') // strip html
                    .replace(/\n/gi,'') // do not count new line
                    .replace(/&nbsp;/gi,' '); // space like one char

    if(this.props.currentNumberOfChar){
      this.props.currentNumberOfChar(value.length)
    }
  }

  onChange = (value) => {
    this.setState({value});
    debounce(this.letterNumber.bind(this, value), 1000, false)() //actually trottling, because dynamic args
  }

  render () {
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

const User = ({ match }) => (
  <div>
    <h3>ID: {match.params.id}</h3>
  </div>
)
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
  if (date <= 0 || Math.floor(date  ) == 0) {
    return '0';
  }
  if (date <  60) {
    return Math.floor(date)  + 'с';
  }
  if (date <  60 * 60) {
    return Math.floor(date / 60) + 'м' + humanReadableTime(date - Math.floor(date / 60) * 60);
  }
  if (date <  60 * 60 * 24) {
    return Math.floor(date / ( 60 * 60)) + 'ч' + humanReadableTime(date - Math.floor(date / ( 60 * 60) ) * 60 * 60);
  }
  return Math.floor(date / ( 60 * 60 * 24)) + 'д' + humanReadableTime(date - Math.floor(date / ( 60 * 60 * 24) ) * 60 * 60 * 24);
}