import React from 'react';
import { includes, map, toNumber } from 'lodash';

import API from '../modules/API';
import Events from '../modules/Events';
import EventSigninForm from '../components/EventSigninForm';
import { EMAIL_REGEX, EventSigninSteps, PID_LENGTH } from '../modules/constants';

// FIXME from here on lies code of the limp noodle variety ... ye have been warned

/**
 * Handles all state for the multi-step event sign-in form. Retrieves the event
 * this form is for based on URL parameter passed in from `EventSigninPage`.
 * Handles the logic for creating unverified users and assigning points to
 * existing users.
 */
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
        id: 0,
        pid: '',
        email: '',
      },

      pointsToAssign: 0,

      errors: [],
    };

    // Custom functions for form behavior in each step.
    this.assignPoints = this.assignPoints.bind(this);
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
      .then((event) => {
        this.setState({ pointsToAssign: event.points });
        this.setState({ event });
      })
      .catch(error => console.error(error));
  }

  /**
   * Retrieves a user given the entered PID. If a user corresponding to the PID
   * doesn't exist, then moves form to the email prompt. Otherwise, marks the
   * retrieved user as having attended this event.
   */
  handleIdentificationStep() {
    // Sanitizes PID if entered in via a barcode reader.
    let identification = this.state.identification;

    identification.pid = Events.parsePID(identification.pid);
    this.setState({ identification });

    if (this.state.identification.pid.length < PID_LENGTH || !this.state.identification.pid) {
      return Promise.reject(new Error('Something went wrong! Try entering in your PID again.'));
    }

    return API.retrieveUser(this.state.identification.pid)
      .catch(() => {
        // Switches to email form and throws to break out of promise chain.
        this.setState({ step: EventSigninSteps.NOT_YET_REGISTERED });

        // Breaks out of promise chain without an error message.
        throw new Error();
      })
      .then((user) => {
        // Checks whether the user has already been registered for the event (i.e. user ID is in
        // the event's list of attendees).
        if (includes(map(this.state.event.attendees, 'id'), user.id)) {
          throw new Error('You\'ve already signed-up at this event! Check your profile to see events that you\'ve recently attended.');
        } else {
          // Updates ID property nested in identification state, since setState() isn't recursive.
          // ID is placed in state for assignPoints() to find the correct user to give points to.
          identification = this.state.identification;
          identification.id = user.id;
          this.setState({ identification });

          this.setState({ step: EventSigninSteps.POINT_SELECTION });
        }
      })
      .catch(error => this.setState({ errors: this.state.errors.concat(error.message) }));
  }

  handleUnregisteredAttendee() {
    if (!EMAIL_REGEX.test(this.state.identification.email)) {
      return Promise.reject(new Error('Email is formatted incorrectly – please try again.'));
    }

    // If an attendee tries to sign up for an event but hasn't made an account
    // yet, then makes an account automatically given their email and PID.
    return API.registerUser({
      pid: this.state.identification.pid,
      email: this.state.identification.email,
    })
    .then(() => API.retrieveUser(this.state.identification.pid))
    .then((user) => {
      const identification = this.state.identification;
      identification.id = user.id;
      this.setState({ identification });

      this.setState({ step: EventSigninSteps.POINT_SELECTION });
    })
    .catch(error => console.error(error));
  }

  /**
   * Assigns points based on number of points entered in form.
   * @param {User} user User to assign points to.
   */
  assignPoints() {
    if (this.state.pointsToAssign <= 0) {
      return Promise.reject(new Error('Number of points must be a positive number.'));
    }

    // An event can give at most 3 points.
    if (this.state.pointsToAssign > this.state.event.points) {
      return Promise.reject(new Error(`The maximum number of points for this event is ${this.state.event.points}.`));
    }

    // Records user attendance at the given event and completes form submission.
    return API.registerAttendeeForEvent(
      this.state.identification.id,
      this.state.event.id,
      this.state.pointsToAssign)
      .then(() => this.setState({ step: EventSigninSteps.COMPLETE }))
      .catch(error => console.error(error.message));
  }

  /** Updates identification key passed into form. */
  handleChange(event) {
    if (this.state.step === EventSigninSteps.IDENTIFICATION
        || this.state.step === EventSigninSteps.NOT_YET_REGISTERED) {
      // Updates credentials when user enters PID or email.
      const identification = this.state.identification;
      identification[event.target.name] = event.target.value;

      this.setState({ identification });
    } else if (this.state.step === EventSigninSteps.POINT_SELECTION) {
      // Updates number of points to assign.
      this.setState({ pointsToAssign: toNumber(event.target.value) });
    }
  }

  /**
   * Switches form steps depending on which step the form is currently in. Adds identified user as
   * an attendee if the form is complete, but may also send an email to the identified user if the
   * given PID doesn't yet exist.
   */
  handleSubmit(event) {
    if (event) event.preventDefault();

    // TODO setState() is atomic. Does this always work?
    this.setState({ errors: [] });

    switch (this.state.step) {
      case EventSigninSteps.IDENTIFICATION:
        this.handleIdentificationStep()
          .catch(error => this.setState({ errors: this.state.errors.concat(error.message) }));
        break;

      case EventSigninSteps.NOT_YET_REGISTERED:
        this.handleUnregisteredAttendee()
          .catch(error => this.setState({ errors: this.state.errors.concat(error.message) }));
        break;

      case EventSigninSteps.POINT_SELECTION:
        this.assignPoints()
          .catch(error => this.setState({ errors: this.state.errors.concat(error.message) }));
        break;

      case EventSigninSteps.COMPLETE:
        // Resets form to first step with empty input fields.
        this.setState({
          step: EventSigninSteps.IDENTIFICATION,
          identification: { pid: '', email: '' },
        });
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
        pointsToAssign={this.state.pointsToAssign}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={this.state.errors}
      />
    );
  }
}

EventSigninFormContainer.propTypes = {
  eventID: React.PropTypes.number,
};

export default EventSigninFormContainer;
