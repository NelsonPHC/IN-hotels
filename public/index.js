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
  const GEOCODE_API_KEY = "AIzaSyAlItk_UpPVyKJCBKFJDqy6gBqRXEFtcEw";
  const PLACES_API_KEY = "AIzaSyAN5au_ZHKqsGwcq1bTufMgbEKAojvh3aw";
  const PLACES_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
  const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const TEST_URL = "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0&fields=address_components&key=AIzaSyAN5au_ZHKqsGwcq1bTufMgbEKAojvh3aw"
  
  window.addEventListener('load', init);

  /**
   * initiates page upon load
   */
  function init() {
    generateHotels();
    makeRequestHotel();
  }

  function makeRequestHotel() {
    const requestOptions = {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  
    fetch(PROXY_URL + TEST_URL, requestOptions)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(data => console.log(data))
      .catch(console.error);
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
})();