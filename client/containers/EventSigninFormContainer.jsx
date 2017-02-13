import React from 'react';
import { differenceInMinutes } from 'date-fns';

import API from '../modules/API';
import Events from '../modules/Events';
import EventSigninForm from '../components/EventSigninForm';
import { EventSigninModes, EventSigninSteps, PID_LENGTH } from '../modules/constants';

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

      // Event sign-in mode.
      mode: EventSigninModes.SIGNOUT_ONLY,

      // The email may be unset if the attendee only inputs the PID.
      identification: {
        pid: '',
        email: '',
      },
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
    // TODO Update sign-in mode based on event time.
    API.retrieveEvent(this.props.eventID)
      .then(event => this.setState({ event }))
      .catch(error => console.error(error));
  }

  /**
   * Assigns points based on the sign-in mode that this event is in.
   * @param {User} user User to assign points to.
   */
  assignPoints(user) {
    let pointsToAssign = 0;

    switch (this.state.mode) {
      // Bases points on time between event start time and when the attendee
      // signed out.
      case EventSigninModes.SIGNOUT_ONLY:
        pointsToAssign = Events.calculatePoints(this.state.event.start, new Date());
        break;

      // Bases points on the time interval between when the attendee signed in
      // and signed out.
      case EventSigninModes.SIGNIN_AND_SIGNOUT:
        // TODO Get timestamp of attendance record if exists to calculate points.
        break;

      // Grants event's maximum point value from a single sign-in.
      case EventSigninModes.SIGNIN_ONCE:
        pointsToAssign = Events.calculatePoints(this.state.event.start, this.state.event.end);
        break;

      default:
        throw new Error('Invalid sign-in mode!');
    }

    return API.registerAttendeeForEvent(user.id, this.state.event.id, pointsToAssign)
      .then(this.checkStatus);
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
      .then(user => this.assignPoints(user));
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
          .catch(error => console.error(error.message));
        break;

      case EventSigninSteps.NOT_YET_REGISTERED:
        this.handleUnregisteredAttendee()
          .catch(error => console.error(error.message));
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
