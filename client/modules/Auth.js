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
   * @return Token in local storage.
   */
  static getToken() {
    return localStorage.getItem('token');
  }
}

export default Auth;
