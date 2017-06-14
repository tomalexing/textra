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
import icon_posts from './assets/icon-posts.svg';
import icon_history from './assets/icon-history.svg';

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
import {
    getUniqueKey,
    addClass,
    hasClass,
    removeClass,
    debounce,
    listener,
    sleep,
    humanReadableTime,
    getMounthName,
    getFullMinutes
} from './utils';

import Batch from './components/Batch';

import Header, { NavLink } from './components/Header';

import Test from './Test'
import Timer from './components/Timer'
import LangLabel from './components/LangLabel'
import StatefulEditor from './components/StatefulEditor'
import Indicator from './components/Indicator';

class Translator extends React.Component {

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
        let activeTab = /reply/.test(pathname) && pathname.split('/')[activeTabA.length - 1] || false;
        let activeFeed = /feed/.test(pathname);

        let Feed = {
            'wqefeq': {
                uuid: 'wqefeq',
                nickname: 'alex',
                avatar: avatar,
                title: 'Создать запрос на перевод',
                content: 'Создать запрос на перевод Создатьзапросна переводСоздать запроснапереводСоздать запросна d',
                publishTime: (new Date).toISOString(),
                startWorkingTime: (new Date(new Date - 1000000)).toISOString(),
                duration: 1341,
                letterNumber: 213,
                from: 'RUS',
                to: 'ENG',
                cost: '$0.33',
                isPersonal: false
            },
            'wqerq': {
                uuid: 'wqerq',
                nickname: 'alex_alexexe',
                avatar: avatar,
                title: 'Создать запрос на перевод',
                content: 'Создать запрос на перевод',
                publishTime: (new Date).toISOString(),
                startWorkingTime: (new Date).toISOString(),
                duration: 431241,
                letterNumber: 123,
                from: 'ENG',
                to: 'CHN',
                cost: '$11.33',
                isPersonal: true
            }
        }
        // Feed = {
            
        // }

