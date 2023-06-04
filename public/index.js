/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: June 3rd, 2023
 * Section: CSE 154 AG
 * This code generates the images of the hotels and the name of
 * the hotels in our home page. It contains various filter options
 * which are the name of the hotel, country name, and price range.
 * It also allows the users to reset their filters. Any error
 * that occurs will be handled by either unhiding the error
 * message or displaying the error message on the page.
 */

"use strict";
(function() {
  window.addEventListener('load', init);

  /**
   * Initiates page upon load by filling the page
   * with hotel images. Allows the users to toggle between
   * grid and list view, submit a filter request, and reset
   * the filters.
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
    qs(".filter").addEventListener("submit", function(event) {
      event.preventDefault();
      makeRequestFilter();
    });
    qs(".search-icon").addEventListener("click", makeRequestFilter);
    qs(".search-bar button").addEventListener("click", resetFilter);
    id("minPrice").addEventListener("keypress", checkInvalidInput);
    id("maxPrice").addEventListener("keypress", checkInvalidInput);
  }

  /**
   * Disables the users from clicking +, -, and "e" in the
   * input box for min and max price.
   * @param {Event} evt - The keypress event object.
   */
  function checkInvalidInput(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode !== 8 && charCode !== 0 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
  }

  /**
   * Gets hotel information from our server
   */
  function makeRequestHotel() {
    fetch('/hotels')
      .then(statusCheck)
      .then(resp => resp.json())
      .then(generateHotels)
      .catch(handleGenError);
  }

  /**
   * Handles errors by not allowing the user to submit any
   * requests to filter the hotels, creating an error
   * message element, and appending it to the display area where
   * the hotel images are located at.
   * @param {Error|string} error - The error object or error message.
   */
  function handleGenError(error) {
    qs(".search-icon").removeEventListener("click", makeRequestFilter);
    const issue = gen("p");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    issue.classList.add("issue");
    qs(".display").prepend(issue);
  }

  /**
   * Generates hotel elements based on the response data,
   * appends them to the display area, and adds the country options to
   * the country filter.
   * @param {Object} response - The response data containing the hotels.
   */
  function generateHotels(response) {
    const display = qs('.display');
    const select = qs(".filter select");
    const hotels = response.hotels;
    let array = [];
    for (let i = 0; i < hotels.length; i++) {
      display.appendChild(gridView(hotels[i]));
      addOption(hotels[i], array);
    }
    let uniqueArray = Array.from(new Set(array));
    uniqueArray.sort();
    for (let i = 0; i < uniqueArray.length; i++) {
      const option = gen("option");
      option.textContent = uniqueArray[i];
      select.appendChild(option);
    }
  }

  /**
   * Generates hotel cards for the home page containing the
   * image of the hotel, the price, name, and country it's located
   * in.
   * @param {Object} hotels - The response containing hotel information
   * @returns {HTMLElement} - The generated hotel element.
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
    hotelLink.href = "item.html?hid=" + hotelCard.id;
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

  /**
   * Adds the country of the hotel to the provided array.
   * @param {Object} hotels - The hotel data.
   * @param {array} array - The array to add the country to.
   * @returns {array} - The updated array.
   */
  function addOption(hotels, array) {
    const countries = hotels.country;
    array.push(countries);
    return array;
  }

  /**
   * Makes a request to the server to filter hotels based on the provided search criteria.
   * Updates the display with the filtered hotels.
   */
  function makeRequestFilter() {
    if (qs("div > .issue")) {
      qs("div > .issue").remove();
    }
    qs(".error").classList.add("hidden");
    let search = id("hotel-name").value.trim();
    let country = qs(".filter select").value;
    let min = parseInt(id("minPrice").value);
    let max = parseInt(id("maxPrice").value);
    if (isNaN(min)) {
      min = "";
    }
    if (isNaN(max)) {
      max = "";
    }
    if (country === "Any Country") {
      country = "";
    }
    if (min > max && (min && max)) {
      qs(".error").classList.remove("hidden");
    } else {
      const url = '/hotels?search=' + search + "&country_filter=" + country +
        "&min=" + min + "&max=" + max;
      fetch(url)
        .then(statusCheck)
        .then(resp => resp.json())
        .then(filter)
        .catch(handleFilterError);
    }
  }

  /**
   * Handles filter errors by printing the error message
   * @param {Error|string} error - The error object or error message.
   */
  function handleFilterError(error) {
    const issue = gen("p");
    issue.classList.add("prompt");
    issue.classList.add("error");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    issue.classList.add("issue");
    qs(".error").parentNode.appendChild(issue);
  }

  /**
   * Filters the displayed hotels based on the response from the server.
   * Hides hotels that do not match the filter criteria and shows hotels that match.
   * @param {Object} response - The hotel data that matches the filter criteria
   */
  function filter(response) {
    const hotelId = response.hotels;
    const hotels = qsa(".display > a > div");
    for (let i = 0; i < hotels.length; i++) {
      let parent = hotels[i].parentNode;
      parent.classList.add("hidden");
    }
    for (let i = 0; i < hotelId.length; i++) {
      let parent = id(hotelId[i].hid).parentNode;
      parent.classList.remove("hidden");
    }
  }

  /**
   * Resets the filter input fields and displays all hotels.
   */
  function resetFilter() {
    qs(".error").classList.add("hidden");
    qs(".filter > input").value = "";
    qs(".filter > select").value = "Any Country";
    id("minPrice").value = "";
    id("maxPrice").value = "";
    const hotels = qsa(".display > a");
    for (let i = 0; i < hotels.length; i++) {
      hotels[i].classList.remove("hidden");
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

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();