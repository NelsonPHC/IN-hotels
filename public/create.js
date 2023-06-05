"use strict";
(function() {
  window.addEventListener('load', init);

  function init() {
    id("form").addEventListener("submit", function(event) {
      event.preventDefault();
      makeRequestCreateUser();
    });
  }

  function makeRequestCreateUser() {
    qs(".prompt").remove();
    let params = new FormData();
    const name = qs("#form #username");
    const password = qs("#form password");
    const email = id("email");
    params.append("email", email);
    params.append("name", name);
    params.append("password", password);
    fetch("/create", {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(createUser)
      .catch(handleCreateError);
  }

  function createUser(response) {
    console.log(response);
  }

  function handleCreateError(error) {
    const issue = gen("p");
    issue.classList.add("prompt");
    issue.classList.add("error");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    qs("#form div").appendChild(issue);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Creates a new HTML element of the specified type.
   * @param {string} element - The type of HTML element to create.
   * @returns {object} - The newly created HTML element.
   */
  function gen(element) {
    return document.createElement(element);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();