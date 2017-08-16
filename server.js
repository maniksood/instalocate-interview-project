// Getting Dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');




// Getting API Routes
const api = require('./server/routes/api');
const four_square = require('./server/routes/four_square');
const google_maps = require('./server/routes/google_maps');
const mapbox = require('./server/routes/mapbox');
const uber = require('./server/routes/uber');
const yelp = require('./server/routes/yelp');



const app = express();

// Adding Parsers for POST Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Pointing Static Path to to dist (dist is a folder where the angular files compiles to)
app.use(express.static(path.join(__dirname, 'dist')));

// Set the API routes
app.use('/api', api);
app.use('/four_square', four_square);
app.use('/google_maps', google_maps);
app.use('/mapbox', mapbox);
app.use('/uber', uber);
app.use('/yelp', yelp);

// Catching all the other routes and returning index file to load the angular file
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Setting Headers (in case the angular app and server are on different ip's)
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//   next();
// });

// Getting port from environment and storing in express
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP Server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port, function(){console.log('API running on localhost: ' + port)} );
