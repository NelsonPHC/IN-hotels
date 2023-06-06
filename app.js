/**
 * Name: Nelson Po-Hao Chen & Isaac Yeoh
 * Date: June 3rd, 2023
 * Section: CSE 154 AG
 * The is the backend code for our final project, a hotel reservation site. It has six endpoints:
 * 1. User login
 * 1-1. Create a New User
 * 2. Get all hotel data or hotel data that matches the search and/or filter criteria (home page)
 * 3. Get hotel data by a given hotel ID (for item page)
 * 4. Make a booking
 * 5. Get all previous reservations for a designated user
 * For further details on the endpoints, please refer to the APIDOC.md file.
 *
 * Helper functions implemented include checking:
 * - valid format of datetime, email address, and hotel price range search inputs
 * - existence of user ID and hotel ID in the requests parameters
 * - hotel availability
 * The functions are placed after the api endpoints.
 */
'use strict';

const express = require('express');
const app = express();

const multer = require('multer');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// 1. User login (for every endpoint that requires user login, check if login cookie exist)
app.post('/login', async (req, res) => {
  res.type('text');
  let name = req.body.name;
  let pwd = req.body.password;
  if (name && pwd) {
    try {
      let db = await getDBConnection();
      const query = 'select uid from users where name = ? and password = ?';
      let queryResults = await db.all(query, [name, pwd]);
      await db.close();
      if (queryResults.length === 0) {
        res.status(400).send('Username or Password is incorrect, please try again');
      } else {
        let uid = queryResults[0].uid;

        // set uid cookie, used to make future requests associated with a logged in user
        res.cookie('uid', uid, {expires: new Date('Fri 31, Dec 9999 23:59:59 GMT')});
        res.send('you are now logged in');
      }
    } catch (err) {
      res.status(500).send('An error occurred on the server. Try again later.');
    }
  } else {
    res.status(400).send('Please enter both Username and Password');
  }
});

// 1-1. Create a New User
app.post('/create', async (req, res) => {
  res.type('text');
  let email = req.body.email;
  let name = req.body.name;
  let pwd = req.body.password;

  if (email && name && pwd) {
    if (isValidEmail(email)) {
      try {
        let db = await getDBConnection();
        const checkDuplicates = 'select * from users where name = ? or email = ?';
        let queryResults = await db.all(checkDuplicates, [name, email]);
        if (queryResults.length !== 0) {
          await db.close();
          res.status(400).send('Username or Email is already registered, please try again');
        } else {
          const createUser = 'insert into users (name, password, email) values (?,?,?)';
          await db.run(createUser, [name, pwd, email]);
          await db.close();
          res.send('User ' + name + ' is created!');
        }
      } catch (err) {
        res.status(500).send('An error occurred on the server. Try again later.');
      }
    } else {
      res.status(400).send('Please input a valid Email');
    }
  } else {
    res.status(400).send('Please enter Email, Username and Password');
  }
});

// 2. Get all hotel data or hotel data matching a given search term and/or filter
app.get('/hotels', async (req, res) => {
  let search = trimIfExist(req.query.search);
  let country = trimIfExist(req.query.country_filter);
  let min = trimIfExist(req.query.min);
  let max = trimIfExist(req.query.max);

  // in js should parse integer strings to Int for comparing the numerical values
  if (isValidIntegerString(min) && isValidIntegerString(max)) {
    if (parseInt(min) <= parseInt(max) || !(min && max)) { // check only when min max both defined
      try {
        let db = await getDBConnection();
        let q = queryParam(search, country, min, max);
        let queryResults = await db.all(q.query, q.values);
        await db.close();
        res.json({'hotels': queryResults});
      } catch (err) {
        res.type('text').status(500)
          .send('An error occurred on the server. Try again later.');
      }
    } else {
      res.type('text').status(400)
        .send('min must be less than or equal to max');
    }
  } else {
    res.type('text').status(400)
      .send('please input proper integer string format for min and max');
  }
});

// 3. Get hotel data by a given hotel ID
app.get('/hotels/:hid', async (req, res) => {
  let hid = req.params.hid;
  try {
    let db = await getDBConnection();
    let queryResults = await getHotelByID(db, hid);
    await db.close();
    if (queryResults.length === 0) {
      res.type('text').status(400)
        .send('hotel is not found');
    } else {
      res.json(queryResults);
    }
  } catch (err) {
    res.type('text').status(500)
      .send('An error occurred on the server. Try again later.');
  }
});

