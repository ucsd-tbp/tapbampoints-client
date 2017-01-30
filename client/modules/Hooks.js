import Auth from './Auth';

import { Roles } from './constants';

/** Functions used as hooks when entering and leaving routes. */
class Hooks {
  /**
   * Returns a route hook that redirects if the token is invalid or if the
   * user retrieved from the token isn't an admin, depending on `role`.
   *
   * @param  {String} role Either 'member' or 'admin'.
   */
  static protectRouteFor(role) {
    return function requireAuthentication(nextState, redirect, callback) {
      Auth.verifyToken()
        .then((user) => {
          // Redirects to login if admin status is required.
          if (role === Roles.OFFICER
              && user.role.name !== Roles.OFFICER && user.role.name !== Roles.ADMIN) {
            redirect('/404');
          }

          callback();
        })
        .catch((error) => {
          console.log(error);

          Auth.deauthenticateUser();

          // Redirects to login if the token is invalid.
          redirect({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname },
          });

          callback();
        });
    };
  }

  /** Requires user to be logged out. */
  static requireLogout(nextState, redirect) {
    if (Auth.isUserAuthenticated()) {
      redirect('/');
    }
  }
}

export default Hooks;
