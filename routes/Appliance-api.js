// Appliance-api.js
// execute commands
var util = require('util')
var exec = require('child_process').exec;
var sleep = require('sleep');
var request = require('request');

var data = {
  "appliances": [
    {
      "id": 0, "title": "Heating", "status": "off", "controlling_mote_id": 1
    }, {
      "id": 1, "title": "Air Conditioner", "status": "off", "controlling_mote_id": 2
    }, {
      "id": 2, "title": "Fan", "status": "off", "controlling_mote_id": 2
    }, {
      "id": 3, "title": "Door Bell", "status": "off", "controlling_mote_id": 3
    }, {
      "id": 4, "title": "Laundry Room Ceiling Lamp", "status": "off", "controlling_mote_id": 4
    }
  ],
  "motes": [
    {
      "id": 0, "title": "beaglebone", "device_id": 0x50, "location": "office",
      "sensors": [
        { "measure_id": 0, "value": "0", "timestamp": "0" },
        { "measure_id": 1, "value": "0", "timestamp": "0" },
        { "measure_id": 2, "value": "0", "timestamp": "0" }
        { "measure_id": 3, "value": "0", "timestamp": "0" }
      ] 
    }, {
      "id": 1, "title": "basement mote", "device_id": 0x51, "location": "basement",
      "sensors": [
        { "measure_id": 2, "value": "0", "timestamp": "0" },
        { "measure_id": 4, "value": "0", "timestamp": "0" },
        { "measure_id": 5, "value": "0", "timestamp": "0" }
      ] 
    }, {
      "id": 2, "title": "hallway mote", "device_id": 0x52, "location": "1st floor hallway",
      "sensors": [
        { "measure_id": 2, "value": "0", "timestamp": "0" },
        { "measure_id": 3, "value": "0", "timestamp": "0" }
      ] 
    }, {
      "id": 3, "title": "porch mote", "device_id": 0x53, "location": "front porch",
      "sensors": [
        { "measure_id": 4, "value": "0", "timestamp": "0" },
        { "measure_id": 5, "value": "0", "timestamp": "0" }
      ] 
    }, {
      "id": 4, "title": "laundry mote", "device_id": 0x54, "location": "laundry",
      "sensors": [
        { "measure_id": 4, "value": "0", "timestamp": "0" },
        { "measure_id": 5, "value": "0", "timestamp": "0" }
      ] 
    }
  ],
  "measures": [
    {
      "id": 0, "title": "real time clock", "unit": "day"
    }, {
      "id": 1, "title": "real time clock", "unit": "time"
    }, {
      "id": 2, "title": "temperature", "unit": "Celsius"
    }, {
      "id": 3, "title": "humidity", "unit": "%"
    }, {
      "id": 4, "title": "PIR detector", "unit": "binary"
    }, {
      "id": 5, "title": "ambient light", "unit": "%"
    }, {
      "id": 6, "title": "reed switch", "unit": "binary"
    }
  ],
  "controlrules": [
    {
      "id": 0, "title": "heating on weekday morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "06:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "08:30:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 1, "title": "heating off weekday morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" }
      ] , "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "08:30:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 2, "title": "heating on weekday evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 3, "title": "heating off weekday evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 4, "title": "heating on weekend morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "on" }
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "06:30:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "10:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 5, "title": "heating off weekend morning temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "10:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 6, "title": "heating on weekend evening temperature rule", "actions": [ 
        { "appliance_id": 1, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "17.5" }
      ] 
    }, {
      "id": 7, "title": "heating off weekend evening temperature rule", "actions": [
        { "appliance_id": 1, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "18.5" }
      ] 
    }, {
      "id": 8, "title": "AC on weekday morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "06:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "08:30:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 9, "title": "AC off weekday morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "08:30:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 10, "title": "AC on weekday evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 11, "title": "AC off weekday evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Monday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Friday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 12, "title": "AC on weekend morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "06:30:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "10:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 13, "title": "AC off weekend morning humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "10:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "17:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "lt", "value": "0.70" }
      ] 
    }, {
      "id": 14, "title": "AC on weekend evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "on" }, 
        { "appliance_id": 3, "set_status": "on" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "17:00:00" }, 
        { "mote_id": 0, "sensor_index": 1, "operator": "lt", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "gt", "value": "26.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "gt", "value": "0.80" }
      ] 
    }, {
      "id": 15, "title": "AC off weekend evening humidity rule", "actions": [
        { "appliance_id": 2, "set_status": "off" }, 
        { "appliance_id": 3, "set_status": "off" } 
      ], "conditions": [ 
        { "mote_id": 0, "sensor_index": 0, "operator": "ge", "value": "Saturday" }, 
        { "mote_id": 0, "sensor_index": 0, "operator": "lt", "value": "Sunday" },
        { "mote_id": 0, "sensor_index": 1, "operator": "ge", "value": "22:00:00" },
        { "mote_id": 2, "sensor_index": 0, "operator": "lt", "value": "27.5" },
        { "mote_id": 2, "sensor_index": 1, "operator": "lt", "value": "0.70" }
      ] 
    }
  ]   
};