// 4. Make a booking
app.post('/book', async (req, res) => {
  res.type('text');
  let bod = req.body;
  let [uid, hid, checkin, checkout] = [req.cookies['uid'], bod.hid, bod.checkin, bod.checkout];

  try {
    let db = await getDBConnection();
    let bookingMsg = await getBookingMsg(db, uid, hid, checkin, checkout);
    if (bookingMsg === 'server error') {
      await db.close();
      res.status(500).send('An error occurred on the server. Try again later.');
    } else if (bookingMsg === 'success') {
      const query = 'insert into bookings (uid, hid, checkin, checkout) values (?,?,?,?)';
      let result = await db.run(query, [uid, hid, checkin, checkout]);
      await db.close();
      let successMsg = 'Booking has been successful! Your transaction number is ' + result.lastID +
      '. Please wait for a moment!';
      res.send(successMsg);
    } else {
      await db.close();
      res.status(400).send(bookingMsg);
    }
  } catch (err) {
    res.status(500).send('An error occurred on the server. Try again later.');
  }
});

// 5. Get all previous reservations for a designated user
app.post('/reservations', async (req, res) => {
  let uid = req.cookies['uid'];
  if (uid) {
    try {
      let db = await getDBConnection();
      if (await userIDExist(db, uid)) {
        let query =
        'select bid, hotelName, imageSrc, checkin, checkout, price_per_night' +
        ' from bookings b, hotels h where b.hid = h.hid and b.uid = ? order by checkin, checkout';
        let reservations = await db.all(query, uid);
        await db.close();
        res.json(reservations);
      } else {
        res.type('text').status(400)
          .send('user is not found');
      }
    } catch (err) {
      res.type('text').status(500)
        .send('An error occurred on the server. Try again later.');
    }
  } else {
    res.type('text').status(400)
      .send('You need to log in first to make a booking');
  }
});

/**
 * helper function to get the booking message indicating the status of the booking operation
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} uid the user ID
 * @param {integer} hid the hotel ID
 * @param {string} checkin check-in datetime string
 * @param {string} checkout check-out datetime string
 * @returns {string} a message indicating the status of the booking operation
 */
async function getBookingMsg(db, uid, hid, checkin, checkout) {
  let msg = '';
  if (uid && hid && checkin && checkout) {
    if (validInAndOut(checkin, checkout)) {
      try {
        let existErrorMsg = await userHotelInvalidMsg(db, uid, hid);
        if (!existErrorMsg) {
          if (await hotelAvailability(db, hid, checkin, checkout)) {
            msg = 'success'; // check this to see if the booking is succesful
          } else {
            msg = 'We\'re sorry, this hotel has already been booked in this timeslot,' +
            ' please choose a different date.';
          }
        } else {
          msg = existErrorMsg;
        }
      } catch (err) {
        msg = 'server error'; // check this err msg to set status to 500
      }
    } else {
      msg = 'The datetimes are invalid';
    }
  } else if (!uid) {
    msg = 'You need to log in first to make a booking';
  } else {
    msg = 'Missing required parameters';
  }

  return msg;
}

/**
 * checks if the checkin checkout datetime strings are valid:
 * 1. They are both of format YYYY-MM-DD HH:MI
 * 2. checkin datetime is before checkout date
 * @param {string} checkin datetime string of check-in
 * @param {string} checkout datetime string of check-out
 * @returns {boolean} true if the datetimes are valid, false otherwise
 */
function validInAndOut(checkin, checkout) {
  if (!isValidDateTimeFormat(checkin) || !isValidDateTimeFormat(checkout)) {
    return false;
  }

  const start = new Date(checkin);
  const end = new Date(checkout);

  return start < end;
}

/**
 * checks if a datetime string is of the format YYYY-MM-DD HH:MI
 * @param {string} dateTimeString a datetime string to be checked
 * @returns {boolean} true if the string is a valid datetime string, false otherwise
 */
function isValidDateTimeFormat(dateTimeString) {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  if (!regex.test(dateTimeString)) {
    return false; // Invalid format
  }

  const dateParts = dateTimeString.split(' ');
  const date = dateParts[0];
  const time = dateParts[1];

  // Check if the date part is valid
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false; // Invalid date format
  }

  // Check if the time part is valid
  const timeRegex = /^(?:0\d|1\d|2[0-3]):[0-5]\d$/;
  if (!timeRegex.test(time)) {
    return false; // Invalid time format
  }

  // Parse the date components
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  // Create a new Date object and check if the parsed values match
  const parsedDate = new Date(year, month - 1, day, hours, minutes);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day &&
    parsedDate.getHours() === hours &&
    parsedDate.getMinutes() === minutes
  );
}

/**
 * Helper function to check if the user ID exist first, then check if the hotel ID exist.
 * Returns the error message as a string for sending server response.
 * If no errors (both ID's exist), returns empty string (as a false condition).
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} uid the user ID
 * @param {integer} hid the hotel ID
 * @returns {string} an error message for server response.
 */
