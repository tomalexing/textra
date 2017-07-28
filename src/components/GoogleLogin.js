import React from 'react';
import PropTypes from 'prop-types';

const objectToParams = paramsObj => {
  let str = '';
  for (const key in paramsObj) {
    if (str !== '') {
      str += '&';
    }
    str += `${key}=${encodeURIComponent(paramsObj[key])}`;
  }
  return str;
};

const getIsMobile = () => {
  let isMobile = false;

  try {
    isMobile = !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

// https://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
const _shouldAddDisabledProp = (tag) => [
  'button',
  'input',
  'select',
  'textarea',
  'optgroup',
  'option',
  'fieldset',
].indexOf((tag + '').toLowerCase()) >= 0;

class FacebookLogin extends React.Component {

  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    onRequest: PropTypes.func,
    buttonText: PropTypes.string,
    scope: PropTypes.string,
    className: PropTypes.string,
    cookiePolicy: PropTypes.string,
    loginHint: PropTypes.string,
    hostedDomain: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    disabledStyle: PropTypes.object,
    fetchBasicProfile: PropTypes.bool,
    prompt: PropTypes.string,
    tag: PropTypes.string,
    autoLoad: PropTypes.bool,
    discoveryDocs: PropTypes.array,
    responseType: PropTypes.string,
    uxMode: PropTypes.string,
    isDisabled: PropTypes.bool,
  };

  static defaultProps = {
    tag: 'button',
    buttonText: 'Login with Google',
    scope: 'profile email',
    responseType: 'permission',
    prompt: 'select_account',
    cookiePolicy: 'single_host_origin',
    fetchBasicProfile: true,
    uxMode: 'popup',
    disabledStyle: {
        opacity: 0.6,
    },
    onRequest: () => {},
  };

  state = {
    isSdkLoaded: false,
    isProcessing: false,
  };

  constructor(p){
      super(p);
      this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { clientId, cookiePolicy, loginHint, hostedDomain, autoLoad, fetchBasicProfile, redirectUri, discoveryDocs, onFailure, uxMode } = this.props;
    ((d, s, id, cb) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      js = d.createElement(s);
      js.id = id;
      js.src = '//apis.google.com/js/client:platform.js';
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = cb;
    })(document, 'script', 'google-login', () => {
        this.setState({
          isSdkLoaded: true,
        });
        const params = {
            client_id: clientId,
            cookie_policy: cookiePolicy,
            login_hint: loginHint,
            hosted_domain: hostedDomain,
            fetch_basic_profile: fetchBasicProfile,
            discoveryDocs,
            ux_mode: uxMode,
        };
      window.gapi.load('auth2', () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init(params).then(
            (res) => {
              if (res.isSignedIn.get()) {
                this._handleSigninSuccess(res.currentUser.get());
              }
            },
            err => onFailure(err)
          );
        }
        if (autoLoad) {
          this.signIn();
        }
      });
    });
  }

  signIn(e) {
    if (e) {
      e.preventDefault(); // to prevent submit if used within form
    }
    this.setState({isProcessing: true});
    if(this.state.isSdkLoaded){
        const auth2 = window.gapi.auth2.getAuthInstance();

        const { redirectUri, onSuccess, onRequest, fetchBasicProfile, onFailure, prompt, scope, responseType } = this.props;
        const options = {
            response_type: responseType,
            redirect_uri: redirectUri,
            fetch_basic_profile: fetchBasicProfile,
            prompt,
            scope,
        };
        onRequest();
        if (responseType === 'code') {
        auth2.grantOfflineAccess(options)
            .then(
            res => { 
                onSuccess(res);      
                this.setState({
                    isProcessing: false,
                })
            },
            err => { 
                onFailure(err);      
                this.setState({
                    isProcessing: false,
                })
            }
            );
        } else {
        auth2.signIn(options)
            .then(
            res => { 
                this._handleSigninSuccess(res);      
                this.setState({
                    isProcessing: false,
                })
            },
            err => { 
                onFailure(err);      
                this.setState({
                    isProcessing: false,
                })
            }
            );
    }
    }
  }
  _handleSigninSuccess(res) {
    /*
      offer renamed response keys to names that match use
    */
    const basicProfile = res.getBasicProfile();
    const authResponse = res.getAuthResponse();
    res.googleId = basicProfile.getId();
    res.tokenObj = authResponse;
    res.tokenId = authResponse.id_token;
    res.accessToken = authResponse.access_token;
    res.profileObj = {
      googleId: basicProfile.getId(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
      name: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName(),
    };
    this.props.onSuccess(res);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

   containerStyle() {
    const style = { transition: 'opacity 0.5s' };
    if (this.state.isProcessing || !this.state.isSdkLoaded || this.props.isDisabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, this.props.containerStyle);

  }

  render() {
    const { cssClass, size, icon, textButton, typeButton, buttonStyle } = this.props;
    const optionalProps = {};
    if (this.props.isDisabled && _shouldAddDisabledProp(this.props.tag)) {
      optionalProps.disabled = true;
    }
    return (

        <this.props.tag
          type={typeButton}
          className={`${cssClass} ${size}`}
          style={buttonStyle, {...this.containerStyle()}}
          onClick={this.signIn}
          {...optionalProps}
        >
          {icon}
          {textButton}
        </this.props.tag>
    );
  }
}

export default FacebookLogin;