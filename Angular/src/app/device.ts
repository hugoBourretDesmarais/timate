class Device {
    
    constructor(name, macAddress, clientMacAddress, clientManuf){
        this.name = name ;
        this.macAddress = macAddress;
        this.clientMacAddress = clientMacAddress;
        this.clientManuf = clientManuf;
     }  

     name: String;
     macAddress: String;
     clientMacAddress: String;
     clientManuf: String;
}