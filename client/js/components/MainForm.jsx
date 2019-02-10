import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import cn from 'classnames';
import axios from 'axios';

export default class MainBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formText: '',
      isSubmitted: false,
      isLoading: false,
      responseLink: '',
      isCopied: false
    };
  }

  handleChangeField = ({ target }) => {
    this.setState({ formText: target.value });
  }

  onCopy = () => {
    this.setState({isCopied: true});
  }

  blurHandler = () => {
    this.setState({isCopied: false});
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({ isLoading: true });

    const formData = {};
    formData.url = this.state.formText;

    if (formData.url) {
      try {
        const { data } = await axios.post('/create-link', formData);
        this.setState({
          isLoading: false,
          isSubmitted: true,
          responseLink: data.newUrl
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
    const { formText, isSubmitted, isLoading, responseLink } = this.state;
    const responseClass = cn({
      'form__response-wrapper': true,
      'form__response-wrapper_loading': isLoading,
      'form__response-wrapper_showed': isSubmitted
    });
    const copyBtnClass = cn({
      'form__response-btn': true,
      'form__response-btn_copied': this.state.isCopied
    });

    return (
      <div className="form__wrapper">
        <div className="form__inner">
          <h1 className="form__title">Tiny.Link demo</h1>
          <form action="/create-link" className="form form_main" onSubmit={this.handleSubmit}>
            <input type="url" name="url" className="form__input form__input_with-btn" value={formText} onChange={this.handleChangeField} placeholder="http://"/>
            <button type="submit" className="form__btn form__btn_with-input">Get Tiny.Link!</button>
          </form>
          <div className={responseClass}>
            <div className="form__response">
              { responseLink }
            </div>
            <CopyToClipboard onCopy={this.onCopy} text={responseLink}>
              <button className={copyBtnClass} onBlur={this.blurHandler} type="button">Copy</button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
}
