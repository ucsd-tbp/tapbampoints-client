import React from 'react';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

import API from '../modules/API';
import Auth from '../modules/Auth';

import LoginForm from '../components/LoginForm';

class LoginFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: {
        email: '',
        password: '',
      },
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const request = new Request(`${process.env.API_ROOT}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        error.json().then(data => console.error(data.error));
      });
  }

  render() {
    return (
      <LoginForm
        credentials={this.state.credentials}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

LoginFormContainer.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default LoginFormContainer;
