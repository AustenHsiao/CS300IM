// Server for CS300IM
'use strict'

const http = require('http');
const WebSocket = require('websocket').server;

const server = http.createServer();
server.listen({port : 8080});

const ws = new WebSocket({
  "httpServer": server
});

ws.on("request", (request) => {
  var client = request.accept(null, request.origin);
  console.log("connected");

  client.on("message", (message) => {
    console.log(`[Client]: ${message.utf8Data}`);
    client.send(message.utf8Data);
  });
})