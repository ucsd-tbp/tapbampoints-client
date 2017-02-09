import React from 'react';

import RegistrationForm from '../components/RegistrationForm';

class RegistrationFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      credentials: {
        email: '',
        password: '',
        passwordConfirmation: '',
        pid: '',
        house: '',
        memberStatus: '',
      },
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAuthChange(true);
  }

  render() {
    return (
      <RegistrationForm
        credentials={this.state.credentials}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

RegistrationFormContainer.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default RegistrationFormContainer;
