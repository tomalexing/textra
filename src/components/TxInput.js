import React from 'react';
import PropTypes from 'prop-types';
import { debounce, listener} from './../utils';
import {EventEmitter} from 'events';
import warningMark from './../assets/warning.svg';

var EventEmitterSingleton = (function () { 
    var instance;
    var events = [];
    function createInstance() {
        var emitter = new EventEmitter()
        return emitter;
    }


    /**
     * @return {Array}
     */
    function getEvents(start = '', remove = false) {

      if (start === '') return []
      let eventsName = events.reduce((acc, e, currentIndex) => {
        switch(typeof e){
          case("object"): 
            let name  = Object.entries(e)[0][0];
            if(name.startsWith(start)){
              if( remove ) events.splice(currentIndex,1);
              return acc.concat(name)
            }else{
              return acc
            }
          case("string"): 
            if(e.startsWith(start)){
              if( remove ) events.splice(currentIndex,1);
              return acc.concat(e)
            }else{
              return acc
            }
        }
      }, [])
      return eventsName;
    }

    /**
     * @return {Array}
     */
    function getAllEvents() {

      let eventsName = events.reduce((acc, e) => {
        switch(typeof e){
          case("object"): 
            let name  = Object.entries(e)[0][0];
            return acc.concat(name)
          case("string"): 
            return acc.concat(e)
        }
      }, [])
      return eventsName;
    }
    /**
     * @return {Bool|String}
     */
    function getLastMessageFromEvent(searchName) {
      let eventsName = false;

      eventsName = events.filter((e) => {
        if(typeof e === "object"){
          let name = Object.entries(e)[0][0];
          return name === searchName ;
        }
        return e === searchName;
      })
      if(eventsName[0][searchName] && typeof eventsName[0] === "object"){
        return  eventsName[0][searchName];
      }

      return false;
    }
    
    /**
     * @param  {Object|String} e
     * @return {Bool}
     */
    function storeEvent(e) {

        let IsAlreadyAdded = [];
        let searchName;
        if(typeof e === "object"  ){
          searchName = Object.entries(e)[0][0];
        }else{
          searchName = e;
        }
        let searchIndex = 0;
        IsAlreadyAdded = events.filter( (e, i) => {
          if(typeof e === "object"  ){
            let name  = Object.entries(e)[0][0];
            searchIndex = i
            return  searchName === name
          }else{
            return  searchName === e
          }
        })
        if ( IsAlreadyAdded.length === 0 ){
          events.push(e);
          return true
        }else{
          events[searchIndex] = e
          return true
        }

    }

    /**
     * @return {this}
     */
    function getInstance(){
        if (!instance) {
            instance = createInstance();
        }
        return instance;
    }

    return {
        getInstance: getInstance,
        storeEvent: storeEvent,
        getEvents: getEvents,
        getLastMessageFromEvent: getLastMessageFromEvent
    };
})();

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const NUMBER_RE = /^[-+]?(\d+|\d+\.?\d+)$/;
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

const escapeRegex = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

const messages = {
    email: 'Не верный email',
    minLength: 'Это поле должно содержать минимум {n} символов',
    maxLength: 'Это поле должно содержать максимум {n} символов',
    required: 'Ви не заполнили все поле',
    number: 'Поле должно содержать только числа',
    listen: 'Поля должны совпадать',
    numbercontain: 'Это поле должно содержать хотя бы одну цифру',
    lettercontain: 'Это поле должно содержать хотя бы одну букву'
};

const validationRules = {
    email: (s) => EMAIL_RE.test( s )|| messages.email,
    minLength: (s, len = 6) => escapeRegex(s).length >= len || messages.minLength.replace('{n}', len),
    maxLength: (s, len = 100) => escapeRegex(s).length <= len || messages.maxLength.replace('{n}', len),
    required: (s) => !! s.length || messages.required,
    number: (s) => NUMBER_RE.test(escapeRegex(s)) || messages.number,
    emit: (s, event, emit) =>  emit(event, escapeRegex(s)) || true, // Always true because if emitter will not be able to sent event its not a field error 
    listen: (s, event) => s === EventEmitterSingleton.getLastMessageFromEvent(event) || messages.listen,
    numbercontain : (s) =>  /[0-9]+/.test(escapeRegex(s)) || messages.numbercontain,
    lettercontain : (s) =>  /[A-Za-z]+/.test(escapeRegex(s)) || messages.lettercontain,
  };

