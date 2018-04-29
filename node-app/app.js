'use strict';

var express = require('express')
var app = express()
var csv = require('csvtojson')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
})); 

// ***** Variables ***** //
class Device {
    constructor(name, macAddress, clientMacAddress, clientManuf, currentDate){
        this.name = name ;
        this.macAddress = macAddress;
        this.clientMacAddress = clientMacAddress;
        this.clientManuf = clientManuf;
        //array of dates
        this.dates = [];
        this.dates.append(currentDate);
     }  
}

// maps the clientMacAddress to the Device
let devices = new Map();

// maps the date to all the clientMacAddresses that were there at that time (each minutes)
let timeMap = new Map();

// param: IN 
// day : the day of the week (from 0-6)
function getNumberOfPeopleAtEachHours(day){
    let numberOfPeopleAtEachHours = []
    for (var i = 0; i < 24; i++) {
        numberOfPeopleAtEachHours.push({"avg": 0, "nb": 0});
    }
    
    for (var key in timeMap){
        console.log(key);
        if (key.getDay() == day) {
            let avg = numberOfPeopleAtEachHours[key.getHours()].avg;
            let nb = numberOfPeopleAtEachHours[key.getHours()].avg + 1;
            numberOfPeopleAtEachHours[key.getHours()].avg = ((avg * nb) / nb + 1) + (timeMap.get(key).length / nb + 1);
            numberOfPeopleAtEachHours[key.getHours()].nb += 1;
        }
    }
    return numberOfPeopleAtEachHours;
}

app.get('/', function(req,res){
    res.status(200).send('Salut toi !')
});

app.get('/all', function(req,res){
    res.status(200).send(devices.values())
});

app.post('/devices', function(req, res) {
    let jsonArray = JSON.parse(req.body.devices);
    let currentDate = new Date();
    let presentDevices = []
    jsonArray.forEach( function(device) {
        if (devices.get(device.clientMacAddress)) {
            devices.get(device.clientMacAddress).dates.append(currentDate);
            presentDevices.append(device.clientMacAddress)
        } else {
            devices.set(device.clientMacAddress, new Device(device.name, device.macAddress, device.clientMacAddress, device.clientManuf, currentDate));
        }
   } );
   if (presentDevices.length > 0) {
       timeMap.append(currentDate, presentDevices);
   }
   res.status(200).send('Success')
});

app.get('/numberOfPeopleAtEachHours', function(req,res){
    let day = req.params.day;
    if (day != undefined) {
        res.status(200).send(getNumberOfPeopleAtEachHours(req.params.day));
    } else {
        res.status(500).send('Error : Expected a day as input');
    }
});

app.get('/getNumberOfPeopleLive', function(req,res){
    // TODO create a new variable to store the last date instead of searching for the last date.
    let now =  timeMap.keys().reduce((a, b) =>  a > b ? a : b);
    res.status(200).send(timeMap.get(now).length);  
});

app.get('/cellphone', function(req,res){
    let newArray = devices.values().filter(function (el) {
        return el.clientManuf == "Apple" || el.clientManuf == "Google" || el.clientManuf == "SamsungE" ;
        });
    res.status(200).send(newArray)
});

let server = app.listen(process.env.PORT || '8081', function(){
    console.log('App listening on port %s', server.address().port);

})