async function userHotelInvalidMsg(db, uid, hid) {
  let userExist = await userIDExist(db, uid);
  let hotel = await getHotelByID(db, hid);

  let message = '';

  if (!userExist) {
    message = 'user is not found';
  } else if (hotel.length === 0) {
    message = 'hotel is not found';
  }

  return message;
}

/**
 * helper function to checks if an user exist. db connection should be close in the parent function
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} uid the user ID
 * @returns {object} query result from the database
 */
async function userIDExist(db, uid) {
  const query = 'select * from users where uid = ?';
  let queryResults = await db.all(query, uid);

  return queryResults.length !== 0;
}

/**
 * helper function which gets the hotel information by hid, db connection should be close in the
 * parent function
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} hid the hotel ID
 * @returns {object} query result from the database
 */
async function getHotelByID(db, hid) {
  const query = 'select * from hotels where hid = ?';
  let queryResults = await db.all(query, hid);

  return queryResults;
}

/**
 * checks if the hotel is available for the checkin and checkout datetimes, need to close the
 * database object db afterwards in the parent function
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} hid hotel ID
 * @param {string} checkin check-in datetime of format YYYY-MM-DD HH:MI
 * @param {string} checkout check-out datetime of format YYYY-MM-DD HH:MI
 * @returns {boolean} true if the hotel is available, false otherwise
 */
async function hotelAvailability(db, hid, checkin, checkout) {
  let availablityQuery = 'select * from bookings where hid = ? ' +
      'and ((DATETIME(checkin) <= DATETIME(?) and DATETIME(?) < DATETIME(checkout)) ' + // checkin
      'or (DATETIME(checkin) < DATETIME(?) and DATETIME(?) <= DATETIME(checkout)))'; // checkout
  let booked = await db.all(availablityQuery, [hid, checkin, checkin, checkout, checkout]);
  return (booked.length === 0);
}

/**
 * trims the input string of white space on both sides if the string is defined
 * @param {string} str the input string
 * @returns {string} a potentially trimmed string
 */
function trimIfExist(str) {
  return str ? str.trim() : str;
}

/**
 * a helper function to check if the input email is of the format 'XXX@XXX.XXX'
 * @param {string} email the email string to be verified
 * @returns {boolean} true if it is a valid email string, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * helper to check if the defined input string only consists of non-trivial integers
 * (leading zeros will return false)
 * Note that if the input string is undefined will return true by default
 * @param {string} value input string to be checked
 * @returns {boolean} true if it is a integer string, false otherwise
 */
function isValidIntegerString(value) {
  const parsedValue = parseInt(value, 10);
  return !isNaN(parsedValue) && parsedValue.toString() === value || !value;
}

/**
 * based on the search or conditions applied, return the query and placeholder array for using sql
 * in node.js
 * @param {string} search search term for hotelName
 * @param {string} country the country filter
 * @param {string} min the min price of the hotel
 * @param {string} max the max price of the hotel
 * @returns {dictionary} a dictionary containing the query and placeholder array 'values',
 * with keys 'query' and 'values' respectively.
 */
function queryParam(search, country, min, max) {
  let filters = (search || country || min || max);
  let query = filters ? 'select hid from hotels where ' :
    'select * from hotels order by hotelName, country';
  let values = [];
  let conditions = [];

  newQueryCondition(conditions, 'hotelName like ?', values, search, true);
  newQueryCondition(conditions, 'lower(country) = lower(?)', values, country);
  newQueryCondition(conditions, 'price_per_night >= ?', values, min);
  newQueryCondition(conditions, 'price_per_night <= ?', values, max);

  // append the condition clauses to the query
  query += conditions.join(' and ');

  // if search or filter is specified, order the returned hid's
  if (filters) {
    query += ' order by hid';
  }

  let queryAndValues = {
    'query': query,
    'values': values
  };

  return queryAndValues;
}

/**
 * helper function to append condition clause and its corresponding values to the sql query, if the
 * value exist
 * @param {Array} conditions an array of strings storing the condition clauses
 * @param {string} newCondition a new condition clause to be pushed to 'conditions'
 * @param {Array} values an array of strings storing the condition values
 * @param {string} newValue the new value corresponding to the new condition clause
 * @param {boolean} isSearch indicate if the filter is a search, default is false. set it to true
 * for passing search filter condition
 */
function newQueryCondition(conditions, newCondition, values, newValue, isSearch = false) {

  /*
   * extra checking for search using the param isSearch to avoid passing %undefined%,
   * which will still be included in the query otherwise.
   */
  if (newValue && isSearch) {
    newValue = '%' + newValue + '%';
  }
  if (newValue) {
    conditions.push(newCondition);
    values.push(newValue);
  }
}

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'inhotel.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);