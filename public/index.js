"use strict";
(function() {
  let opacity = 0;
  let intervalID = 0;
  window.addEventListener('load', init);

  function init() {
    console.log("window.addEventListener();");
    generateHotels();
  }

  /**
   * generates a set of hotels
   */
   function generateHotels() {
    for (let i = 0; i < 10; i++) {
      id('display').appendChild(generateHotel());
    }
  }

  /**
   * Generates hotels for the home page
   * @returns {HTMLElement} a link element associated with a div that contains hotel image, name
   */
  function generateHotel() {
    let hotelLink = document.createElement('a');
    let hotelCard = document.createElement('div');
    let hotelImg = document.createElement('img');
    let hotelName = document.createElement('p');
    hotelImg.alt = 'hotel image';
    hotelName.textContent = 'AAA hotel';
    hotelLink.href = 'item.html?hotel_nm=' + hotelName.textContent;
    hotelCard.appendChild(hotelImg);
    hotelCard.appendChild(hotelName);
    hotelLink.appendChild(hotelCard);

    return hotelLink
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
})();