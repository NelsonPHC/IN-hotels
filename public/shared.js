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
  }

  /**
   * Toggles the view of the menu bar
   */
  function clickMenu() {
    qs(".menu-bar").classList.toggle("hidden");
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