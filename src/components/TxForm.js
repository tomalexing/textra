import React from 'react';
import PropTypes from 'prop-types';
import { debounce, listener,call} from './../utils';
import formSerialize from 'form-serialize';
import './../polyfill.js';

const _shouldAddAdditionalProp = (tag) => [
  'button',
  'input',
  'select',
  'textarea',
  'optgroup',
  'option',
  'fieldset',
].indexOf((tag + '').toLowerCase()) >= 0;

export default class TxForm extends React.Component{
    constructor(props){
        super(props);
        this.listeners = [];
        this._setupField =  this._setupFields.bind(this);
        this._bindEvents = this._bindEvents.bind(this);
        this._getChildInstance = this._getChildInstance.bind(this);
        this.fields = [];
        this._updateState = this._updateState.bind(this);
        this.serialize = this.serialize.bind(this)
    }

    state={
        mounted: false
    }

    _getChildInstance(child){
        this.fields.push(child); // I cant get access to child Class functions because React is suck, I will never use it.
    }

    componentDidMount(){
        let _self = this;
        this.setState({mounted: true},
         () => {
             _self._bindEvents();
             this.submit = Array.prototype.filter.call(
                _self.element.elements, (el) => el.type === 'submit'
            )[0]
         }
        );
    }
    componentWillUnmount(){

        this.listeners.forEach(removeEventListener => removeEventListener());
    }

    /**
     * Check given value with set of validation rules
     * @return {Boolean|Array} true if valid or array of error messages
     */
    validate() {
      const { onValid, onError, autoValidate } = this.props;
      const result = this.fields.map(f => f.validate());
      if (result.every(res => res === true)) {
        call(onValid, this);
        return true;
      }
      const errors = result
        .reduce((acc, next) => acc.concat(next), [])
        .filter(val => val !== true);

      call(
        onError,
        this,
        this.fields.map(f => ({
          el: f.control,
          errors: f.errors
        }))
      );
      if (autoValidate) this.setInvalidState();
      return errors;
    }

    isValid() {
      return this.fields.map(f => f.isValid).every(res => res === true); 
    }

    serialize() {
      return formSerialize(this.element, { hash: true, empty: true }); // JSON.serialize() maybe in general
    }

    setInvalidState() {
      this.element.classList.add(this.props.invalidClass);
      this.submit.setAttribute('disabled', true);
    }

    setLoadingState() {
      this.element.classList.add(this.props.loadingClass);
      this.submit.setAttribute('disabled', true);
    }

    setSuccessState() {
      this.element.classList.add(this.props.successClass);
    }

    setErrorState() {
      this.element.classList.add(this.props.errorClass);
    }

    resetState() {
      const { invalidClass, loadingClass, successClass, errorClass } = this.props;

      if(this.element){
        this.element.classList.remove(invalidClass);
        this.element.classList.remove(loadingClass);
        this.element.classList.remove(successClass);
        this.element.classList.remove(errorClass);
        this.submit.removeAttribute('disabled');
      }
      
      return this;
    }

    _updateState(e) {
      if (e.target === this.submit) return;
      if (this.isValid()) {
        this.resetState();
      } else {
        this.setInvalidState();
      }
    }
    
    _setupFields() {
      const { children } = this.props;
      this.fields = Object.values(children).reduce((acc, field) => {
            return field ? acc.concat(field) : acc;
      }, []);
    }

    _submitHandler(e) {
        e.preventDefault();
        if(this.element){
            if(this.validate() === true){ 
                call(this.props.submit, e, this, this.serialize())
            }else{
                this.setInvalidState()
            }
        }
    }

    _bindEvents() {
    //   this.listeners.push(() =>
    //     listener(this.element, 'submit', debounce((e) => this._submitHandler(e), 0, false), false)
    //   );
      
      if (!this.props.autoValidate) return;

      this.listeners.push(() =>
        listener(this.element, 'focusout', debounce((e) => this._updateState(e), 200, false), false)
      );

      this.listeners.push(() =>
        listener(this.element, 'focusin', debounce((e) => this._updateState(e), 200, false), false)
      );


      this.listeners.forEach(f => f());
    }

    render(){
        let { children, getErrorField, innerErrorFielsType, formClass } = this.props;
        let { mounted } = this.state;
        return(
             <form onSubmit={this._submitHandler.bind(this)} ref={(n) => this.element = n} {...formClass&&{className:formClass}}>
                {  !!mounted && 
                    Object.keys(children).map(e => children[e]).map((child, i) =>(
                       React.cloneElement(child, {
                          key: i, 
                          ...child.props, 
                          ..._shouldAddAdditionalProp(child.props.tag)&&{errorElementOuter: this.errorField}, 
                          ..._shouldAddAdditionalProp(child.props.tag)&&{getChildInstance: this._getChildInstance}
                          })
                    ))
                }
              {!innerErrorFielsType && <div className={"field-error u-my-2"} ref={ (n) => {this.errorField = n; getErrorField(n); }} />}
             </form>
        )

    }
}

TxForm.defaultProps = {
  invalidClass: 'form-invalid', 
  loadingClass: 'form-loading',
  successClass: 'form-success', 
  errorClass: 'form-error',
  formClass: 'registform-regist__inputs',
  autoValidate: true,
  onValid: () => {},
  onError: () => {},
  getErrorField: () => {},
  innerErrorFielsType: false
};

TxForm.propTypes = {
  invalidClass: PropTypes.string, 
  loadingClass: PropTypes.string, 
  successClass: PropTypes.string, 
  errorClass: PropTypes.string,
  autoValidate: PropTypes.bool,
  onValid: PropTypes.func,
  onError: PropTypes.func,
  getErrorField: PropTypes.func
};
