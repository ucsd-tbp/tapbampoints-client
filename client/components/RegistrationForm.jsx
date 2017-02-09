import React from 'react';

const RegistrationForm = props => (
  <div>
    <h3>Register</h3>
    <p>
      If you've been to an event, you'll need to make an account to register
      the the PID with your name and email so that we can keep track of your
      points.
  </p>

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

      <label htmlFor="passwordConfirmation">Confirm Password
        <input
          name="passwordConfirmation"
          type="password"
          value={props.credentials.passwordConfirmation}
          onChange={props.onChange}
          placeholder="retype password"
        />
      </label>

      <label htmlFor="pid">PID
        <input
          name="pid"
          type="text"
          value={props.credentials.pid}
          onChange={props.onChange}
        />
      </label>

      <input type="submit" value="Register" />

    </form>
  </div>
);

RegistrationForm.propTypes = {
  credentials: React.PropTypes.objectOf(React.PropTypes.string),
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};

export default RegistrationForm;
