/**
 * Name: Isaac Yeoh & Nelson Chen
 * Date: June 3rd, 2023
 * Section: CSE 154 AG
 * This code generates the details of the hotel reserved by the user that's
 * logged in. If the user is not logged in and wants to view their reservations,
 * it will prompt them to log in first.
 */

"use strict";
(function() {
  const ONE_SECOND = 1000;
  window.addEventListener('load', init);

  /**
   * Initiates page upon load by automatically generating the
   * user's reservations or prompts them to log in.
   */
  function init() {
    makeRequestReservations();
    id("login").addEventListener("submit", makeRequestReservations);
    qs(".logged-in button").addEventListener("click", clearPage);
  }

  /**
   * Makes a request to retrieve reservations and handles the response.
   */
  function makeRequestReservations() {
    if (!qs(".prompt").classList.contains("hidden")) {
      qs(".prompt").classList.add("hidden");
      qs(".adjust > article > p").classList.add("hidden");
    }
    if (!qs(".adjust > article > p").classList.contains("hidden")) {
      qs(".adjust > article > p").classList.add("hidden");
    }
    qs("article > img").classList.toggle("hidden");
    setTimeout(checkUserLoggedIn, ONE_SECOND);
  }

  /**
   * Checks if the user is logged in and retrieves their reservations if they are.
   * Otherwise, it prompts the user to login.
   */
  function checkUserLoggedIn() {
    if (checkCookieExists("uid")) {
      let params = new FormData();
      const uid = getCookieValue("uid");
      params.append("uid", uid);
      fetch("/reservations", {method: "POST", body: params})
        .then(statusCheck)
        .then(resp => resp.json())
        .then(viewReservations)
        .catch(console.error);
    } else {
      qs("article > img").classList.toggle("hidden");
      qs(".user-bar").classList.remove("hidden");
      qs(".prompt").classList.remove("hidden");
      qs(".adjust > article > p").classList.remove("hidden");
    }
  }

  /**
   * Renders the user's reservations on the page.
   * @param {Object} response - The hotel data of the user that made the reservation.
   */
  function viewReservations(response) {
    qs("article > img").classList.toggle("hidden");
    for (let i = 0; i < response.length; i++) {
      const card = gen("div");
      const img = gen("img");
      const div = gen("div");
      const name = gen("p");
      const reserve = gen("p");
      const price = gen("p");
      const bid = gen("p");
      const group = gen("div");
      card.classList.add("card");
      name.classList.add("hotel-name");
      group.classList.add("reserve");
      price.classList.add("price");
      img.src = "imgs/hotels/" + response[i].imageSrc;
      img.alt = "Image of " + response[i].hotelName;
      name.textContent = response[i].hotelName;
      bid.textContent = "Transaction number: " + response[i].bid;
      reserve.textContent = "Reservation date: " + response[i].checkin.replace(" ", " at ") +
      " to " + response[i].checkout.replace(" ", " at ");
      price.textContent = "$" + response[i].price_per_night + "/night";
      qs(".adjust > article").appendChild(card);
      card.appendChild(img);
      card.appendChild(div);
      group.appendChild(bid);
      group.appendChild(reserve);
      card.appendChild(price);
      div.appendChild(name);
      div.appendChild(group);
    }
  }

  /**
   * Clears the reservations on the page and prompts the user to log in.
   */
  function clearPage() {
    const divs = qsa(".adjust > article > div.card");
    divs.forEach(div => div.remove());
    qs(".prompt").classList.remove("hidden");
    qs(".adjust > article > p").classList.remove("hidden");
    qs(".user-bar").classList.remove("hidden");
  }

  /**
   * Checks if a cookie with the specified name exists.
   * @param {string} cookieName - The name of the cookie to check.
   * @returns {boolean} - True if the cookie exists, false otherwise.
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
   * @returns {string|null} - The value of the cookie, or null if the cookie is not found.
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

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();