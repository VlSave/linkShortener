import React from 'react';
import ReactDOM from 'react-dom';
import hash from './partials/getPage';

const title = 'My Minimal React Webpack Babel Setup';

console.log(document.getElementById('app'));
ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

hash('qwerty');
