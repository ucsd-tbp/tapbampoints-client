import React from 'react';

import API from '../modules/API';
import Events from '../modules/Events';
import EventSigninForm from '../components/EventSigninForm';
import { EventSigninSteps, PID_LENGTH } from '../modules/constants';

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

    this.handleIdentificationStep = this.handleIdentificationStep.bind(this);
    this.handleUnregisteredAttendee = this.handleUnregisteredAttendee.bind(this);

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

  /**
   * Retrieves a user given the entered PID. If a user corresponding to the PID
   * doesn't exist, then moves form to the email prompt. Otherwise, marks the
   * retrieved user as having attended this event.
   */
  handleIdentificationStep() {
    const pid = Events.parsePID(this.state.identification.pid);

    if (pid < PID_LENGTH) {
      return Promise.reject(new Error('PID is invalid, try again.'));
    }

    return API.retrieveUser(pid)
      .catch((error) => {
        // Switches to email form and throws to break out of promise chain.
        this.setState({ step: EventSigninSteps.NOT_YET_REGISTERED });
        throw error;
      })
      .then((user) => {
        console.warn(`Found user with ID ${user.id}.`);
      });
  }

  handleUnregisteredAttendee() {

  }

  /** Updates identification key passed into form. */
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

    // TODO Add errors to an <Errors /> component.
    switch (this.state.step) {

      case EventSigninSteps.IDENTIFICATION:
        this.handleIdentificationStep()
          .catch((error) => console.error(error.message));
        break;

      case EventSigninSteps.NOT_YET_REGISTERED:
        this.handleUnregisteredAttendee();
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
