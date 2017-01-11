/**
 * Utility functions for API calls.
 */
class API {

  /**
   * Custom response handler for the `fetch` promise to reject on HTTP error
   * statuses such as 40x and 50x.
   * @param {Object} response Response object.
   */
  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }
}

export default API;
