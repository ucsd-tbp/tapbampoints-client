import React from 'react';
import { browserHistory } from 'react-router';

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

  handleSubmit(event) {
    console.log(process.env.API_ROOT);

    this.props.onAuthChange(true);
    browserHistory.push('/');

    event.preventDefault();
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
