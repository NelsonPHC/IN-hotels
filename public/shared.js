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
    qs(".logged-in button").addEventListener("click", logout);
  }

  /**
   * Toggles login view
   */
  function clickProfile() {
    if (!checkCookieExists("username")) {
      qs(".user-bar").classList.toggle("hidden");
    } else {
      qs(".logged-in").classList.toggle("hidden");
      id("user").textContent = getCookieValue("username");
    }
    if (!qs(".menu-bar").classList.contains("hidden")) {
      qs(".menu-bar").classList.toggle("hidden");
    }
  }

  function checkCookieExists(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      const cookieNameFromCookie = decodeURIComponent(cookie[0]);
      if (cookieNameFromCookie === cookieName) {
        return true;
      }
    }
    return false;
  }

  function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      const cookieNameFromCookie = decodeURIComponent(cookie[0]);
      if (cookieNameFromCookie === cookieName) {
        const cookieValue = decodeURIComponent(cookie[1]);
        return cookieValue;
      }
    }
    return null;
  }

  /**
   * Toggles the view of the menu bar
   */
  function clickMenu() {
    qs(".menu-bar").classList.toggle("hidden");
    if (!checkCookieExists("username")) {
      if (!qs(".user-bar").classList.contains("hidden")) {
        qs(".user-bar").classList.toggle("hidden");
      }
    } else {
      if (!qs(".logged-in").classList.contains("hidden")) {
        qs(".logged-in").classList.toggle("hidden");
      }
    }
  }

  function makeRequestLogin() {
    let params = new FormData();
    const username = id("username").value;
    const password = id("password").value;
    params.append("name", username);
    params.append("password", password);
    fetch("/login", {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(resp => login(resp, username))
      .catch(handleLoginError);
  }

  function handleLoginError(error) {
    const issue = gen("p");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    issue.classList.add("prompt");
    id("login").prepend(issue);
  }

  function login(resp, username) {
    document.cookie = "username=" + username + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
    id("user").textContent = username;
    qs(".logged-in").classList.toggle("hidden");
    qs(".user-bar").classList.add("hidden");
  }

  function logout() {
    qs(".login-box.prompt").classList.add("hidden");
    id("username").value = getCookieValue("username");
    id("password").value = "";
    id("user").textContent = "";
    qs(".logged-in").classList.toggle("hidden");
    qs(".user-bar").classList.add("hidden");
    clearCookies();
  }

  function clearCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      const cookieName = decodeURIComponent(cookie[0]);
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
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

  /**
   * Creates a new HTML element of the specified type.
   * @param {string} element - The type of HTML element to create.
   * @returns {object} - The newly created HTML element.
   */
  function gen(element) {
    return document.createElement(element);
  }
})();