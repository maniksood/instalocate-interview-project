const express = require('express');
const router = express.Router();
var Uber = require('node-uber');

var uber = new Uber({
  client_id: '...',
  client_secret: '...',
  server_token: '...',
  redirect_uri: 'http://localhost:3000/uber/callback',
  name: 'instalocate interview project',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true, // optional, defaults to false
  proxy: 'PROXY URL' // optional, defaults to none
});

// Listing API endpoints
router.get('/', function(req, res, next){
  res.send('uber works');
});

router.get('/login', function(req, res) {
  var scope = ['request'];
  url = uber.getAuthorizeUrl(scope, 'http://localhost:3000/callback');
  res.redirect(url);
});

router.get('/callback', function (req, res) {
  uber.authorization ({grantType: 'authorization_code', authorization_code: req.query.code}, function (err, access_token) {
    // Now we've got an access token we can use to book rides.
    // Access tokens expires in 30 days at whichpoint you can refresh.
    // You should save this token
    // More info: https://developer.uber.com/docs/authentication
    uber.access_token = access_token;
    console.log('Got an access token! Head to /book to initiate an ride request.');
    res.redirect('http://localhost:3000/cabs');

  });
});

router.get('/products', function(request, response) {
  // extract the query from the request URL
  var query = url.parse(request.url, true).query;

  // if no query params sent, respond with Bad Request
  if (!query || !query.lat || !query.lng) {
    response.sendStatus(400);
  } else {
    uber.products.getAllForLocationAsync(query.lat, query.lng)
      .then(function(res) {
        response.json(res);
      })
      .error(function(err) {
        console.error(err);
        response.sendStatus(500);
      });
  }
});


router.get('/book', function (req, res) {
  var rideDetails = {
    start_latitude: 123,
    start_longitude: 123,
    product_id: "a1111c8c-c720-46c3-8534-2fcdd730040d" // SF Uber X
  };

  uber.requests.requestRide(rideDetails, function (err, result) {
    if (err) {
      // Failed
      console.log(err);
    } else{
      res.send("An Uber is on the way!");
    }
  })
});

module.exports = router;
