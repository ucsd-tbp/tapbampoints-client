import React from 'react';

import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const RegistrationPage = () => (
  <section className="RegistrationPage">
    <div className="RegistrationPage left">
      <h3>Login</h3>
      <p>Stay logged in to sign up to events and to keep track of your
      quarterly points.</p>

      <LoginForm />
    </div>
    <div className="RegistrationPage right">
      <h3>Register</h3>
      <p>If you've been to an event, you'll need to make an account to register
      the barcode on your ID card with your name and email so that we can keep
      track of your points.</p>

      <RegistrationForm />
    </div>
  </section>
);

export default RegistrationPage;
