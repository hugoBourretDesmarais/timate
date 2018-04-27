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
    constructor(name, macAddress, clientMacAddress, clientManuf){
        this.name = name ;
        this.macAddress = macAddress;
        this. clientMacAddress = clientMacAddress;
        this. clientManuf = clientManuf;
     }  
}

let devices = []

// csv({delimiter:";"}).fromFile("result.csv").on("end_parsed", function(jsonArray){
//     jsonArray.forEach( function(device) { 
//         devices.push(new Device(device.name, device.macAddress, device.clientMacAddress, device.clientManuf))
//    } );
// })

app.get('/', function(req,res){
    res.status(200).send('Salut toi !')
});

app.get('/all', function(req,res){
    res.status(200).send(devices)
});

app.post('/devices', function(req, res) {
    var jsonArray = JSON.parse(req.body.devices);
    jsonArray.forEach( function(device) { 
        devices.push(new Device(device.name, device.macAddress, device.clientMacAddress, device.clientManuf))
   } );
   res.status(200).send('Success')
});

app.get('/cellphone', function(req,res){
    var newArray = devices.filter(function (el) {
        return el.clientManuf == "Apple" || el.clientManuf == "Google" || el.clientManuf == "SamsungE" ;
        });
    res.status(200).send(newArray)
});

var server = app.listen(process.env.PORT || '8080', function(){
    console.log('App listening on port %s', server.address().port);

})