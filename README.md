Appliance-rest
=============

#RESTful API for the based on rcswitch library for node.js/express, documented http://blog.codecentric.de/en/2013/03/home-automation-with-angularjs-and-node-js-on-a-raspberry-pi.

##Add a new switch to the configuration
	curl -i -X POST -H 'Content-Type: application/json' -d '{"id": "0", "name": "Local fan", "status": "off", "controlling-mote-id": 5}' http://beaglebone:8000/appliances

##Get the list of active switches
	curl -i -X GET http://beaglebone:8000/appliances

##Turn switch on
	curl -i -X PUT -H 'Content-Type: application/json' -d '{"status": "1"}' http://beaglebone:8000/appliances/0

##Turn switch off
	curl -i -X PUT -H 'Content-Type: application/json' -d '{"status": "0"}' http://beaglebone:8000/appliances/0

##Remove switch configuration
	curl -i -X DELETE http://beaglebone:8000/appliances/0
