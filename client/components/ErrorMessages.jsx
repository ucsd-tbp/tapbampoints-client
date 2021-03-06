import React from 'react';
import { Element } from 'react-scroll';
import { compact } from 'lodash';

/**
 * Displays a list of errors. Mostly used when showing errors related to form
 * validation.
 */
const ErrorMessages = (props) => {
  const filteredErrors = compact(props.errors);

  const messages = filteredErrors.map((error, index) => (
    <li key={index}>
      <p>{error}</p>
    </li>
  ));

  return (
    <div className="ErrorMessages">
      <Element name="ErrorMessagesList" />

      { filteredErrors.length > 0 &&
        <ul className="messages-list">
          {messages}
        </ul>
      }
    </div>
  );
};

ErrorMessages.propTypes = {
  errors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default ErrorMessages;
