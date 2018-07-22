class Device {
    
    constructor(name ="", macAddress = "", clientMacAddress = "", clientManuf = "", dates = null){
        this.name = name ;
        this.macAddress = macAddress;
        this.clientMacAddress = clientMacAddress;
        this.clientManuf = clientManuf;
        this.dates = dates;
    }

     name: String;
     macAddress: String;
     clientMacAddress: String;
     clientManuf: String;
     dates: [Date, Date];

}