// Appliance-api.js
// execute commands
var util = require('util')
var exec = require('child_process').exec;
var sleep = require('sleep');
var request = require('request');

// FIXME save data to file when dirty
var data_dirty = false;
var data = {
  "appliances": [
    {
      "id": 0, "title": "Heating", "status": false, "controlling_mote_id": 1
    }, {
      "id": 1, "title": "Air Conditioner", "status": false, "controlling_mote_id": 2
    }, {
      "id": 2, "title": "Fan", "status": false, "controlling_mote_id": 2
    }, {
      "id": 3, "title": "Door Bell", "status": false, "controlling_mote_id": 3
    }, {
      "id": 4, "title": "Laundry Room Ceiling Lamp", "status": false, "controlling_mote_id": 4
    }
  ],
  "motes": [
    {
      "id": 0, "title": "beaglebone", "device_id": 0x50, "location": "office",
      "sensors": [
        { "measure_id": 0, "value": "", "timestamp": "" },
        { "measure_id": 1, "value": "", "timestamp": "" },
        { "measure_id": 2, "value": "", "timestamp": "" },
        { "measure_id": 3, "value": "", "timestamp": "" }
      ] 
    }, {
      "id": 1, "title": "basement mote", "device_id": 0x51, "location": "basement",
      "sensors": [
        { "measure_id": 2, "value": "", "timestamp": "" },
        { "measure_id": 4, "value": "", "timestamp": "" },
        { "measure_id": 5, "value": "", "timestamp": "" }
      ] 
    }, {
      "id": 2, "title": "hallway mote", "device_id": 0x52, "location": "1st floor hallway",
      "sensors": [
        { "measure_id": 2, "value": "", "timestamp": "" },
        { "measure_id": 3, "value": "", "timestamp": "" }
      ] 
    }, {
      "id": 3, "title": "porch mote", "device_id": 0x53, "location": "front porch",
      "sensors": [
        { "measure_id": 4, "value": "", "timestamp": "" },
        { "measure_id": 5, "value": "", "timestamp": "" }
      ] 
    }, {
      "id": 4, "title": "laundry mote", "device_id": 0x54, "location": "laundry",
      "sensors": [
        { "measure_id": 4, "value": "", "timestamp": "" },
        { "measure_id": 5, "value": "", "timestamp": "" }
      ] 
    }
  ],
  "measures": [
    {
      "id": 0, "title": "real time clock", "unit": "day", "hysteresis": 0 
    }, {
      "id": 1, "title": "real time clock", "unit": "time", "hysteresis": 0
    }, {
      "id": 2, "title": "temperature", "unit": "Celsius", "hysteresis": 1.0
    }, {
      "id": 3, "title": "humidity", "unit": "%", "hysteresis": 0.05
    }, {
      "id": 4, "title": "PIR detector", "unit": "binary", "hysteresis": 0
    }, {
      "id": 5, "title": "ambient light", "unit": "%", "hysteresis": 0.10
    }, {
      "id": 6, "title": "reed switch", "unit": "binary", "hysteresis": 0
    }
  ],
  "controlrules": [
    {
      "id": 0, "title": "heating on weekday morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "06:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "08:30:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 1, "title": "heating off weekday morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" }
      ] , "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "08:30:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 2, "title": "heating on weekday evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 3, "title": "heating off weekday evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 4, "title": "heating on weekend morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "06:30:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "10:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 5, "title": "heating off weekend morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "10:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 6, "title": "heating on weekend evening temperature rule", "actions": [ 
        { "appliance_id": 1, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 7, "title": "heating off weekend evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 8, "title": "AC on weekday morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "06:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "08:30:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 9, "title": "AC off weekday morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "08:30:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 10, "title": "AC on weekday evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 11, "title": "AC off weekday evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 12, "title": "AC on weekend morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "06:30:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "10:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 13, "title": "AC off weekend morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "10:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 14, "title": "AC on weekend evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_id": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 15, "title": "AC off weekend evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_id": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_id": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_id": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_id": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_id": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, 
  ], 
  "windows": [{
      'id': 0, 'title': 'weekday morning', 'days': 31, 'start': 18000000,
      'end': 30600000, 'duration': 0, 'deadTime': 0
    }, {
      'id': 1, 'title': 'weekday evening', 'days': 31, 'start': 61200000,
      'end': 79200000, 'duration': 0, 'deadTime': 0
    }, {
      'id': 2, 'title': 'weekend morning', 'days': 96, 'start': 21600000,
      'end': 36000000, 'duration': 3600000, 'deadTime': 0
    }, {
      'id': 3, 'title': 'weekend evening', 'days': 96, 'start': 57600000,
      'end': 79200000, 'duration': 1000, 'deadTime': 60000
  }]
};

// GET
exports.getAppliances = function (req, res) {
  console.log('Getting appliances.');
  res.json(data.appliances);
};

exports.getMotes = function (req, res) {
  console.log('Getting motes.');
  res.json(data.motes);
};

exports.getMeasures = function (req, res) {
  console.log('Getting measures.');
  res.json(data.measures);
};

exports.getControlRules = function (req, res) {
  console.log('Getting control rules.');
  res.json(data.controlrules);
};

exports.getWindows = function (req, res) {
  console.log('Getting windows.');
  res.json(data.windows);
};

exports.getAppliance = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.appliances.length; i++) {
    if (id == data.appliances[i].id) {
      res.json(data.appliances[i]);
      return;
    }
  }
  res.json(404); // not found
};

