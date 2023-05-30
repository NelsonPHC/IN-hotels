'use strict';

const express = require('express');
const app = express();

const multer = require('multer');
const request = require('request');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

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

// User login
app.post('/user', async (req, res) => {
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
        res.send(uid.toString()); // integer need to be parsed to string
      }
    } catch (err) {
      res.status(500).send('An error occurred on the server. Try again later.');
    }
  } else {
    res.status(400).send('Please enter both user name and password');
  }
});

// Get all hotel data or hotel data matching a given search term and/or filter
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

// Get all distint countries of the hotels
app.get('/countries', async (req, res) => {
  try {
    let db = await getDBConnection();
    const query = 'select distinct country from hotels order by country';
    let queryResults = await db.all(query);
    await db.close();
    res.json({'countries': queryResults});
  } catch (err) {
    res.type('text').status(500)
      .send('An error occurred on the server. Try again later.');
  }
});

// Get hotel data by a given hotel ID
app.get('/hotels/:hid', async (req, res) => {
  let hid = req.params.hid;
  try {
    let db = await getDBConnection();
    const query = 'select * from hotels where hid = ?';
    let queryResults = await db.all(query, hid);
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