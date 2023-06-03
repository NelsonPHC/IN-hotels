"use strict";
(function() {

  window.addEventListener('load', init);

  /**
   * initiates page upon load
   */
  function init() {
    makeRequestReservations();
    id("login").addEventListener("submit", makeRequestReservations);
  }

  function makeRequestReservations() {
    if (!qs(".prompt").classList.contains("hidden")) {
      qs(".prompt").classList.add("hidden");
    }
    qs("article > img").classList.toggle("hidden");
    setTimeout(checkUserLoggedIn, 1000);
    
  }

  function checkUserLoggedIn() {
    if (checkCookieExists("uid")){
      let params = new FormData();
      const uid = getCookieValue("uid")
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
    }
  }

  function viewReservations(response) {
    qs("article > img").classList.toggle("hidden");
    for (let i = 0; i < response.length; i++) {
      const card = gen("div");
      const img = gen("img");
      const div = gen("div");
      const name = gen("p");
      const reserve = gen("p");
      const price = gen("p");
      card.classList.add("card");
      name.classList.add("hotel-name");
      reserve.classList.add("reserve");
      price.classList.add("price");
      img.src = "imgs/hotels/" + response[i].imageSrc;
      img.alt = "Image of " + response[i].hotelName;
      name.textContent = response[i].hotelName;
      reserve.textContent = "Reservation date: " + response[i].checkin + " to " +
      response[i].checkout;
      price.textContent = "$" + response[i].price_per_night + "/night";
      qs(".adjust > article").appendChild(card);
      card.appendChild(img);
      card.appendChild(div);
      card.appendChild(price);
      div.appendChild(name);
      div.appendChild(reserve);
    }
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