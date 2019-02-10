import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import cn from 'classnames';

class UsersLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCopied: false
    };
  }
  onCopy = () => {
    this.setState({isCopied: true});
  }

  blurHandler = () => {
    this.setState({isCopied: false});
  }

  render() {
    const { data } = this.props;
    const btnClass = cn({
      'usersList__btn-copy': true,
      'usersList__btn-copy_copied': this.state.isCopied
    });

    return (
      <li className="usersList__item">
        <div className="usersList__value">{data.fullLink}</div>
        <CopyToClipboard onCopy={this.onCopy} text={data.tinyLink}>
          <button  className={btnClass} onFocus={this.focusHandler} onBlur={this.blurHandler}>Copy Tiny.Link</button>
        </CopyToClipboard>
      </li>
    );
  }
}

export default class ListOfUsersLinks extends React.PureComponent {
  render() {
    const { listItems } = this.props;
    console.log(listItems);

    return (
      <ul className="usersList">
        {listItems.map(item => (
          <UsersLink key={item.id} data={item} />
        ))}
      </ul>
    );
  }
}
