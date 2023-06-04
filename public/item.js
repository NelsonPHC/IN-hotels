/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: June 3rd, 2023
 * Section: CSE 154 AG
 * This code generates the extended details of our hotels in the
 * item.html page and allows the users to book a reservation at the
 * hotel they selected from the home page. It also displays error
 * messages accordingly.
 */

"use strict";
(function() {
  const FOUR_SECONDS = 4000;
  window.addEventListener('load', init);

  /**
   * Initiates page upon load by loading the selected
   * hotel's information.
   */
  function init() {
    makeRequestFill();
    const form = id("book").parentNode;
    form.addEventListener("submit", function(event) {
      qs(".success").classList.add("hidden");
      qs(".conflict").classList.add("hidden");
      event.preventDefault();
      makeRequestBook();
    });
  }

  /**
   * Makes a request to fetch the details of a specific
   * hotel.
   */
  function makeRequestFill() {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelName = "/hotels/" + urlParams.get('hid');
    fetch(hotelName)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(fill)
      .catch(handleFillError);
  }

  /**
   * Handles the error that occurs while filling the form with hotel details.
   * Updates the error message, displays it, and hides the hotel information.
   * @param {Error} error - The error object received.
   */
  function handleFillError(error) {
    const issue = qs("h1");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    qs(".adjust article").classList.add("hidden");
  }

  /**
   * Fills the page with hotel details received from the API response.
   * Updates the image, hotel name, description, and enables the booking button.
   * @param {Object} response - The API response containing hotel details.
   */
  function fill(response) {
    const img = gen("img");
    let description = gen("p");
    const h2 = gen("h2");
    const h1 = qs('h1');
    const info = response[0];
    qs(".success").classList.add("hidden");
    qs(".conflict").classList.add("hidden");
    id("book").disabled = false;
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
   * Makes a request to book a hotel. Checks if the necessary fields are
   * filled and the user is logged in.
   */
  function makeRequestBook() {
    qs(".date-error").classList.add("hidden");
    if (!qs(".prompt").classList.contains("hidden")) {
      qs(".prompt").classList.add("hidden");
    }
    if (checkCookieExists("uid")) {
      let checkin = id("start").value.replace("T", " ");
      let checkout = id("end").value.replace("T", " ");
      if (compareDate(checkin, checkout)) {
        let params = createForm(checkin, checkout);
        fetch("/book", {method: "POST", body: params})
          .then(statusCheck)
          .then(resp => resp.text())
          .then(book)
          .catch(handleBookingError);
      } else {
        qs(".date-error").classList.remove("hidden");
      }
    } else {
      qs(".user-bar").classList.remove("hidden");
      qs(".prompt").classList.remove("hidden");
    }
  }

  /**
   * Creates a form data object with the necessary parameters for booking a hotel.
   * Retrieves the hotel ID (hid), check-in and check-out dates, and user ID (uid)
   * from the URL and cookies. Appends these parameters to a FormData object.
   * @param {String} checkin - The string of the checkin date
   * @param {String} checkout - The string of the checkin date
   * @returns {FormData} The FormData object containing the booking parameters.
   */
  function createForm(checkin, checkout) {
    let params = new FormData();
    const urlParams = new URLSearchParams(window.location.search);
    const hid = urlParams.get('hid');
    const uid = getCookieValue("uid");
    params.append("checkin", checkin);
    params.append("checkout", checkout);
    params.append("hid", hid);
    params.append("uid", uid);
    return params;
  }

  /**
   * Compares two dates to check if the check-out date is after the check-in date.
   * @param {string} checkin - The check-in date in string format.
   * @param {string} checkout - The check-out date in string format.
   * @returns {boolean} Returns true if the check-out date is after the
   * check-in date, false otherwise.
   */
  function compareDate(checkin, checkout) {
    if (checkout <= checkin) {
      return false;
    }
    return true;
  }

  /**
   * Handles the successful booking of a hotel. The user will
   * not be able to make any bookings in the meantime, and will
   * be sent to reservation.html after 4 seconds of making a
   * reservation.
   * @param {string} response - The success message and transaction number of the user's booking
   * @returns {void}
   */
  function book(response) {
    qs(".success").textContent = response;
    qs(".success").classList.remove("hidden");
    id("book").disabled = true;
    setTimeout(function() {
      window.location.href = "reservation.html";
    }, FOUR_SECONDS);
  }

  /**
   * Checks if a cookie with the specified name exists.
   * @param {string} cookieName - The name of the cookie to check.
   * @returns {boolean} - Returns true if the cookie exists, false otherwise.
   */
  function checkCookieExists(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      const cookieNameValue = decodeURIComponent(cookie[0]);
      if (cookieNameValue === cookieName) {
        return true;
      }
    }
    return false;
  }

  /**
   * Retrieves the value of a cookie with the specified name.
   * @param {string} cookieName - The name of the cookie to retrieve the value from.
   * @returns {string|null} - The value of the cookie if found, or null if the
   * cookie does not exist.
   */
  function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim().split('=');
      const cookieNameFromCookie = decodeURIComponent(cookie[0]);
      if (cookieNameFromCookie === cookieName) {
        const cookieValue = decodeURIComponent(cookie[1]);
        return cookieValue;
      }
    }
    return null;
  }

  /**
   * Handles the error that occurred during the booking process.
   * @param {Error|string} error - The error that occurred during booking.
   */
  function handleBookingError(error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    qs(".conflict").textContent = cleanedErrorMessage;
    qs(".conflict").classList.add("prompt");
    qs(".conflict").classList.remove("hidden");
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