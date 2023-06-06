/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: June 5th, 2023
 * Section: CSE 154 AG
 * This code allows the users to create their username and password
 * given a valid email address, username, and password. If they manage
 * to successfully create one, they will be sent back to the
 * home page in 4 seconds after the request goes through.
 */

"use strict";
(function() {
  const FOUR_SECONDS = 4000;

  window.addEventListener('load', init);

  /**
   * Checks if there are any previous success messages and removes them.
   * Also initializes the sign up button.
   */
  function init() {
    if (qs(".fade-in") !== null) {
      qs(".fade-in").remove();
    }
    id("form").addEventListener("submit", function(event) {
      event.preventDefault();
      makeRequestCreateUser();
    });
  }

  /**
   * Sends a request to create a new user with the provided name, password, and email.
   * Removes any existing prompt message.
   */
  function makeRequestCreateUser() {
    qs(".prompt").remove();
    let params = new FormData();
    const name = id("name").value;
    const password = id("pass").value;
    const email = id("email").value;
    params.append("email", email);
    params.append("name", name);
    params.append("password", password);
    fetch("/create", {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(createUser)
      .catch(handleCreateError);
  }

  /**
   * Displays a success message with the provided response and
   * redirects the user to the home page after a delay.
   * @param {string} response - The response message to display.
   */
  function createUser(response) {
    const success = gen("p");
    success.classList.add("fade-in");
    success.textContent = response + " Please wait for a moment to " +
    "be sent back to the home page.";
    qs("#form div").appendChild(success);
    setTimeout(() => {
      window.location.href = "index.html";
    }, FOUR_SECONDS);
  }

  /**
   * Handles and displays an error message for user creation.
   * @param {Error|string} error - The error object or error message to handle.
   * @returns {void}
   */
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
})();