// GET
exports.appliances = function (req, res) {
  console.log('Getting appliances.');
  var appliances = [];
  res.json(data.appliances);
};

exports.motes = function (req, res) {
  console.log('Getting motes.');
  var motes = [];
  res.json(data.motes);
};

exports.measures = function (req, res) {
  console.log('Getting measures.');
  var measures = [];
  res.json(data.measures);
};

exports.controlrules = function (req, res) {
  console.log('Getting control rules.');
  var controlrules = [];
  res.json(data.controlrules);
};

exports.appliance = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.appliances.length; i++) {
    if (id === data.appliances[i].id) {
      res.json(data.appliances[i]);
      return;
    }
  }
  res.json(404); // not found
};

exports.mote = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id === data.motes[i].id) {
      res.json(data.motes[i]);
      return;
    }
  }
  res.json(404); // Not found
};

exports.measure = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.measures.length; i++) {
    if (id === data.measures[i].id) {
      res.json(data.measures[i]);
      return;
    }
  }
  res.json(404); // Not found
};

exports.controlrule = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.controlrules.length; i++) {
    if (id === data.controlrules[i].id) {
      res.json(data.controlrules[i]);
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
  url: "http://private-3db18-appliance.apiary.io/appliances/1",
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
  newAppliance.id = data.appliances[data.appliances.length].id + 1;
  //newAppliance.status = "off";
  console.log('Adding appliance: ' + JSON.stringify(newAppliance));
  data.appliances.push(newAppliance);
  res.send(200); // OK
};

exports.addMote = function (req, res) {
  var newMote = req.body;
  newMote.id = data.motes[data.motes.length].id + 1;
  console.log('Adding mote: ' + JSON.stringify(newMote));
  data.motes.push(newMote);
  res.send(200); // OK
};

exports.addMeasure = function (req, res) {
  var newMeasure = req.body;
  newMeasure.id = data.measures[data.measures.length].id + 1;
  console.log('Adding measure: ' + JSON.stringify(newMeasure));
  data.measures.push(newMeasure);
  res.send(200); // OK
};

exports.addControlRule = function (req, res) {
  var newControlRule = req.body;
  newControlRule.id = data.controlrules[data.controlrules.length].id + 1;
  console.log('Adding control rule: ' + JSON.stringify(newControlRule));
  data.controlrules.push(newControlRule);
  res.send(200); // OK
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
exports.editApplianceStatus = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.appliances.length; i++) {
    if (id === data.appliances[i].id) {
      for (var j = 0; j < data.motes.length; i++) {
        if (data.appliances[i].controlling_mote_id === mote[j].id) {
          console.log('Status of appliance with id: ' + id + " to " + req.body.status);
          applianceStatus(data.appliances[i].title, data.motes[j].device_id, req.body.status);
          data.appliances[i].status = req.body.status;
          res.send(200); // OK
          return;
        }
      }
    }
  }
  res.json(404); // not found
};

exports.editMoteSensors = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id === data.motes[i].id) {
      console.log('Updating sensors for mote with id: ' + id);
      data.motes[i].sensors = req.body;
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
    if (id === data.appliances[i].id) {
      console.log('Delete appliance with id: ' + id);
      data.appliances.splice(i, 1);
      res.send(204); 
      return;
    }
  }
};

exports.deleteMote = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.motes.length; i++) {
    if (id === data.motes[i].id) {
      console.log('Delete mote with id: ' + id);
      data.motes.splice(i, 1);
      res.send(204); 
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteMeasure = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.measures.length; i++) {
    if (id === data.measures[i].id) {
      console.log('Delete measure with id: ' + id);
      data.measures.splice(i, 1);
      res.send(204); 
      return;
    }
  }
  res.json(404); // Not found
};

exports.deleteControlRule = function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < data.controlrules.length; i++) {
    if (id === data.controlrules[i].id) {
      console.log('Delete control rule with id: ' + id);
      data.controlrules.splice(i, 1);
      res.send(204); 
      return;
    }
  }
  res.json(404); // Not found
};

/*
request({
  url: "http://private-3db18-appliance.apiary.io/appliances/1",
  method: "DELETE"
}, function (error, response, body) {
  console.log("Status", response.statusCode);
  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received", body);
});
*/

function applianceStatus (appliance_title, controlling_mote_device_id, status) {
  // FIX messaging motes
  var execString = "radiomessage " + controlling_mote_device_id + appliance_title + status;
  console.log("Executing: " + execString);
  exec(execString, puts);
  sleep.sleep(1); // sleep for 1 seconds
}

function puts (error, stdout, stderr) { 
  util.puts(stdout); 
  console.warn("Executing Done");
}
