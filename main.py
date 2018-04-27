import sys
import xml.etree.ElementTree as etree
import threading
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

__author__ = "Michael Caraccio"

def writeCSV() :
    # Open csv file (or create it if not exist)
    outfile = open(outputFilename, "w")

    # Create columns in csv
    outfile.write("name;macAddress;clientMacAddress;clientManuf")

    # For each network
    for child in root:
        if child.tag == "wireless-network":

            essid = ""
            bssid = ""
            client_mac = ""
            client_manuf = ""

            # Parse each network
            for element in child:

                # Get ESSID and Encryption type
                if element.tag == "SSID":
                    for subelement in element:
                        if subelement.tag == "essid":
                            essid = str(subelement.text)

                # Get MAC Address
                if element.tag == "BSSID":
                    bssid = str(element.text)
                
                if element.tag == "wireless-client":
                    for subelement in element:
                        if subelement.tag == "client-mac":
                            client_mac = str(subelement.text)
                        elif subelement.tag == "client-manuf":
                            client_manuf = str(subelement.text)


                # Store network to csv file
                # If MODE is not specified
                if mode == "" and essid != "":
                        outfile.write("\n" + essid + ";" + bssid + ";" + client_mac + ";" + client_manuf)
                elif essid != "":
                        outfile.write("\n" + essid + ";" + bssid + ";" + client_mac + ";" + client_manuf)
    threading.Timer(5.0, writeCSV).start()

def writeJSON() :
    
    jsonArray = []

    # For each network
    for child in root:
        if child.tag == "wireless-network":

            essid = ""
            bssid = ""
            client_mac = ""
            client_manuf = ""

            # Parse each network
            for element in child:

                # Get ESSID and Encryption type
                if element.tag == "SSID":
                    for subelement in element:
                        if subelement.tag == "essid":
                            essid = str(subelement.text)

                # Get MAC Address
                if element.tag == "BSSID":
                    bssid = str(element.text)
                
                if element.tag == "wireless-client":
                    for subelement in element:
                        if subelement.tag == "client-mac":
                            client_mac = str(subelement.text)
                        elif subelement.tag == "client-manuf":
                            client_manuf = str(subelement.text)


                # Store network to csv file
                # If MODE is not specified
                if essid != None:
                    device = {"name": essid, "macAddress": bssid, "clientMacAddress": client_mac, "clientManuf": client_manuf }
                    jsonArray.append(device)
    url = 'http://localhost:8080/devices'
    jsonArray = json.dumps(jsonArray)
    print(jsonArray)
    post_fields = {'devices' : jsonArray}
    request = Request(url, urlencode(post_fields).encode())
    response = urlopen(request).read().decode()
    threading.Timer(10.0, writeJSON).start()
    

if __name__ == '__main__':

    # Check if number of arguments is correct, otherwise print usage
    if len(sys.argv) < 3:
        print("Usage: %s <NetXML File> <Output File Name> <Filter> (Filter is optional)" % sys.argv[0])
        sys.exit(1)

    # Store args
    inputFilename = sys.argv[1]
    outputFilename = str(sys.argv[2])
    mode = sys.argv[3] if len(sys.argv) == 4 is not None else ""

    tree = etree.parse(inputFilename)
    root = tree.getroot()

    writeJSON()