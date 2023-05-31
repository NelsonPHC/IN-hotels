/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: May 7th, 2023
 * Section: CSE 154 AG
 * This code is shared between all files. It toggles the
 * view of the menu icon so that the menu bar expands or hides when
 * the user clicks on it.
 */

"use strict";
(function() {
  let UID = ""; //make sure to remove event listeners for profile and menu when backend
  // is complete

  window.addEventListener('load', init);

  /**
   * initiates page upon load
   */
  function init() {
    qs(".menu").addEventListener("click", clickMenu);
    qs(".right-icon").addEventListener("click", clickProfile);
    id("login").addEventListener("submit", function(event) {
      event.preventDefault();
      makeRequestLogin();
    });
  }

  /**
   * Toggles login view
   */
  function clickProfile() {
    qs(".user-bar").classList.toggle("hidden");
    if (!qs(".menu-bar").classList.contains("hidden")) {
      qs(".menu-bar").classList.toggle("hidden");
    }
  }

  /**
   * Toggles the view of the menu bar
   */
  function clickMenu() {
    qs(".menu-bar").classList.toggle("hidden");
    if (!qs(".user-bar").classList.contains("hidden")) {
      qs(".user-bar").classList.toggle("hidden");
    }
  }

  function makeRequestLogin() {
    let params = new FormData(id('login'));
    console.log(params);
    // const username = id("username").value;
    // const password = id("password").value;
    // params.append("name", username);
    // params.append("password", password);
    fetch("/login", {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(login)
      .catch(console.error);
  }

  function login(response) {
    console.log(response)
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