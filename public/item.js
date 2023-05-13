/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: May 7th, 2023
 * Section: CSE 154 AG
 * This code generates the images of the hotels and the name of
 * the hotels in our home page. It will later contain the filter option
 * and we will replace the src of the images with actual images
 * in the near future.
 */

"use strict";
(function() {

  window.addEventListener('load', init);

  /**
   * initiates page upon load
   */
  function init() {
    getHotelName();
  }

  /**
   * gets the name of the selected hotel
   */
  function getHotelName() {
  // Get the hotel name from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hotelName = urlParams.get('hotel_nm');

  // Display the name on the page
  let h1 = qs('h1');
  h1.textContent = hotelName.trim().split('%20')
  .join(' ');
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