import React from 'react';
import ReactDOM from 'react-dom';
import * as utils from './utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<div />, div);
});

it('random string for React keys', () => {
  expect(utils.getUniqueKey()).not.toBe(utils.getUniqueKey());
});


