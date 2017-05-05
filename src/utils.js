// @flow
import React from 'react';

const util = {};


export class Bundle extends React.Component {

  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: 'div'
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
      let self = this;
      require([], function() {
        let loaded = require(props.load);
        self.setState({ 
          // handle both es imports and cjs
          mod: loaded.default ? loaded.default : loaded
        })
      });

  }

  render() {
    return React.createElement( this.state.mod, null, this.props.children);
  }
}

util.Bundle = Bundle
export default util 