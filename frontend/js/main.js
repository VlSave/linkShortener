import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My Minimal React Webpack Babel Setup';

console.log(document.getElementById('app'));
ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);
