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