exports.getMote = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id == data.motes[i].id) {
      res.json(data.motes[i]);
      return;
    }
  }
  res.json(404); // Not found
};

exports.getMeasure = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.measures.length; i++) {
    if (id == data.measures[i].id) {
      res.json(data.measures[i]);
      return;
    }
  }
  res.json(404); // Not found
};

exports.getControlRule = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.controlrules.length; i++) {
    if (id == data.controlrules[i].id) {
      res.json(data.controlrules[i]);
      return;
    }
  }
  res.json(404); // Not found
};

exports.getWindow = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.windows.length; i++) {
    if (id == data.windows[i].id) {
      res.json(data.windows[i]);
      return;
    }
  }
  res.json(404); // Not found
};

/*
request({
  url: "http://private-3db18-appliance.apiary.io/appliances",
  method: "GET"
}, function (error, response, body) {
  console.log("Status", response.statusCode);
  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received", body);
});
*/

/*
request({
  url: "http://private-3db18-appliance.apiary.io/appliance/0",
  method: "GET"
}, function (error, response, body) {
  console.log("Status", response.statusCode);
  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received", body);
});
*/

// POST
exports.addAppliance = function (req, res) {
  var newAppliance = req.body;
  newAppliance.id = data.appliances[data.appliances.length - 1].id + 1;
  //newAppliance.status = "off";
  console.log('Adding appliance: ' + JSON.stringify(newAppliance));
  data.appliances.push(newAppliance);
  data_dirty = true;
  res.send(201); // OK
};

exports.addMote = function (req, res) {
  var newMote = req.body;
  newMote.id = data.motes[data.motes.length - 1].id + 1;
  console.log('Adding mote: ' + JSON.stringify(newMote));
  data.motes.push(newMote);
  data_dirty = true;
  res.send(201); // OK
};

exports.addMeasure = function (req, res) {
  var newMeasure = req.body;
  newMeasure.id = data.measures[data.measures.length - 1].id + 1;
  console.log('Adding measure: ' + JSON.stringify(newMeasure));
  data.measures.push(newMeasure);
  data_dirty = true;
  res.send(201); // OK
};

exports.addControlRule = function (req, res) {
  var newControlRule = req.body;
  newControlRule.id = data.controlrules[data.controlrules.length - 1].id + 1;
  console.log('Adding control rule: ' + JSON.stringify(newControlRule));
  data.controlrules.push(newControlRule);
  data_dirty = true;
  res.send(201); // OK
};

