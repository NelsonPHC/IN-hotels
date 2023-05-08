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
    generateHotels();
  }

  /**
   * Generates a set of hotels
   */
  function generateHotels() {
    for (let i = 0; i < 10; i++) {
      id('display').appendChild(generateHotel());
    }
  }

  /**
   * Generates hotels for the home page
   * @returns {HTMLElement} a link element associated with a div that contains hotel image, name
   * @todo add hotel src and text content
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

    return hotelLink;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }
})();