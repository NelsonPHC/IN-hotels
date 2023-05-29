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
    makeRequestHotel();
  }

  /**
   * gets hotel information from our server
   */
  function makeRequestHotel() {
    fetch('/hotels')
      .then(statusCheck)
      .then(resp => resp.json())
      .then(generateHotels)
      .catch(console.error);
  }

  /**
   * Generates a set of hotels
   */
  function generateHotels(response) {
    
    const parent = qs('.display');
    const hotels = response.hotels;
    console.log(hotels);
    for (let i = 0; i < hotels.length; i++) {
      const hotelLink = gen("a");
      const hotelCard = gen("div");
      const hotelImage = gen("img");
      const hotelName = gen("p");
      const location = gen("p");
      hotelImage.src = "imgs/hotels/" + hotels[i].imageSrc;
      hotelImage.alt = "Image of " + hotels[i].hotelName;
      hotelName.textContent = hotels[i].hotelName;
      location.textContent = hotels[i].country;
      hotelCard.id = hotels[i].hid;
      hotelLink.href = "item.html?hotel_nm=" + hotelName.textContent;
      hotelCard.appendChild(hotelImage);
      hotelCard.appendChild(hotelName);
      hotelCard.appendChild(location);
      hotelLink.appendChild(hotelCard);
      parent.appendChild(hotelLink);
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