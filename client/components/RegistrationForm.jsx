import React from 'react';

/**
 * Renders a login form with fields for an email and a password.
 */
class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      barcode: '',
      house: '',
      memberStatus: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    console.log(`submitted ${this.state.email}`);
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

        <label htmlFor="passwordConfirmation">Confirm Password
          <input
            name="passwordConfirmation"
            type="password"
            value={this.state.passwordConfirmation}
            onChange={this.handleChange}
            placeholder="retype password"
          />
        </label>

        <label htmlFor="barcode">Barcode
          <input
            name="barcode"
            type="text"
            value={this.state.barcode}
            onChange={this.handleChange}
          />
        </label>

        <input type="submit" value="Register" />

      </form>
    );
  }
}

export default RegistrationForm;
