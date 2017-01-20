/** Utility functions for API calls. */
class API {

  /**
   * Custom response handler for the `fetch` promise to reject on HTTP error
   * statuses such as 40x and 50x, since `fetch` only rejects the promise if a
   * network error has occurred
   * @param {Object} response Response object.
   */
  static checkStatus(response) {
    if (response.ok) {
      return response.json();
    } else {
      // Rejects promise with a JSON error object.
      return response.json().then(error => { throw error; });
    }
  }
}

export default API;
