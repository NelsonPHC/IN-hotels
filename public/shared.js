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

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();