'use strict';

const express = require('express');
const multer = require('multer');
const request = require('request');
const app = express();

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

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);