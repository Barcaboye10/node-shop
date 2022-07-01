// imports http package
const http = require('http');
const app = require('./app');

// If a port is set, use that, else use 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log('Server listening at port 3000')