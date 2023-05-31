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
    makeRequestFill();
  }

  /**
   * gets the name of the selected hotel
   */
  function makeRequestFill() {
    // Get the hotel name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hotelName = "/hotels/" + urlParams.get('hid');

    fetch(hotelName)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(fill)
      .catch(console.error);
  }

  function fill(response) {
    const img = gen("img");
    let description = gen("p");
    const h2 = gen("h2");
    const h1 = qs('h1');
    const info = response[0];
    h2.textContent = "Description:";
    h1.textContent = info.hotelName + ", " + info.country;
    img.src = "imgs/hotels/" + info.imageSrc;
    img.alt = "Image of " + info.hotelName;
    qs(".adjust > article").prepend(img);
    const parent = id("description");
    description.textContent = info.description;
    parent.prepend(description);
    parent.prepend(h2);
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