/**
 * Parse rules from props of React element
 * @param  {Object|String} rule
 * @return {Object}
 */
const parseRuleFromParam = (rule ,ukey) => {
  let name, params;

  if (typeof rule === "string") {
    name = rule;
  }

  if (typeof rule === "object") {
    name = Object.entries(rule)[0][0];
    params = Object.entries(rule)[0][1];
  }

  if(name === 'emit'){
      params = Array(params).concat(EventEmitterSingleton.getInstance().emit.bind(EventEmitterSingleton.getInstance()))
  }

  if(name === 'listen'){
      EventEmitterSingleton.storeEvent(params);
      let handler = (s) => {
        let obj = {};
        let key = Array.isArray(params)?  params[0] : params;
        obj[key] = s;
        EventEmitterSingleton.storeEvent(obj);
      };
      EventEmitterSingleton.getInstance().addListener(params, handler)
      params = Array(params).concat(handler)
  }

  return {name, params}
}

export default class TxInput extends React.Component{
  constructor(props){
    super(props);
    this.doAtDidMount = [];
    this.listeners = [];
    this.rules     = [];
    this.errors    = [];
    this._required = false;
    this._isValid  = false;
    this._hasError = null;
    this._bindEvents = this._bindEvents.bind(this);
    this._setupValitator = this._setupValitator.bind(this);
    this.setError = this.setError.bind(this);
    this.validate = this.validate.bind(this);
    this.setValid = this.setValid.bind(this);
    this.reset = this.reset.bind(this);
  }

  state={
    isValid: this.isValid
  }

  componentWillMount(){
    this._bindEvents();
    this._setupValitator();
  }

  componentDidMount(){
    this.doAtDidMount.forEach(func => func.call(this));

  }

  componentWillUnmount(){ 
   
    let removeEventList =  EventEmitterSingleton.getEvents(this.ukey, true)

    EventEmitterSingleton.getInstance().removeAllListeners(removeEventList); 
    this.listeners.forEach(removeEventListener => removeEventListener())
  }

  /**
   * Return true if field has no error 
   * @return {Boolean}
   */
  get isValid() {
      return !this._hasError;
  }

  /**
 * Check given value with set of validation rules
 * @return {Boolean|Array} true if valid or array of error messages
 */
  validate() {
    if( this.input === null ) return true;

    const { value } = this.input;
    this.reset();

    // discard validation if field is not required and has empty value
    if (value === '' && !this._required) return true;
    const result = this._validate(value);

    if (result === true) {
      this.setValid();
    } else {
      this.setError(result);
    }
    
    return result;
  }

  setError(message) {
    if (this._hasError) return;

    this.errors = message ? [].concat(message) : [];
    
    if (this.errorElement) {
      this.input.classList.add(this.props.errorClass);
      this.errorElement.innerHTML = this.errors.map(m => `<p><img src=${warningMark} alt='warning'/> ${m}</p>`).join('') //this.errors[0];
    }

    this._hasError = true;
  }

  setValid() {
    if (this._isValid) return;

    this.input.classList.add(this.props.validClass);
    if (this.errorElement) 
      this.errorElement.innerHTML = '';
    
    this._isValid = true;
  }

  reset() {
    if (this._isValid === null && this._hasError === null) return;

    const { errorClass, validClass } = this.props;
    this.input.classList.remove(errorClass);
    this.input.classList.remove(validClass);

    if (this.errorElement) 
      this.errorElement.innerHTML = '';

    this.errors = [];
    this._isValid = null;
    this._hasError = null;
  }

