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
    qs(".grid-view").addEventListener("click", () => {
      if (!qs(".display").classList.contains("grid")) {
        qs(".display").classList.add("grid");
        qs(".display").classList.remove("list");
      }
    });
    qs(".list-view").addEventListener("click", () => {
      if (!qs(".display").classList.contains("list")) {
        qs(".display").classList.add("list");
        qs(".display").classList.remove("grid");
      }
    });
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
    for (let i = 0; i < hotels.length; i++) {
      parent.appendChild(gridView(hotels[i]));
    }
  }

  /**
   * Generates hotels for the home page
   * @param {Object} hotels - The response containing hotel information
   * @returns {HTMLElement} a link element associated with a div that contains hotel image, name
   * @todo add hotel src and text content
   */
  function gridView(hotels) {
    const hotelLink = gen("a");
    const hotelCard = gen("div");
    const group = gen("div");
    const hotelImage = gen("img");
    const hotelName = gen("p");
    const location = gen("p");
    const price = gen("p");
    hotelImage.src = "imgs/hotels/" + hotels.imageSrc;
    hotelImage.alt = "Image of " + hotels.hotelName;
    hotelName.textContent = hotels.hotelName;
    hotelName.classList.add("hotel-name");
    location.textContent = hotels.country;
    hotelCard.id = hotels.hid;
    hotelLink.href = "item.html?hotel_nm=" + hotelName.textContent;
    price.textContent = "$" + hotels.price_per_night + "/night";
    price.classList.add("price");
    hotelCard.appendChild(hotelImage);
    hotelCard.appendChild(group);
    group.appendChild(hotelName);
    group.appendChild(location);
    hotelCard.appendChild(price);
    hotelLink.appendChild(hotelCard);

    return hotelLink;
  }

  function makeRequestListHotel() {
    fetch('/hotels')
      .then(statusCheck)
      .then(resp => resp.json())
      .then(generateListHotels)
      .catch(console.error);
  }

  function generateListHotels() {
    const parent = qs('.display');
    const hotels = response.hotels;
    for (let i = 0; i < hotels.length; i++) {
      parent.appendChild(gridView(hotels[i]));
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