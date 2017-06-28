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


const Routes = {
    'root': {
        path: '/translator',
        exact: true,
    },
    'feed': {
        path: '/translator/feed',
        exact: false,
    },
    'common': {
        path: '/translator/feed/common',
        exact: false,
    },
    'personal': {
        path: '/translator/feed/personal',
        exact: false,
    },
    'history': {
        path: '/translator/history',
        exact: false,
        param: '/:id'
    },
    
    'reply': {
        path: '/translator/reply',
        exact: false,
        param: '/:id'
    }
}

class Translator extends React.Component {

    constructor(props) {
        super(props);
        this.listeners = [];
        this.doAtDidMount = [];

        this.list = this.list.bind(this)
        this.renders = 0

        this.boundRef = this.boundRef.bind(this);
    }

    state = {
        redirectToReferrer: false,
        items: [],
        isTablet: false,
        mainScreen: true,
        secondScreen: false,
        sidebar: false
    }

    componentWillMount() {
        this.doAtDidMount.forEach(func => func());

        // Responsive stuff
        this.listeners.push(
            listener(window, 'resize', debounce((e) => {
                let isTablet = e.target.innerWidth < 768 ? true : false;
                if (this.state.isTablet !== isTablet) this.setState({ isTablet })
            }, 200, false), false)
        );
        if(window.innerWidth < 768) {
            this.state.isTablet =  true;
        }
        // Responsive end
    }

