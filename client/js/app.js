import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Layout from './components/Layout';
import MainForm from './components/MainForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Profile from './components/Profile';
import Page404 from './components/Page404';

ReactDOM.render(
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route path="/" exact render={props => <MainForm {...props}/>} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/signup" exact component={SignUpForm} />
        <Route path="/user/profile" exact component={Profile}/>
        <Route component={Page404}/>
      </Switch>
    </Layout>
  </BrowserRouter>,
  document.getElementById('app')
);