exports.addWindow = function (req, res) {
  var newWindow = req.body;
  newWindow.id = data.windows[data.windows.length - 1].id + 1;
  console.log('Adding window: ' + JSON.stringify(newWindow));
  data.windows.push(newWindow);
  data_dirty = true;
  res.send(201); // OK
};

/*
request({
  url: "http://private-3db18-appliance.apiary.io/appliances",
  body: "{ \"title\": \"Appliance\", \"status\": \"off\" }",
  headers: {"Content-Type": "application/json"},
  method: "POST"
}, function (error, response, body) {
  console.log("Status", response.statusCode);
  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received", body);
});
*/

// PUT
exports.editAppliance = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.appliances.length; i++) {
    if (id == data.appliances[i].id) {
      console.log('Updating appliance with id ' + id);
      data.appliances[i] = req.body;
      res.send(200); // OK
      data_dirty = true;
      for (var j = 0; j < data.motes.length; j++) {
        if (req.body.controlling_mote_id === data.motes[j].id) {
          applianceStatus(req.body.title, data.motes[j].device_id, req.body.status);
          return;
        }
      }
    }
  }
  res.json(404); // not found
};

exports.editMote = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id == data.motes[i].id) {
      console.log('Updating mote with id: ' + id);
      data.motes[i] = req.body;
      data_dirty = true;
      res.send(200); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.editMeasure = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.measures.length; i++) {
    if (id == data.measures[i].id) {
      console.log('Updating measure with id: ' + id);
      data.measures[i] = req.body;
      data_dirty = true;
      res.send(200); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.editControlRule = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.controlrules.length; i++) {
    if (id == data.controlrules[i].id) {
      console.log('Updating control rule with id: ' + id);
      data.controlrules[i].conditions = req.body;
      data_dirty = true;
      res.send(200); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.editWindow = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.windows.length; i++) {
    if (id == data.windows[i].id) {
      console.log('Updating window with id: ' + id);
      data.windows[i] = req.body;
      data_dirty = true;
      res.send(200); // OK
      return;
    }
  }
  res.json(404); // Not found
};


// DELETE
exports.deleteAppliance = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.appliances.length; i++) {
    if (id == data.appliances[i].id) {
      console.log('Deleting appliance with id: ' + id);
      data.appliances.splice(i, 1);
      data_dirty = true;
      res.send(204); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteMote = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id == data.motes[i].id) {
      console.log('Deleting mote with id: ' + id);
      data.motes.splice(i, 1);
      data_dirty = true;
      res.send(204); // OK 
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteMeasure = function (req, res) {
      console.log('Try Deleting measure with id: ' + id);
  var id = req.params.id;
  for (var i = 0; i < data.measures.length; i++) {
    if (id == data.measures[i].id) {
      console.log('Deleting measure with id: ' + id);
      data.measures.splice(i, 1);
      data_dirty = true;
      res.send(204); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteControlRule = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.controlrules.length; i++) {
    if (id == data.controlrules[i].id) {
      console.log('Deleting control rule with id: ' + id);
      data.controlrules.splice(i, 1);
      data_dirty = true;
      res.send(204); // OK
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteWindow = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.windows.length; i++) {
    if (id == data.windows[i].id) {
      console.log('Deleting window with id: ' + id);
      data.windows.splice(i, 1);
      data_dirty = true;
      res.send(204); // OK
      return;
    }
  }
  res.json(404); // Not found
};

/*
request({
  url: "http://private-3db18-appliance.apiary.io/appliance/0",
  method: "DELETE"
}, function (error, response, body) {
  console.log("Status", response.statusCode);
  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received", body);
});
*/

function applianceStatus (appliance_title, controlling_mote_device_id, status) {
  // FIX messaging motes
  // dummy function for now
  var execString = "echo 'message radio device " + controlling_mote_device_id + ": set " + appliance_title + " to " + status + "'";
  console.log("Executing: " + execString);
  exec(execString, puts);
  sleep.sleep(1); // sleep for 1 seconds
}

function puts (error, stdout, stderr) { 
  util.puts(stdout); 
  console.warn("Executing Done");
}
