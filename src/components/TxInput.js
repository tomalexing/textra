import React from 'react';
import cx from 'classnames';

export class FadeLoader extends React.Component{
  constructor(props){
    super(props);
  }

  state ={
    fadeClass: false
  }

  fadeInPromise(){
    this.setState({fadeClass: true});
  }
  
  render(){

    return(
      <div className={cx(
        'loading__screen',
        {'fadeIn': this.props.fade}
        )} >
        loading
      </div>
    )
  }
}
