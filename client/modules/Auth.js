import { isEmpty } from 'lodash';

import API from './API';
import { Roles } from './constants';

/**
 * Utility functions for manipulating the token in local storage in order to
 * login and logout users.
 */
class Auth {
  /**
   * Logs in a user by storing a token into local storage.
   * @param {token} token Token to place into local storage.
   */
  static authenticateUser(email, password) {
    // Builds request with credentials in request body.
    const request = new Request(`${process.env.API_ROOT}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Gets token for user via response headers.
    return fetch(request)
      .then(API.checkStatus)
      .then((response) => {
        const [_, token] = response.headers.get('Authorization').split(' ');
        localStorage.setItem('token', token)
        return response.json();
      });
  }

  /**
   * Checks validity of token in local storage by verifying against the API.
   * @return {Promise} Promise that resolves to returned user JSON if token is
   * valid.
   */
  static verifyToken() {
    // Constructs GET request to /auth/me with token in Authorization header.
    const checkValidityRequest = new Request(`${process.env.API_ROOT}/auth/me?embed=attended_events,role`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    return fetch(checkValidityRequest).then(API.checkStatus);
  }

  /** Checks whether a user has administrative permissions. */
  static hasAdministrativePermission(user) {
    if (isEmpty(user)) {
      return false;
    }

    return user.role.name === Roles.OFFICER || user.role.name === Roles.ADMIN;
  }

  /**
   * Checks whether a user is logged in by checking the existence of a token.
   * @return {Boolean} True if a user is logged in.
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Logs out a user by removing the token in local storage.
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  /**
   * Retrieves token in local storage.
   * @return {String} Token in local storage.
   */
  static getToken() {
    return localStorage.getItem('token');
  }
}

export default Auth;
