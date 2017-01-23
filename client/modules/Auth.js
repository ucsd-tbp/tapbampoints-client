/**
 * Utility functions for manipulating the token in local storage in order to
 * login and logout users.
 */
class Auth {

  /**
   * Logs in a user by storing a token into local storage.
   * @param {token} token Token to place into local storage.
   */
  static authenticateUser(token) {
    localStorage.setItem('token', token);
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
   * @return {Boolean} True if the token is valid.
   */
  static verifyToken() {
    // TODO Make API call to /auth/me.
  }
}

export default Auth;
