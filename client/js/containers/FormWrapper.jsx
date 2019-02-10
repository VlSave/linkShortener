import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios/index';

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(String(email));
}

export default function FormWrapper(action, inputsData, requiredInputs, parentProps) {
  return function (TargetForm) {
    return class FormWrapped extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          data: inputsData,
          errors: inputsData,
          isSubmitted: false,
          isError: false,
          isLoading: false
        };
      }

      handleInput = (e) => {
        const { name, value } = e.currentTarget;

        this.setState((prevState) => ({
            data: {...prevState.data, [name]: value}
          }
        ));
      };

      isNotEmptyValue = (name) => {
        const value = this.state.data[name];
        if (!value.trim()) {
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              [name]: 'Field cant be empty!'
            }
          }));
          return false;
        }
        this.setState(({ errors }) => ({
          errors: {
            ...errors,
            [name]: ''
          }
        }));
        return true;
      };

      validateInput = (name) => {
        const value = this.state.data[name];
        const isEmpty = this.isNotEmptyValue(name, value);
        switch (true) {
          case name === 'email' && isEmpty:
            if (!validateEmail(value)) {
              this.setState((prevState) => ({
                errors: {
                  ...prevState.errors,
                  [name]: 'Please, enter correct email.'
                }
              }));
              return false;
            }
            this.setState(({ errors }) => ({
              errors: {
                ...errors,
                [name]: ''
              }
            }));
            return true;
          case name === 'confirmPassword' && isEmpty:
            const {
              data: { password, confirmPassword }
            } = this.state;

            if (password !== confirmPassword) {
              this.setState(({ errors }) => ({
                errors: {
                  ...errors,
                  [name]: 'Entered passwords are not match'
                }
              }));
              return false;
            }
            this.setState(({ errors }) => ({
              errors: {
                ...errors,
                [name]: ''
              }
            }));
            return true;
          default:
            return isEmpty;
        }
      };


      handleSubmit = async (e) => {
        e.preventDefault();

        const { data, errors } = this.state;
        const isValidate = requiredInputs.every(input => this.validateInput(input));

        if (isValidate) {
          this.setState({isLoading: true });
          console.log('here We Send Data', data);
          const formData = {
            nickname: this.state.data.login,
            password: this.state.data.password
          };

          try {
            const { data } = await axios.post(action, formData);

            if (!data.success) {
              this.setState((prevState) => ({
                errors: {
                  ...errors,
                  [data.name]: data.msg
                },
                isError: true,
                isLoading: false,
                isSubmitted: true
              }));
            } else {
              this.setState({
                isError: false,
                isLoading: false,
                isSubmitted: true
              });
              parentProps
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('no valid data');
        }
      };

      renderRedirect() {
        return (
          <Redirect to="/" push={true} />
        );
      }

      renderTargetForm() {
        return (
          <TargetForm
            {...this.state}
            {...this.props}
            handleSubmit={this.handleSubmit}
            handleInput={this.handleInput}
          />
        );
      }

      render() {
        console.log(this.state.isSubmitted && !this.state.isError);
        return this.state.isSubmitted && !this.state.isError ? this.renderRedirect() : this.renderTargetForm();
      }
    };
  };
}
