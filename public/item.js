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
    const form = id("book").parentNode;
    form.addEventListener("submit", function(event) {
      qs(".success").classList.add("hidden");
      qs(".conflict").classList.add("hidden");
      event.preventDefault();
      makeRequestBook();
    });
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
      .catch(handleFillError);
  }

  function handleFillError(error) {
    const issue = qs("h1");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const cleanedErrorMessage = errorMessage.replace("Error: ", "");
    issue.textContent = cleanedErrorMessage;
    qs(".adjust article").classList.add("hidden");
  }

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

  function makeRequestBook() {
    qs(".date-error").classList.add("hidden");
    if (!qs(".prompt").classList.contains("hidden")) {
      qs(".prompt").classList.add("hidden");
    }
    if (checkCookieExists("uid")) {
      const checkin = id("start").value;
      const checkout = id("end").value;
      if (compareDate(checkin, checkout)){
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

  function createForm() {
    let params = new FormData();
    const urlParams = new URLSearchParams(window.location.search);
    const hid = urlParams.get('hid');
    const checkin = id("start").value;
    const checkout = id("end").value;
    const uid = getCookieValue("uid");
    params.append("checkin", checkin);
    params.append("checkout", checkout);
    params.append("hid", hid);
    params.append("uid", uid);
    return params;
  }

  function compareDate(checkin, checkout) {
    if (checkout <= checkin) {
      return false;
    }
    return true;
  }

  function book() {
    qs(".success").classList.remove("hidden");
    id("book").disabled = true;
    setTimeout(function() {
      window.location.href = "reservation.html";
    }, 4000);
  }

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