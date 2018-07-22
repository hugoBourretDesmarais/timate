'use strict';

var express = require('express')
var app = express()
var csv = require('csvtojson')
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(cors())

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
        let tuple = [currentDate, currentDate]
        this.dates = [tuple];
     }  
}

// maps the clientMacAddress to the Device
let devices = new Map();

// maps the date to all the clientMacAddresses that were there at that time (each minutes)
let timeMap = new Map();

let numberCall = 0;

// param: IN 
// day : the day of the week (from 0-6)
function getNumberOfPeopleAtEachHours(day){
    let numberOfPeopleAtEachHours = []
    for (var i = 0; i < 24; i++) {
        var today = new Date();
        today.setTime(i * (60 * 60 * 1000));
        numberOfPeopleAtEachHours.push({"avg": 0, "nb": 0, "time": today});
    }
    Array.from(timeMap.keys()).forEach( function(date) {
        if (date.getDay() == day) {
            let avg = numberOfPeopleAtEachHours[date.getHours()].avg;
            let nb = numberOfPeopleAtEachHours[date.getHours()].nb;
            numberOfPeopleAtEachHours[date.getHours()].avg = avg * nb / (nb + 1) + timeMap.get(date).length / (nb + 1);
            numberOfPeopleAtEachHours[date.getHours()].nb += 1;
        }
    });
    console.log(numberOfPeopleAtEachHours)
    return numberOfPeopleAtEachHours;
}

app.get('/', function(req,res){
    res.status(200).send('Salut toi ! et toi')
});

app.get('/devices', function(req,res){
    console.log("get_devices")
    res.status(200).send(JSON.stringify([...devices.values()]));
});

app.post('/devices', function(req, res) {
    console.log("post_devices")
    let jsonArray = JSON.parse(req.body.devices);
    let currentDate = new Date();
    let presentDevices = new Map();
    jsonArray.forEach( function(device) 
    {
        if (device.clientMacAddress != "" && !presentDevices.has(device.clientMacAddress)) 
        {
            if (devices.has(device.clientMacAddress)) 
            {
                let dates = devices.get(device.clientMacAddress).dates;
                let dateForNewRange = currentDate.setHours(currentDate.getHours() - 1);
                if (dates[dates.length - 1][1] > dateForNewRange)
                {
                    dates[dates.length - 1][1] = currentDate;
                }
                else 
                {
                    dates.push([currentDate, currentDate]);
                }
            } 
            else 
            {
                devices.set(device.clientMacAddress, new Device(device.name, device.macAddress, device.clientMacAddress, device.clientManuf, currentDate));
                console.log("new device")
            }
            presentDevices.set(device.clientMacAddress);
        }
   } );
   let presentDevicesArray = Array.from(presentDevices.keys());
   if (presentDevicesArray.length > 0) {
       timeMap.set(currentDate, presentDevicesArray);
   }
   res.status(200).send('Success')
});

app.get('/timeMap', function(req,res){
    console.log("timeMap")
    timeMap.set(new Date(), "Stuff")
    res.status(200).send(JSON.stringify([...timeMap]));
});

app.get('/numberOfPeopleAtEachHours', function(req,res){
    console.log("numberOfPeopleAtEachHours")
    let day = req.param('day');
    if (day != undefined) {
        let nbPeopleAtEachHours = getNumberOfPeopleAtEachHours(day);
        nbPeopleAtEachHours.forEach(el => {
            delete el.nb;
        });
        res.status(200).send(nbPeopleAtEachHours);
    } else {
        res.status(500).send('Error : Expected a day as input');
    }
});

app.get('/getNumberOfPeopleLive', function(req,res){
    // TODO create a new variable to store the last date instead of searching for the last date.
    let dates = Array.from(timeMap.keys());
    let now =  dates.reduce((a, b) =>  a > b ? a : b);
    let length = timeMap.get(now).length;
    res.status(200).send(length.toString());  
});

app.get('/cellphone', function(req,res){
    let allDevice = Array.from(devices.values());
    let newArray = allDevice.filter(function (el) {
        return el.clientManuf == "Apple" || el.clientManuf == "Google" || el.clientManuf == "SamsungE" ;
        });
    res.status(200).send(newArray)
});

let server = app.listen(process.env.PORT || '8080', function(){
    console.log('App listening on port %s', server.address().port);

})