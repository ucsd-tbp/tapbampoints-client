import React from 'react';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

import API from '../modules/API';
import Auth from '../modules/Auth';

/**
 * Renders a login form with fields for an email and a password.
 */
class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // TODO Extract state and data management to a container component.
  handleSubmit(event) {
    event.preventDefault();

    const request = new Request(`${process.env.API_ROOT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    });

    fetch(request)
      .then(API.checkStatus)
      .then((response) => {
        response.json().then((data) => {
          Auth.authenticateUser(data.token);
          this.props.onAuthChange(true);
          browserHistory.push('/');
        });
      }).catch((error) => {
        error.json().then((data) => {
          console.log(data.error);
        });
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <label htmlFor="email">Email
          <input
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="user@email.com"
          />
        </label>

        <label htmlFor="password">Password
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="at least 6 characters"
          />
        </label>

        <input type="submit" value="Login" />

      </form>
    );
  }
}

LoginForm.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default LoginForm;
