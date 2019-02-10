import React from 'react';
import cn from 'classnames';

export default class FormField extends React.PureComponent {
  render() {
    const { type, name, label, value, onChange, error} = this.props;
    const fieldClass = cn({
      'form__field': true,
      'form__field_error': !!error
    });

    return (
      <div className={fieldClass}>
        <label className="form__label">{label}</label>
        <input type={type} name={name} className="form__input" value={value} onChange={onChange}/>
        <small className="form__msg">{error}</small>
      </div>
    );
  }
}
