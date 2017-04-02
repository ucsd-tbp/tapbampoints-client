import React from 'react';

/**
 * Displays a list of errors. Mostly used when showing errors related to form
 * validation.
 */
const ErrorMessages = (props) => {
  const messages = props.errors.map((error) => (
    <li>
      <p>{error}</p>
    </li>
  ));

  return (
    <ul className="ErrorMessages">
      {messages}
    </ul>
  );
};

ErrorMessages.propTypes = {
  errors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default ErrorMessages;