  _bindEvents() {
      const {
        resetOnFocus,
        validateOnInput,
        validateOnBlur,
        autoValidate,
        setFocusToInput,
        validate,
        customValidator,
        validClass,
        errorClass,
        errorElementOuter,
        getChildInstance,
        ukey,
        ...fieldAttr
      } = this.props;
      this.fieldAttr = fieldAttr;
      this.ukey = ukey;

      if ( errorElementOuter ){
        this.errorElement =  (() => {
          var newDiv = document.createElement("div"); 
          errorElementOuter.appendChild(newDiv); 
          return newDiv
        })();  
      }

      if (!autoValidate) return;
      
      if( getChildInstance ) getChildInstance(this);

      if(setFocusToInput){
        this.doAtDidMount.push(
            () => this.input.focus() 
        );
      }

      if (resetOnFocus) {
         this.doAtDidMount.push(() => 
            this.listeners.push(
              listener(this.input, 'focus', debounce(() => this.reset(), 200, false), false)
            )
        );
      }

      if (validateOnInput) {
        this.doAtDidMount.push(() => 
            this.listeners.push(
              listener(this.input, 'input', debounce(() => this.validate(), 200, false), false)
            )
        );
      }

      if (validateOnBlur) {
       this.doAtDidMount.push(() => 
        this.listeners.push(
              listener(this.input, 'blur', debounce(() => this.validate(), 200, false), false)
          )
       );
      }
  }

  _setupValitator(){
      const { validate, customValidator, errorMessages, autoValidate } = this.props;

      if (!autoValidate) return;

      const type = typeof validate;
      if (type === 'string' || Array.isArray(validate)) {
        [].concat(validate).forEach(rule => {
          let { name, params } = parseRuleFromParam(rule, this.ukey);
          const fn = validationRules[name];

          if (fn) {
            this.rules.push({ name, fn, params });
          }

          if (name === 'required'){
            this._required = true;
          }

        });
      }
      if (typeof customValidator === 'function') {
        this.rules.push({
          name: 'custom',
          fn: customValidator
        });
      }

      // if "customValidator" is not a function or "validate" has unknown value
      if (!this.rules.length) {
        throw new Error(
          'You must provide "validate" or "customValidator" option for FormField class.'
        );
      }

      /**
       * Check given value with set of validation rules
       * @param  {String} value
       * @return {Boolean|Array} true if valid or array of error messages
       */
      this._validate = (value) => {
        const errors = this.rules.reduce((acc, { name, fn, params = [] }) => {
  
          const res = fn(value, ...params);
          // if valid
          if (res === true) return acc;
          // else return custom (if exist) or default error message
          return acc.concat(
            (errorMessages && errorMessages[name] && errorMessages[name].replace('{n}', params[0])) || res
          );
        }, []);
        return errors.length ? errors : true;
      };
  }

  

  render(){

    return(
        <div >
          <input {...this.fieldAttr}
          ref={n => this.input = n}
          />
          {!this.props.errorElementOuter  && <span className="field-error" ref={n => this.errorElement = n}></span>}
        </div>
    )
  }
}

TxInput.contextTypes = {
  router: PropTypes.object.isRequired
};

TxInput.defaultProps = {
  setFocusToInput: false,
  autoValidate: true,
  validateOnInput: true,
  validateOnBlur: true,
  resetOnFocus: true,
  validate: null,
  customValidator: null,
  validClass: 'success',
  errorClass: 'fail',
  errorElementOuter: false,
  getChildInstance: null,
  ukey: ''
};

TxInput.propTypes = {
  setFocusToInput: PropTypes.bool,
  autoValidate: PropTypes.bool,
  validateOnInput: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  resetOnFocus: PropTypes.bool,
  validate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  customValidator: PropTypes.func,
  validClass: PropTypes.string,
  errorClass: PropTypes.string,
  errorElementOuter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  getChildInstance: PropTypes.func,
  ukey: PropTypes.string
};

