import React from 'react';

import ErrorMessages from './ErrorMessages';

/**
 * Displays login form.
 *
 * @param {Object} props Requires a function `onChange` to update state based
 * on user input and a function `onSubmit` to handle form submission. Also
 * requires credentials (email and password) passed as props to update based on
 * UI state.
 */
const LoginForm = props => (
  <form onSubmit={props.onSubmit}>

    <ErrorMessages errors={props.errors} />

    <label htmlFor="email">Email
      <input
        name="email"
        type="text"
        value={props.credentials.email}
        onChange={props.onChange}
        placeholder="user@email.com"
      />
    </label>

    <label htmlFor="password">Password
      <input
        name="password"
        type="password"
        value={props.credentials.password}
        onChange={props.onChange}
        placeholder="at least 6 characters"
      />
    </label>

    <input type="submit" value="Login" />

  </form>
);

LoginForm.propTypes = {
  credentials: React.PropTypes.objectOf(React.PropTypes.string),

  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,

  errors: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default LoginForm;
