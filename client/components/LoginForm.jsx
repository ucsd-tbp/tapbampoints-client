import React from 'react';

/**
 * Displays login form.
 *
 * @param {Object} props Requires a function `onChange` to update state based
 * on user input and a function `onSubmit` to handle form submission. Also
 * requires credentials (email and password) passed as props to update based on
 * UI state.
 */
const LoginForm = props => (
  <div>
    <h3>Login</h3>
    <p>Stay logged in to sign up to events and to keep track of your
    quarterly points.</p>

    <form onSubmit={props.onSubmit}>

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
  </div>
);

LoginForm.propTypes = {
  credentials: React.PropTypes.objectOf(React.PropTypes.string),
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};

export default LoginForm;
