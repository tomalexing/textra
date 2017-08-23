// @flow
import React from 'react';
const util = {};


export class Lazy extends React.Component {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null
  }

  componentWillMount() {
    this.load(this.props)
  }

 componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    props.load().then((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    let {load , ...rest} = this.props;
    return  React.createElement('div', null, this.state.mod && React.createElement(this.state.mod, rest, null))
  }
}


export const dump = (props) => Object.keys(props).map((prop, i) => <pre style={{'paddingLeft': '10px'}}key={i}>{prop + ':'} {(typeof props[prop] === "object"  ? dump(props[prop])  : props[prop])  }</pre> )

export const getUniqueKey = (key = '') => {
  return `${key?key+'-':''}${~~(Math.random()*1000)}_${~~(Math.random()*1000)}`
}


export function removeClass(element, className){
  if ( element.classList)
    element.classList.remove(className)
  else
    element.className = element.className
      .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1')
      .replace(/\s+/g, ' ')
      .replace(/^\s*|\s*$/g, '');
}

export function addClass(element, className){
  if ( element.classList)
    element.classList.add(className)
  else if ( !hasClass(element))
    element.className = element.className + ' ' + className
}

export function hasClass(element, className) {
  if ( element.classList)
    return !!className && element.classList.contains(className)
  else
    return ` ${element.className} `.indexOf(` ${className} `) !== -1
}

export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export function delegate(target, type, selector, handler, capture = false, once = false) {
    const dispatchEvent = (event) => {
        // console.time('delegate');
        let targetElement = event.target;
        while (targetElement && targetElement !== target ) {
        if ( typeof targetElement.matches == 'function' && targetElement.matches(selector)) {
            event.delegateTarget = event.delegateTarget || targetElement;
            handler.call(this, event);
            break;
        }
        targetElement = targetElement.parentNode;
        }
        // console.timeEnd('delegate');
    };

    target.addEventListener(type, dispatchEvent, !!capture);

    return () => target.removeEventListener(type, dispatchEvent, {capture: !!capture, once: !!once});

};

export function listener(target, type, handler, capture) {
    const dispatchEvent = (event) => {
        handler.call(this, event);
    };

    target.addEventListener(type, dispatchEvent, !!capture);

    return () => target.removeEventListener(type, dispatchEvent, !!capture);

};

export function sleep(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
};

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

    try{
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
    } catch(e){
        return '';
    }
}
export const getMonthName = (month) => {
  let months = ['Янв','Фев','Мрт','Апр','Май','Июн','Июл','Авг','Сен','Окт','Нбр','Дек'];
  return months[ month || 0 ];
}

export const getFullTimeDigits = (Minutes) => {
  return (('' + Minutes).length == 1) ? ('0' + Minutes) : Minutes
}
export const getDayName = (day) => {
  let days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  return days[ day || 0 ];

}

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
export function quickSort(items, left, right, item, comporator) {

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




util.listener = listener
util.delegate = delegate
util.removeClass = removeClass
util.hasClass = hasClass
util.addClass = addClass
util.debounce = debounce
util.dump = dump
util.Lazy = Lazy
util.sleep = sleep
util.humanReadableTime = humanReadableTime
util.getFullTimeDigits = getFullTimeDigits
util.getDayName = getDayName
util.getMonthName = getMonthName
util.quickSort = quickSort
export default util 