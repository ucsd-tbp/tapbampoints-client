import API from './API';

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

    // Makes POST request to log in user with given credentials.
    return fetch(request)
      .then(API.checkStatus)
      .then(response => localStorage.setItem('token', response.token));
  }

  /**
   * Checks whether a user is logged in by checking the existence of a token.
   * @return {Boolean} True if a user is logged in.
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Checks whether a user is logged in, and if so, if the user is an admin.
   * @return {Boolean} True if a token exists in local storage and the token
   * corresponds to an admin user.
   */
  static isAuthenticatedUserAdmin() {
    // TODO Make API call to /auth/me.
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

  /**
   * Checks validity of token in local storage by verifying against the API.
   * @return {Promise} Promise that resolves to returned user JSON if token is
   * valid.
   */
  static verifyToken() {
    // Constructs GET request to /auth/me with token in Authorization header.
    const checkValidityRequest = new Request(`${process.env.API_ROOT}/auth/me`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });

    return fetch(checkValidityRequest).then(API.checkStatus);
  }
}

export default Auth;
