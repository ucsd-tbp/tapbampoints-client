import React from 'react';

import API from '../modules/API';
import EventSigninForm from '../components/EventSigninForm';
import { EventSigninSteps } from '../modules/constants';

class EventSigninFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Contains event corresponding to eventID passed in as props.
      event: {},

      // Current form step.
      step: EventSigninSteps.IDENTIFICATION,

      // The email may be unset if the attendee only inputs the PID.
      identification: {
        pid: '',
        email: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Retrieves event from API corresponding to event ID passed in as props in
   * order to show relevant event info on sign-in page.
   */
  componentDidMount() {
    API.retrieveEvent(this.props.eventID)
      .then(event => this.setState({ event }))
      .catch(error => console.error(error));
  }

  /** Updates identification key passed into form. k*/
  handleChange(event) {
    const identification = this.state.identification;
    identification[event.target.name] = event.target.value;

    this.setState({ identification });
  }

  /**
   * Switches form steps depending on which step the form is currently in. Adds identified user as
   * an attendee if the form is complete, but may also send an email to the identified user if the
   * given PID doesn't yet exist.
   */
  handleSubmit(event) {
    if (event) event.preventDefault();

    switch (this.state.step) {
      case EventSigninSteps.IDENTIFICATION:
        // FIXME Parse ID cards properly!
        API.registerAttendee(this.state.identification.pid)
          .then(() => this.setState({
            step: EventSigninSteps.COMPLETE,
            identification: { email: '', pid: '' },
          }))
          .catch(error => console.error(error));

        break;
      case EventSigninSteps.COMPLETE:
        this.setState({ step: EventSigninSteps.IDENTIFICATION });
        break;
      default:
        this.setState({ step: EventSigninSteps.IDENTIFICATION });
    }
  }

  render() {
    return (
      <EventSigninForm
        event={this.state.event}
        step={this.state.step}
        identification={this.state.identification}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

EventSigninFormContainer.propTypes = {
  eventID: React.PropTypes.number,
};

export default EventSigninFormContainer;
