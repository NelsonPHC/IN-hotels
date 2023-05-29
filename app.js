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

// Get all hotel data or hotel data matching a given hotel ID
app.get('/hotels', async (req, res) => {
  let hid = req.query.hid;
  try {
    let db = await getDBConnection();
    const query = hid ? 'select * from hotels where hid = ?' :
      'select * from hotels order by hotelName';
    let queryResults = await db.all(query, hid ? hid : []);
    await db.close();
    if (queryResults.length === 0) {
      res.type('text').status(400)
        .send('hotel is not found.');
    } else {
      res.json({'hotels': queryResults});
    }
  } catch (err) {
    res.type('text').status(500)
      .send('An error occurred on the server. Try again later.');
  }
});

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