import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import axios from 'axios';
import logo from '../../images/logo.jpg'

class Footer extends React.PureComponent {
  render() {
    return <footer className="footer">
      <div className="footer__inner">
        <Link className="footer__logo" to="/">
          <img src={logo} alt="Tiny.Link logo"/>
        </Link>
        <div className="footer__copyright">
          © Copyright VladSave 2019. All right reserved.
        </div>
      </div>
    </footer>;
  }
}

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return <header className="header">
      <div className="header__inner">
        <Link className="header__logo" to="/">
          <img src={logo} alt="Tiny.Link logo"/>
        </Link>
        <div className="header__nav">
          <Link className="header__login header__nav-item" to={this.props.userNickname ? '/user/profile' : '/login'}>
            {this.props.userNickname ? this.props.userNickname : 'Login/Sign Up'}
          </Link>
          {this.props.userNickname ? <button className="header__nav-item" onClick={this.props.logOut}>Sign Out</button> : null}
        </div>
      </div>
    </header>;
  };
}

class Layout extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userNickname: null
    };
  }

  componentDidMount() {
    this._asyncRequest = this.initData();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  initData = async () => {
    try {
      const { data } = await axios.get('/api/init_data');
      this.setState({ userNickname: data.userNickname });
    } catch (err)  {
      console.log(err);
    }
  }

  logOut = async () => {
    try {
      const { data } = await axios.delete('/user/login');
      location.reload();
      console.log(data);
    } catch (err)  {
      console.log(err);
    }
  }

  render() {
    const { userNickname } = this.state;

    return (
      <div className="page">
        <Header userNickname={ userNickname } logOut={this.logOut} />
        { this.props.children }
        <Footer/>
      </div>
    );
  }
}

export default Layout;
