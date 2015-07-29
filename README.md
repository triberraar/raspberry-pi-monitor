# triberraar-pi-monitor
A simple websocket and angular based application to monitor a raspberry pi (2).

# Architecture
## Back-end
The back-end is written in javascript using Node.js. It uses some supporting javascript libraries:

 * express
 * socket.io
 * async
 * lodah
 * moment
 
The back-end provides both a JSON Rest-api and websocket communication.

## Front-end
The front-end is also written in javascript using AngularJS. It uses some supporting javascript libraries:

 * socket.io-client
 * angular-socket-io
 * angular-ui-router
 * moment
 * lodash
 * angular-chart.js
 * angular-bootstrap
 * ngstorage
 * angular-growl-v2
 
Layout is done with Bootstrap and Font Awesome.

The front-end provides a page per monitored component and history for some. There is also a configurable dashboard, that is saved into local storage.

# Install
Please make sure node and npm are installed. Also install bower globally.
Install by running

    npm install
and

    bower install

Installation done :)

# Configuration
Configure the application in the config.json file. For the moment the only configuration is the port used (standard 7076).

# Run
Run the application by executing
  
   sudo node triberraar-pi-monitor.js
   
!!! Be sure to run as sudo as some functionality needs this !!!

# Functionality
## CPU
### Commands
The cpu frequency is gathered by reading the /sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_cur_freq file.

The load average is gathered by reading the /proc/loadavg file.

The temperature is gathered by reading the /sys/devices/virtual/thermal/thermal_zone0/temp file.

### Rest
The cpu information can be queried one /cpu and looks like
```json
{"loadAvg":{"1min":0.4,"5min":0.47,"15min":0.45},"frequency":950,"temperature":48.15}
```