        const inProgress = {
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
                duration: 24441,
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

        let currentDate = activeTab ? find(inProgress, activeTab) : activeFeed ? Feed : {};
        return (
            <div className="f f-col outer translator">
                <Header />
                <div className="f h100">
                    <div className="f f-align-2-2 outer-left__narrowed">
                        <div className="f sidebar">
                            <ul className="f f-align-1-1 f-col translator-menu">
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-1 active'} to={'/translator/feed'} >
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}><img src={icon_posts} /></span>
                                    <span>Запросы</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>3</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-2'} to={'/translator/feed/all'}>
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}></span>
                                    <span>Общие</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>2</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-2'} to={'/translator/feed/personal'}>
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}></span>
                                    <span>Персональные</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>1</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-1'} to={'/translator/hisroty'}>
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}><img src={icon_history} /></span>
                                    <span>История</span>
                                </NavLink>
                                <div className="translator-menu__delimiter"></div>
                            </ul>
                        </div>
                    </div>
                    <Route path="/translator/reply" render={() => (
                        <div className="f f-align-2-2 outer-left__narrowed">
                            <div className="f sidebar">
                                <div className="f f-align-1-2 translator-tab__topline">
                                    <Link to={'/translator/feed'} className="f f-align-1-2 translator-tab__topline__back" ><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12"><path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" /></svg>Запросы</Link>
                                    <span>В работе</span>
                                </div>

                                {/*<Batch
                flushCount={10}
                flushInterval={150}
                count={this.state.items.length}
                render={this.list}
                debug
              />*/}

                                {Object.values(inProgress).map((tab, index) => {
                                    let publishTime = new Date(tab.publishTime);
                                    return (
                                        <Link to={`/translator/reply/${tab.uuid}`} className={`f f-align-1-2 translator-inwork__tab ${tab.uuid === activeTab ? 'selected' : ''}`} key={index}>
                                            <figure className="f f-align-2-2 translator-inwork__tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                                            <div className="f f-col f-align-1-1 translator-inwork__tab-details">
                                                <div className="translator-inwork__tab-title">{tab.title} </div>
                                                <div className="translator-inwork__tab-content"> {tab.content}</div>
                                            </div>
                                            <div className="f f-col f-align-2-3 translator-inwork__tab-info">
                                                <div className="translator-inwork__tab-info__time">
                                                    <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time>
                                                </div>
                                                <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
                                                <div className="translator-inwork__tab-info__duration">{humanReadableTime(tab.duration)}</div>
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
                    )}
                    />


                    <Route path="/translator/" render={({ match }) => (
                        <div className={`f outer-main__expanded`} ref={n => this.toggleElem = n}>
                            <div className="main f f-col f-align-1-2">
                                <Switch>
                                    <RoutePassProps exact path="/translator" component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps path="/translator/feed" component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps path="/translator/feed/all" component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps path="/translator/feed/personal" component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps path="/translator/history" component={Reply} currentDate={currentDate} />
                                    <RoutePassProps path="/translator/reply/:id" component={Reply} currentDate={currentDate} />
                                </Switch>
                            </div>
                        </div>
                    )}
                    />
                    <Route path="/translator/feed" render={() => (
                        <div className="f f-align-2-2 outer-right__narrowed">
                            <div className="f sidebar">
                                <div className="f f-align-1-2 translator-tab__topline">
                                    <Link to={'/translator/feed'} className="f f-align-1-2 translator-tab__topline__back" ><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12"><path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" /></svg>Запросы</Link>
                                    <span>В работе</span>
                                </div>

                                {/*<Batch
                        flushCount={10}
                        flushInterval={150}
                        count={this.state.items.length}
                        render={this.list}
                        debug
                        />*/}

                                {Object.values(inProgress).map((tab, index) => {
                                    let publishTime = new Date(tab.publishTime);
                                    return (
                                        <Link to={`/translator/reply/${tab.uuid}`} className={`f f-align-1-2 translator-inwork__tab ${tab.uuid === activeTab ? 'selected' : ''}`} key={index}>
                                            <figure className="f f-align-2-2 translator-inwork__tab-avatar"> <img src={tab.avatar} alt="Textra" /> </figure>
                                            <div className="f f-col f-align-1-1 translator-inwork__tab-details">
                                                <div className="translator-inwork__tab-title">{tab.title} </div>
                                                <div className="translator-inwork__tab-content"> {tab.content}</div>
                                            </div>
                                            <div className="f f-col f-align-2-3 translator-inwork__tab-info">
                                                <div className="translator-inwork__tab-info__time">
                                                    <time>{`${publishTime.getHours()}:${publishTime.getMinutes()}`}</time></div>
                                                <LangLabel from={tab.from} to={tab.to} selected={tab.uuid === activeTab} />
                                                <div className="translator-inwork__tab-info__duration">{humanReadableTime(tab.duration)}</div>
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
                    )}
                    />
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



class Reply extends React.Component {

    render() {
        let { currentDate } = this.props
        let publishTime = new Date(currentDate.publishTime);
        return (
            <div className={'f f-col f-align-1-1 translator-replypost'}>
                <div className={'data__delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
                <div className={'f f-align-1-1 translator-post '}>
                    <div className={'translator-post__content'}>
                        <div className={'translator-post__content__text'}>
                            {currentDate.content}
                        </div>
                        <div className={'f f-align-1-2 f-gap-4 translator-post__content__bottombar'}>
                            <LangLabel from={currentDate.from} to={currentDate.to} />
                            <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(currentDate.duration)} hint={'Длительность перевода'} />
                            <Indicator
                                className={'f f-align-2-2'}
                                icon={
                                    <Timer
                                        start={currentDate.startWorkingTime}
                                        duration={currentDate.duration}
                                        isBig={true} />
                                }
                                value={humanReadableTime(currentDate.duration - (new Date - new Date(currentDate.startWorkingTime)) / 1000)}
                                hint={'Оставшееся время'} />
                            <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={currentDate.letterNumber} hint={'Количество символов'} />
                            <Indicator className={'f f-align-2-2'} icon={icon_cost} value={currentDate.cost} hint={'Стоимость'} />

                        </div>
                    </div>
                    <div className={'translator-post__date'}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                </div>
                <div className={'translator-reply'}>
                    <StatefulEditor
                        className={'translator-reply__editor'}
                        type="text"
                        tabindex={1}
                        name="create[posteditor]"
                        placeholder={'Ваш запрос на перевод...'}

                    />
                    <div className={'translator-reply__sent u-mt-3'}>
                        <button className={'btn btn-mini btn-primiry'}>Отправить</button>
                    </div>
                </div>
            </div>
        )
    }
}



class FeedList extends React.Component {

    render() {
        let { currentDate } = this.props;
        console.log(currentDate);
        const RenderColection = (renderItem) => {
            return (<div>{Object.values(currentDate).map((feedData, index) => {
                let publishTime = new Date(feedData.publishTime);
                return (
                   renderItem(feedData, index, publishTime)
                )
            })
            }
            </div>)
        }
        return (
            (Object.entries(currentDate).length === 0) ?
            <div className={'f f-align-2-33 translator-feed u-my-2'}>
                    <div className={'translator-feed__avatar'}>
                        <img src={avatar} />
                    </div>
                    <div className={'f f-align-2-2 translator-feed__placeholder'}>
                        <span>Запросы на перевод отсутствуют</span>
                    </div>
                </div>
            :
            RenderColection((feed, index, publishTime) => (
                <div key={index} className={'f f-align-1-33 translator-feed u-my-2'}>
                    <div className={'translator-feed__avatar'}>
                        <img src={feed.avatar} alt={feed.nickname} />
                    </div>
                    <div className={'f f-1-2 f-col translator-feed__content'}>
                        <div className={'f f-1-2 translator-feed__content__topbar'}>
                            <div className={'translator-feed__content__topbar__name'}>{feed.nickname}</div>
                            {feed.isPersonal && <div className={'translator-feed__content__topbar__personal'}>персональный</div> }
                            <div className={'translator-feed__content__topbar__date'}>
                                {publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} - {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                            </div>
                        </div>
                        <div className={'translator-feed__content__text'}>
                            {feed.content}
                        </div>
                        <div className={'f f-align-1-2 f-gap-4 translator-feed__content__bottombar'}>
                            <LangLabel from={feed.from} to={feed.to} />
                            <Indicator className={'f f-align-2-2'} icon={icon_dur} value={humanReadableTime(feed.duration)} hint={'Длительность перевода'} />
                            <Indicator
                                className={'f f-align-2-2'}
                                icon={
                                    <Timer
                                        start={feed.startWorkingTime}
                                        duration={feed.duration}
                                        isBig={true} />
                                }
                                value={humanReadableTime(feed.duration - (new Date - new Date(feed.startWorkingTime)) / 1000)}
                                hint={'Оставшееся время'} />
                            <Indicator className={'f f-align-2-2'} icon={icon_letternum} value={feed.letterNumber} hint={'Количество символов'} />
                            <Indicator className={'f f-align-2-2'} icon={icon_cost} value={feed.cost} hint={'Стоимость'} />
                        </div>
                    </div>
                    <div className={'f f-align-2-2 translator-feed__constols'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 28 24"><path fill="#9ca9b2" d="M26.22 0L8.64 20.74l-7.39-6.9L0 15.17l8.1 7.53.71.65.59-.71L27.59 1.16z"/></svg>
                    </div>
                </div>
            ))
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


export default withRouter(Translator);