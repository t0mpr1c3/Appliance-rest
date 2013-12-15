/**
 * Module dependencies.
 */
var express = require('express'),
  api = require('./routes/Appliance-api');
var app = express();

// Configuration

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.configure(function() {
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
});

// JSON API
app.get('/appliances', api.appliances);
app.get('/motes', api.motes);
app.get('/sensors', api.sensors);
app.get('/controlrules', api.controlrules);
app.get('/appliances/:id', api.appliance);
app.get('/motes/:id', api.mote);
app.get('/sensors/:id', api.sensor);
app.get('/controlrules/:id', api.controlrule);
app.post('/appliances', api.addAppliance);
app.post('/motes', api.addMote);
app.post('/sensors', api.addSensor);
app.post('/controlrules', api.addControlRule);
app.put('/appliances/:id', api.editAppliance);
app.delete('/appliances/:id', api.deleteAppliance);
app.delete('/motes/:id', api.deleteMote);
app.delete('/sensors/:id', api.deleteSensor);
app.delete('/controlrules/:id', api.deleteControlRule);

// Start server
app.listen(8000);
console.log("Server running at http://beaglebone:8000/");