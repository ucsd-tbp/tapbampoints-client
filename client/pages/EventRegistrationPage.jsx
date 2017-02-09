import React from 'react';

class EventRegistrationPage extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      step: 'pid',
      event: {
        summary: '',
      },
      pid: '',
      email: '',
    };
  }

  componentDidMount() {
    fetch(`${process.env.API_ROOT}/events/${this.props.params.eventID}?embed=type`)
      .then((response) => {
        response.json().then(data => this.setState({ event: data }));
      })
      .catch(error => console.error(error));
  }

  reset(event) {
    event.preventDefault();

    this.setState({
      pid: '',
      email: '',
      step: 'pid',
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    switch (this.state.step) {
      case 'pid':
        this.setState({ step: 'email' });
        break;

      case 'email':
        this.setState({ step: 'done' });
        break;

      case 'done':
        this.setState({ step: 'pid' });
        break;

      default:
        console.error('Invalid step. One of pid, email, or done.');
    }
  }

  render() {
    let currentStep;
    switch (this.state.step) {
      case 'pid':
        currentStep = (
          <div>
            <h3>Slide your ID card, or type your pid in the box below.</h3>

            <div className="form-step">
              <form onSubmit={this.handleSubmit}>

                <label htmlFor="pid">PID
                  <input
                    name="pid"
                    type="text"
                    value={this.state.pid}
                    onChange={this.handleChange}
                    autoFocus
                  />
                </label>

                <input type="submit" value="Continue" />

              </form>
            </div>
          </div>
        );
        break;

      case 'email':
        currentStep = (
          <div>
            <h3>
              We can't find your pid! Put in your email below so that we
              can email you instructions on setting up an account.
            </h3>

            <div className="form-step">
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

                <input type="submit" value="Finish" />

              </form>
            </div>
          </div>
        );
        break;

      case 'done':
        currentStep = (
          <div>
            <div className="form-step">
              <h3>Congrats, you're done!</h3>

              <form onSubmit={this.reset}>
                <input autoFocus type="submit" value="Start Over" />
              </form>
            </div>
          </div>
        );
        break;

      default:
        currentStep = <h3>You broke something and this form is in a weird state. Refresh!</h3>;
    }

    return (
      <div className="EventRegistrationPage">
        <h1><span className="light-emphasis">Signing-in for: </span>{this.state.event.summary}</h1>

        {currentStep}
      </div>
    );
  }
}

EventRegistrationPage.propTypes = {
  params: React.PropTypes.objectOf(React.PropTypes.number),
};

export default EventRegistrationPage;
