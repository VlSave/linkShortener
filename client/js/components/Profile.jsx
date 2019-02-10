import React from 'react';
import axios from 'axios/index';
import { Redirect } from 'react-router-dom';
import ListOfUsersLinks from './ListOfUsersLinks';

export default class Profile extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      links: null
    };
  }

  componentDidMount() {
    this._asyncRequest = this.getLinks();
  }

  getLinks = async () => {
    try {
      const links = await axios.get('/api/get_users-links');
      this.setState({ isDataLoaded: true, links: links.data });
    } catch (err)  {
      console.log(err);
    }
  }

  renderLoading() {
    return (
      <div className="loading">
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }

  renderUsersLinks(links) {
    return (
      <div className="profile">
        <h3 className="profile__title">Your latest links:</h3>
        <ListOfUsersLinks listItems={links}/>
      </div>
    );
  }

  render() {
    return (
      this.state.isDataLoaded ? this.renderUsersLinks(this.state.links) : this.renderLoading()
    );
  }
}
