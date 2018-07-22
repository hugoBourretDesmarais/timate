timate


Raspberry Pie :

How to start kismet :

ssh into RP:
ifconfig( inet (to get ip address))

main.py & kismet logs
cd ~/home/ftp/pi/kismet

kismet.conf
cd ~/etc/kismet

make sure that two wireless adapter are connected and working. iwconfig or airmon-ng.
cd Desktop/compat...
make unload
make load

ip link set wlan1 up

sudo airmon-ng start wlan1
sudo kismet -c wlan1mon
ifconfig (to verify it happen correctly)

How to start sending data to node server :

python3 main.py


NodeServer :

Run Locally :

1- npm start
2- http://localhost:{PORT}/

To expose the serveur when running locally :
npm install -g localtunnel
lt --port 8000
cp the given url to the url in main.py

Run on google cloud platform :



