import React from 'react';
import {Link} from 'react-router-dom';
import FormWrapper from '../containers/FormWrapper';
import FormField from './FormField';

const fields = {
  login: '',
  password: '',
  confirmPassword: ''
};
const requiredFields = ['login', 'password', 'confirmPassword'];

@FormWrapper('/user/new', fields, requiredFields)
export default class SignUpForm extends React.PureComponent {
  render() {
    const { data, errors, handleSubmit, handleInput } = this.props;
    return (
      <div className="form__wrapper form__login">
        <div className="form__inner">
          <h1 className="form__title">Sign Up</h1>
          <form action={'/user/new'} className="form" onSubmit={handleSubmit}>
            <FormField type={`email`} name={`login`} value={data.login}
                       label={`Login`} onChange={handleInput} error={errors.login}
            />
            <FormField type={`password`} name={`password`} value={data.password}
                       label={`Password`} onChange={handleInput} error={errors.password}
            />
            <FormField type={`password`} name={`confirmPassword`} value={data.confirmPassword}
                       label={`Confirm password`} onChange={handleInput} error={errors.confirmPassword}
            />
            <button type="submit" className="form__btn">Submit</button>
          </form>
          <h3 className="form__subtitle">Or {<Link to='/login' className="form__change">Login</Link>}</h3>
        </div>
      </div>
    );
  }
}
