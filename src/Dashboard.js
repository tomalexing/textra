import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style/app.css';
import './style/index.css';
import logo from './assets/logo.png';
import avatar from './assets/default-avatar.png';
import { fakeAuth } from './index'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { createBrowserHistory } from 'history'
import { getUniqueKey, addClass, hasClass, removeClass, debounce, listener } from './utils';



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

const Protected = () => <h3>Protected</h3>


const NavLink = (props) => (
  <li >
    <Link {...props} />
  </li>
)

export default class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.listeners = [];
    this.doAtDidMount = [];
  }

  state = {
    redirectToReferrer: false,
    isTablet: false
  }

  switchPanel = (e) => {
    !hasClass(this.toggleElem, 'toggled') ? addClass(this.toggleElem, 'toggled'): removeClass(this.toggleElem, 'toggled');
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

  componentDidMount() {
    console.log('componentDidMount')

  }

  componentWillUnmount() {
    this.listeners.forEach(removeEventListener => removeEventListener())
  }

  render() {
    const START = Math.PI * 0.5;
    const TAU = Math.PI * 2;
    const radius = 6;
    const percentage = .8;
    const targetX = radius - Math.cos(START + (percentage * TAU)) * radius;
    const targetY = radius - Math.sin(START - (percentage * TAU)) * radius;
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    const points = [
      // Top center.
      `M ${radius} 0`,

      // Arc round to wherever the percentage implies.
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${targetX} ${targetY}`,

      // Back to the center.
      `L ${radius} ${radius}`,
      
      'Z'
    ];

    const Tabs=[
      {
      '1':{
        name: ''
      }
      }

    ]

    return (
      <div className="f f-col outer dashboard-user">
        <Header/>
        <div className="f h100">
          <div className="f f-align-2-2 outer-left">
            <div className="f sidebar">
              <Link to={'/dashboard/create'} className="f f-align-1-2 dashboard-user__create-tab" >
                <div className="dashboard-user__create-tab-plus">
                </div>
                 <div className="dashboard-user__create-tab-content">Создать запрос на перевод
                </div>
              </Link>
              <Link to={'/dashboard/searching'} className="f f-align-1-2 dashboard-user__search-tab" >
                 <figure className="f f-align-2-2 dashboard-user__search-tab-avatar"> <img src={avatar} alt="Textra" /> </figure>
                 <div className="f f-col f-align-1-1 dashboard-user__search-tab-details">
                   <div className="dashboard-user__search-tab-title"> Создать запрос на перевод </div>
                    <div className="dashboard-user__search-tab-content"> Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна перевод</div>
                </div>
                <div className="f  f-col f-align-2-2 dashboard-user__search-tab-info">
                  <div className="dashboard-user__search-tab-info-time">
                  
                  <time>12.03.12</time></div>
                  <div className="dashboard-user__search-tab-info-lang">
                    <span className="dashboard-user__search-tab-info-lang-from" >RUS</span>
                    <span className="dashboard-user__search-tab-info-lang-to" >ENG</span>
                  </div>
                  <div className="dashboard-user__search-tab-info-money">$0.33</div>
                </div>
              </Link>

              <Link to={'/dashboard/alex'} className="f f-align-1-2 dashboard-user__history-tab" >
                 <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={avatar} alt="Textra" /> </figure>
                 <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                   <div className="dashboard-user__history-tab-title"> Создать запрос на перевод </div>
                    <div className="dashboard-user__history-tab-content"> Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна перевод</div>
                </div>
                <div className="f  f-col f-align-2-2 dashboard-user__history-tab-info">
                  <div className="dashboard-user__history-tab-info-time">
                    <svg xmlns="http://www.w3.org/2000/svg"> 
                     <path d={points.join(' ')}/>
                
                  </svg>
                  <time>13:17</time></div>
                  <div className="dashboard-user__history-tab-info-lang">
                    <span className="dashboard-user__history-tab-info-lang-from" >RUS</span>
                    <span className="dashboard-user__history-tab-info-lang-to" >ENG</span>
                  </div>
                  <div className="dashboard-user__history-tab-info-money">$0.33</div>
                </div>
              </Link>

              <Link to={'/dashboard/alex_alex'} className="f f-align-1-2 dashboard-user__history-tab dashboard-user__history-tab-selected" >
                 <figure className="f f-align-2-2 dashboard-user__history-tab-avatar"> <img src={avatar} alt="Textra" /> </figure>
                 <div className="f f-col f-align-1-1 dashboard-user__history-tab-details">
                   <div className="dashboard-user__history-tab-title"> Создать запрос на перевод </div>
                    <div className="dashboard-user__history-tab-content"> Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна перевод</div>
                </div>
                <div className="f  f-col f-align-2-2 dashboard-user__history-tab-info">
                  <div className="dashboard-user__history-tab-info-time">
                    <svg xmlns="http://www.w3.org/2000/svg"> 
                     <path d={points.join(' ')}/>
                
                  </svg>
                  <time>13:17</time></div>
                  <div className="dashboard-user__history-tab-info-lang">
                    <span className="dashboard-user__history-tab-info-lang-from" >RUS</span>
                    <span className="dashboard-user__history-tab-info-lang-to" >ENG</span>
                  </div>
                  <div className="dashboard-user__history-tab-info-money">$0.33</div>
                </div>
              </Link>
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
            <div className="main f f-col f-fill f-align-2-2 u-text-undecor" >
                <Router>
                  <Route render={({ location }) => (
                          <div>
                          <Route path="/dashboard/create" component={Protected} location={location}  key={getUniqueKey()}/>
                          <Route path="/dashboard/alex" component={Protected} location={location}  key={getUniqueKey()}/>
                          </div>
                  )}/>
              </Router>
            </div>
          </div>
        </div>
      </div>
   )
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


