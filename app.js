'use strict';

const express = require('express');
const app = express();

const multer = require('multer');
const request = require('request');

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

/*
 * Building our own proxy server to bypass CORS issue with Google places API
 */
// adds the necessary CORS headers to the proxy response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/places', (req, res) => {
  request(
    {url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0&fields=address_components&key=AIzaSyAN5au_ZHKqsGwcq1bTufMgbEKAojvh3aw'},
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({type: 'error', message: error.message});
      }
      res.json(JSON.parse(body));
    }
  );
});

// User login (for every endpoint that requires user login, check if login cookie exist)
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
        res.status(400).send('User name or password is incorrect, please try again');
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
    res.status(400).send('Please enter both user name and password');
  }
});

// 2. Get all hotel data or hotel data matching a given search term and/or filter
app.get('/hotels', async (req, res) => {
  let search = req.query.search;
  let filter = req.query.country_filter;
  try {
    let db = await getDBConnection();
    let q = queryParam(search, filter);
    let queryResults = await db.all(q.query, q.inputArr);
    await db.close();
    res.json({'hotels': queryResults});
  } catch (err) {
    res.type('text').status(500)
      .send('An error occurred on the server. Try again later.');
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
  // use req.body.uid for uid when testing using thunderclient
  let bod = req.body;
  let [uid, hid, checkin, checkout] = [req.cookies['uid'], bod.hid, bod.checkin, bod.checkout];
  if (uid && hid && checkin && checkout) {
    if (validInAndOut(checkin, checkout)) {
      try {
        let db = await getDBConnection();
        let existErrorMsg = await userHotelInvalidMsg(db, uid, hid);
        if (!existErrorMsg) {
          if (await hotelAvailability(db, hid, checkin, checkout)) {
            const query = 'insert into bookings (uid, hid, checkin, checkout) values (?,?,?,?)';
            await db.run(query, [uid, hid, checkin, checkout]);
            res.send('Booked!');
          } else {
            res.status(400).send('The hotel is unavailable during that time slot.');
          }
          await db.close();
        } else {
          res.status(400).send(existErrorMsg);
        }
      } catch (err) {
        res.status(500).send('An error occurred on the server. Try again later.');
      }
    } else {
      res.status(400).send('The dates are invalid');
    }
  } else if (!uid) {
    res.status(400).send('You need to log in first to make a booking');
  } else {
    res.status(400).send('Missing required parameters');
  }
});

/**
 * checks if the checkin checkout date strings are valid:
 * 1. They are both of format YYYY-MM-DD
 * 2. checkin date is before checkout date
 * @param {string} checkin date string of check-in
 * @param {string} checkout date string of check-out
 * @returns {boolean} true if the dates are valid, false otherwise
 */
function validInAndOut(checkin, checkout) {
  if (!isValidDate(checkin) || !isValidDate(checkout)) {
    return false;
  }

  const start = new Date(checkin);
  const end = new Date(checkout);

  return start < end;
}

/**
 * checks if a date string is of the format YYYY-MM-DD
 * @param {string} dateString a date string of format YYYY-MM-DD
 * @returns {boolean} true if the string is a date string, false otherwise
 */
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return !isNaN(Date.parse(dateString)) && regex.test(dateString);
}

/**
 * Helper function to check if the user ID exist first, then check if the hotel ID exist.
 * Returns the error message as a string for sending server response.
 * If no errors (both ID's exist), returns empty string.
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
 * checks if the hotel is available for the checkin and checkout dates, need to close the
 * database object db afterwards in the parent function
 * @param {sqlite3.Database} db The database object for the connection.
 * @param {integer} hid hotel ID
 * @param {string} checkin check-in date of format YYYY-MM-DD
 * @param {string} checkout check-out date of format YYYY-MM-DD
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
 * based on the search or filter are applied, return the query and placeholder array for using sql
 * in node.js
 * @param {string} search search term for hotelName
 * @param {string} filter the country filter
 * @returns {dictionary} a dictionary containing the query and placeholder array, with keys 'query'
 * and 'inputArr' respectively.
 */
function queryParam(search, filter) {
  let query = (search || filter) ? 'select hid from hotels where ' :
    'select * from hotels order by hotelName, country';
  let inputArr = [];
  if (search) {
    query += 'hotelName like ? ';
    inputArr.push('%' + search + '%');
    if (filter) {
      query += 'and lower(country) = lower(?) ';
      inputArr.push(filter);
    }
  } else if (filter) {
    query += 'lower(country) = lower(?) ';
    inputArr.push(filter);
  }

  if (search || filter) { // if search or filter is specified, order the returned hid's
    query += 'order by hid';
  }

  let queryAndInput = {
    'query': query,
    'inputArr': inputArr
  };

  return queryAndInput;
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