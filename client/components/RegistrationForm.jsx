import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';
import ErrorMessages from './ErrorMessages';
import { Houses, Roles } from '../modules/constants';

const RegistrationForm = (props) => {
  // TODO Use Flow's default props.
  const disabledFields = props.disabledFields || new Set();
  const omittedFields = props.omittedFields || new Set();

  return (
    <form onSubmit={props.onSubmit}>

      <ErrorMessages errors={props.errors} />

      <FlexContainer>
        <FlexItem className="equal-width no-margin-left">
          <label className="no-margin" htmlFor="firstName">First Name
            <input
              name="firstName"
              type="text"
              value={props.credentials.firstName}
              onChange={props.onChange}
            />
          </label>
        </FlexItem>

        <FlexItem className="equal-width no-margin-right">
          <label className="no-margin" htmlFor="lastName">Last Name
            <input
              name="lastName"
              type="text"
              value={props.credentials.lastName}
              onChange={props.onChange}
            />
          </label>
        </FlexItem>
      </FlexContainer>

      <label htmlFor="email">Email
        <input
          className={disabledFields.has('email') && 'disabled'}
          name="email"
          type="text"
          value={props.credentials.email}
          onChange={props.onChange}
          placeholder="user@email.com"
          disabled={disabledFields.has('email')}
        />
      </label>

      { !omittedFields.has('password') &&
        <label htmlFor="password">Password
          <input
            name="password"
            type="password"
            value={props.credentials.password}
            onChange={props.onChange}
            placeholder="at least 6 characters"
          />
        </label>
      }

      { !omittedFields.has('password') &&
        <label htmlFor="passwordConfirmation">Confirm Password
          <input
            name="passwordConfirmation"
            type="password"
            value={props.credentials.passwordConfirmation}
            onChange={props.onChange}
            placeholder="retype password"
          />
        </label>
      }

      <label htmlFor="pid">PID
        <input
          className={disabledFields.has('pid') && 'disabled'}
          name="pid"
          type="text"
          value={props.credentials.pid}
          onChange={props.onChange}
          disabled={disabledFields.has('pid')}
        />
      </label>

      { !omittedFields.has('house') &&
        <label htmlFor="house">House
          <select name="house" value={props.credentials.house} onChange={props.onChange}>
            <option value={Houses.RED}>Red House</option>
            <option value={Houses.GREEN}>Green House</option>
            <option value={Houses.BLUE}>Blue House</option>
            <option value={Houses.NONE}>None</option>
          </select>
        </label>
      }

      { !omittedFields.has('role') &&
        <label htmlFor="role">Membership
          <select name="role" value={props.credentials.role} onChange={props.onChange}>
            <option value={Roles.INITIATE}>Initiate</option>
            <option value={Roles.PENDING_MEMBER}>Member</option>
          </select>
        </label>
      }

      <input type="submit" value={props.submitButtonText || 'Register'} />

    </form>
  );
};

RegistrationForm.propTypes = {
  credentials: React.PropTypes.objectOf(React.PropTypes.string),
  submitButtonText: React.PropTypes.string,

  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,

  errors: React.PropTypes.arrayOf(React.PropTypes.string),

  omittedFields: React.PropTypes.instanceOf(Set),
  disabledFields: React.PropTypes.instanceOf(Set),
};

export default RegistrationForm;
