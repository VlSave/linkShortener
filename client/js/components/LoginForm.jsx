import React from 'react';
import {Link} from 'react-router-dom';
import FormWrapper from '../containers/FormWrapper';
import FormField from './FormField';
import cn from 'classnames';

const fields = {
  login: '',
  password: ''
};
const requiredFields = ['login', 'password'];

@FormWrapper('/user/login', fields, requiredFields, )
export default class LoginForm extends React.PureComponent {
  render() {
    const { data, errors, handleSubmit, handleInput, isLoading, isSubmitted, isError, updateInitData } = this.props;
    const formClass = cn({
      'form': true,
      'form_error': isError && !isLoading,
      'form_loading': isLoading && !isSubmitted && !isError
    });

    return (
      <div className="form__wrapper form__login">
        <div className="form__inner">
          <h1 className="form__title">Login</h1>
          <form action={'/user/login'} className={formClass} onSubmit={handleSubmit}>
            <FormField type={`email`} name={`login`} value={data.login}
                       label={`Login`} onChange={handleInput} error={errors.login}
            />
            <FormField type={`password`} name={`password`} value={data.password}
                       label={`Password`} onChange={handleInput} error={errors.password}
            />
            <button type="submit" className="form__btn">Submit</button>
          </form>
          <h3 className="form__subtitle">Or {<Link to='/signup' className="form__change">Sign Up</Link>}</h3>
        </div>
      </div>
    );
  }
}