    async componentDidMount() {
        console.log('componentDidMount')
        console.log(this.test)
        while (1) {
            const prev = this.state.items
            const items = [`Hello World #${prev.length}`, ...prev]
            this.setState({ items })
            await sleep(Math.random() * 3000000)
        }
        console.log(this)
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
    
    boundRef = (n) => this.test = n;

    componentWillReceiveProps(props){
        const { mainScreen, secondScreen } = this.props.location.state || { mainScreen: false, secondScreen: false }
         console.log('mainScreen');
        console.log(mainScreen);
         console.log('secondScreen');
        console.log(secondScreen);
        this.setState({mainScreen});
    }

    componentWillUnmount() {
        this.listeners.forEach(removeEventListener => removeEventListener())
    }

    render() {
        let { location: { pathname } } = this.props;
        let activeTabA = pathname.split('/');
        let activeTab = /reply/.test(pathname) && pathname.split('/')[activeTabA.length - 1] || false;
        let activeFeed = /feed/.test(pathname);
        let activeHistory = /history/.test(pathname) && pathname.split('/')[activeTabA.length - 1] || false;;

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
            },
            'wqtdsq': {
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
            'wqegsfgs': {
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
            },
            'wasdffeq': {
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
            'wasgfasrq': {
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
            },
            'wagsas': {
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
            'gasfrq': {
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
                isPersonal: false
            },
            'iytlk': {
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
            'wryhrjrrq': {
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
                isPersonal: false
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

        const HistoryObject = {
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

        let currentDate = activeTab ? find(inProgress, activeTab) :  activeHistory ? find(HistoryObject, activeHistory) :  activeFeed ? Feed : {};
        let {isTablet, sidebar, secondScreen, mainScreen} = this.state;
    
        Object.defineProperty(currentDate, 'isTablet', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: isTablet
        });


        return (
            <div className="f f-col outer translator">
                <Header />
                <div className="f h100">
                    <div ref={ this.boundRef } style={{display:`${!isTablet?'flex':sidebar?'flex':'none'}`}} className={`f f-align-2-2 outer-left__narrowed`}>
                        <div className="f sidebar">
                            <ul className="f f-align-1-1 f-col translator-menu">
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-1'} to={{pathname: Routes['feed'].path, state: {mainScreen: true}}} >
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}><img src={icon_posts} /></span>
                                    <span>Запросы</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>3</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-2'} to={{pathname:Routes['common'].path, state: {mainScreen: true}}} >
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}></span>
                                    <span>Общие</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>2</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-2'} to={{pathname:Routes['personal'].path, state: {mainScreen: true}}} >
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}></span>
                                    <span>Персональные</span>
                                    <span className={'f f-align-2-2 translator-menu__item__info'}>1</span>
                                </NavLink>
                                <NavLink className={'f f-align-1-2 translator-menu__item translator-menu__item__level-1'}to={{pathname:Routes['history'].path, state: {mainScreen: true}}} >
                                    <span className={'f f-align-2-2 translator-menu__item__icon'}><img src={icon_history} /></span>
                                    <span>История</span>
                                </NavLink>
                                <div className="translator-menu__delimiter"></div>
                            </ul>
                        </div>
                    </div>
                    <Route path={Routes['history'].path} render={() => (
                        <div ref={n => this.secondScreen = n }  style={{display:`${!isTablet?'flex':secondScreen?'flex':'none'}`}}  className="f f-align-2-2 outer-right__expanded">
                            <SideList List={HistoryObject} uuidOfActiveTab={activeTab} route={'history'} title="История" />
                            <DisplaySwitcher toggleElem={this.toggleElem}/>
                        </div>
                    )}
                    />
                    <Route ref={n => this.sidebar = n } path={Routes['reply'].path} render={() => (
                        <div ref={n => this.secondScreen = n }  style={{display:`${!isTablet?'flex':secondScreen?'flex':'none'}`}} className="f f-align-2-2 outer-left__expanded">
                            <SideList List={inProgress} uuidOfActiveTab={activeTab} route={'reply'}/>
                            <DisplaySwitcher toggleElem={this.toggleElem}/>
                        </div>
                    )}
                    />  
                    <Route path={Routes['root'].path} render={({ match }) => (
                        <div ref={n => this.mainScreen = n }  style={{display:`${!isTablet?'flex':mainScreen?'flex':'none'}`}} className={`f outer-main__expanded`} ref={n => this.toggleElem = n}>
                            <div className="main f f-col f-align-1-2">
                                <Switch>
                                    <RoutePassProps exact redirect={Routes['feed'].path} path={Routes['root'].path} component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps exact path={Routes['feed'].path} component={FeedList} currentDate={currentDate} personal/>
                                    <RoutePassProps exact path={Routes['common'].path} component={FeedList} currentDate={currentDate} common/>
                                    <RoutePassProps path={Routes['personal'].path} component={FeedList} currentDate={currentDate} />
                                    <RoutePassProps path={`${Routes['history'].path}${Routes['history'].param}`} component={HistoryList} currentDate={currentDate} />
                                    <RoutePassProps path={`${Routes['reply'].path}${Routes['reply'].param}`} component={Reply} currentDate={currentDate} />
                                </Switch>
                            </div>
                        </div>
                    )}
                    />
                    <Route path={Routes['feed'].path} render={() => (
                        <div ref={n => this.secondScreen = n }  style={{display:`${!isTablet?'flex':secondScreen?'flex':'none'}`}}  className="f f-align-2-2 outer-right__expanded">
                            <SideList List={inProgress} uuidOfActiveTab={activeTab} route={'reply'} linkBack={false}/>
                            <DisplaySwitcher toggleElem={this.toggleElem}/>
                        </div>
                    )}
                    />
                </div>
            </div>
        )
    }

}

class DisplaySwitcher extends React.Component {

    listeners = []
    state = {
        isTablet: false,
        mounted: false
    }

    componentWillMount() {

        this.setState({mounted: true})
        this.listeners.push(
            listener(window, 'resize', debounce((e) => {
                let isTablet = e.target.innerWidth < 768 ? true : false;
                if (this.state.isTablet !== isTablet) this.setState({ isTablet })
            }, 200, false), false)
        );
    }

    switchPanel = (e) => {
        !hasClass(this.props.toggleElem, 'toggled') ? addClass(this.props.toggleElem, 'toggled') : removeClass(this.props.toggleElem, 'toggled');
    }

    componentWillUnmount(){
        this.listeners.forEach(f => f())
    }

    render() {
        let {mounted, isTablet } = this.state;
        return (
            <div className="DisplaySwitcher f f-col">
                <p className="u-mb-4"> {(
                    (mounted && isTablet) ? (
                        <button className="btn btn-flat" onClick={debounce(this.switchPanel.bind(this), 500, false)} > переключит</button>
                    ) : (
                        null
                        )
                )}</p>
            </div>
        )
    }

}


const SideList = ({List, uuidOfActiveTab: activeTab, route, title = 'В работе', linkBack = true}) => {

    return (
        <div className="f sidebar">
            <div className="f f-align-1-2 translator-tab__topline">
                {linkBack && <Link to={Routes['feed'].path} className="f f-align-1-2 translator-tab__topline__back" ><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12"><path fill="#09f" d="M0 6l6-6 .76.82L1.6 6l5.15 5.18L6 12z" /></svg>Запросы</Link> }
                <span>{title}</span>
            </div>

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
                    <Link to={`${Routes[route].path}/${tab.uuid}`} className={`f f-align-1-2 translator-inwork__tab ${tab.uuid === activeTab ? 'selected' : ''}`} key={index}>
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
        </div>
    )
}



const RoutePassProps = ({ component: Component, redirect, ...rest }) => (
    !redirect ? (
        <Route  {...rest} render={props => (
            <Component  {...props} {...rest} />
        )} />):
     (<Redirect to={`${redirect}`} />)
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

const lcMatch = (q, s) => s && s.toLowerCase().indexOf(q.toLowerCase()) >= 0;


class Query {
    constructor(data, query){
        this.isNotExeed =  this.isNotExeed.bind(this);
        this.eqField =  this.eqField.bind(this);
        this.filter =  this.filter.bind(this);
        this.displayedCount = 0;
        this.data = data;
        this.query = query;

    }
    eqField = (fieldList, item, rule = "every") => {
        switch(rule){
        case('every'):
                return Object.values(fieldList).every(f => f.diactivate ? true: item[f.name] === f.equals)
        case('some'):
                return Object.values(fieldList).some(f => f.diactivate ? true: item[f.name] === f.equals)
        }
    }
    isNotExeed = (q, ind) => {
        if(q.perPage < 0) return true
        return (q.perPage * q.page - 1) >= this.displayedCount++;
    }

    filter = () =>
        Object.values(this.data).filter((item, idx) =>
     this.eqField(this.query['fielteredField'], item, this.query['fielteredFieldRule'] ) && this.isNotExeed(this.query, idx))

}



class FeedList extends React.Component {

    render() {
        let { currentDate, location: { pathname } } = this.props;
        let personal = /personal/.test(pathname) ;
        let common = /common/.test(pathname) ;
        let query = {
            perPage: (!personal && !common)? -1: 5,
            page: 1,
            fielteredField:{
                field1: {
                    name: "isPersonal",
                    equals: personal && !common, // personal and not common at one time 
                    diactivate: !personal && !common // is active
                }
            },
            fielteredFieldRule: "some" // some || every 
        }
        console.time('feedQuery');
        let FeedQuery = new Query(currentDate, query),
        filteredFeed =  FeedQuery.filter();
        console.timeEnd('feedQuery');
        console.log('isTablet');
        console.log(currentDate.isTablet);
        const RenderCollection = (renderItem) => {
            return (<div>{filteredFeed.map((feedData, index) => {
                let publishTime = new Date(feedData.publishTime);
                return (
                    renderItem(feedData, index, publishTime)
                )
            })
            }
            </div>
            )
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
                RenderCollection((feed, index, publishTime) => (
                    <div key={index} className={'f f-align-1-33 translator-feed u-my-2'}>
                        <div className={'translator-feed__avatar'}>
                            <img src={feed.avatar} alt={feed.nickname} />
                            { currentDate.isTablet && <div className={'translator-feed__content__topbar__name'}>{feed.nickname}</div> }
                            { currentDate.isTablet  && feed.isPersonal && <div className={'translator-feed__content__topbar__personal'}>персональный</div> }
                            { currentDate.isTablet && <div className={'translator-feed__content__topbar__date'}>
                                    {publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} - {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                                </div>
                            }
                        </div>
                        <div className={'f f-1-2 f-col translator-feed__content'}>
                            <div className={'f f-1-2 translator-feed__content__topbar'}>
                                { !currentDate.isTablet && <div className={'translator-feed__content__topbar__name'}>{feed.nickname}</div>}
                                { !currentDate.isTablet && feed.isPersonal  && <div className={'translator-feed__content__topbar__personal'}>персональный</div>}
                                { !currentDate.isTablet && <div className={'translator-feed__content__topbar__date'}>
                                    {publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} - {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                                </div>
                                }
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 28 24"><path fill="#9ca9b2" d="M26.22 0L8.64 20.74l-7.39-6.9L0 15.17l8.1 7.53.71.65.59-.71L27.59 1.16z" /></svg>
                        </div>
                    </div>
                ))
        )
    }
}



class HistoryList extends React.Component {

    render() {

        let { currentDate } = this.props
        let publishTime = new Date(currentDate.publishTime);
        return (
            <div className={'f f-col f-align-1-1 translator-history'}>
                <div className={'data__delimiter'}>{publishTime.getDate()} {getMounthName(publishTime.getMonth())}, {publishTime.getFullYear()} </div>
                <div className={'f f-align-1-1 f-gap-2 translator-history-post '}>
                    <div className={'translator-history-post__avatar'}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={'translator-history-post__content'}>
                        <div className={'translator-history-post__content__text'}>
                            {currentDate.content}
                        </div>
                        <div className={'f f-align-1-2 f-gap-4 translator-history-post__content__bottombar'}>
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
                    <div className={'translator-history-post__constols'}>
                    </div>
                    <div className={'translator-history-post__date'}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                </div>

                <div className={'f f-align-1-1 f-gap-2 translator-history-reply'}>
                    <div className={'translator-history-reply__avatar'}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={'translator-history-reply__content'}>
                        <textarea className={'translator-history-reply__content__text'} disabled value={currentDate.content} />
                    </div>
                    <div className={'translator-history-reply__constols'}>
                        <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy}>
                            <img src={copy} alt="copy" />
                            <span>Копировать</span>

                        </button>
                    </div>
                    <div className={'translator-history-post__date'}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
                    </div>
                </div>
                <div className={'f f-align-1-1 f-gap-2 translator-history-reply'}>
                    <div className={'translator-history-reply__avatar'}>
                        <img src={currentDate.avatar} alt={currentDate.nickname} />
                    </div>
                    <div className={'translator-history-reply__content'}>
                        <textarea className={'translator-history-reply__content__text'} disabled value={currentDate.content} />
                    </div>
                    <div className={'translator-history-reply__constols'}>
                        <button className={'btn btn-primiry btn-mini f f-align-2-2'} onClick={this.copy} >
                            <img src={copy} alt="copy" />
                            <span>Копировать</span>
                            <input type="hidden" value={currentDate.content} />
                        </button>
                    </div>
                    <div className={'translator-history-post__date'}>
                        {publishTime.getHours()}:{getFullMinutes(publishTime.getMinutes())}
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


export default withRouter(Translator);