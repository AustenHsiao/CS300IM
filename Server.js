// Server for CS300IM
'use strict'
const http = require("http");
const WebSocket = require("websocket").server;
var users = 0;

//set up the http server
const server = http.createServer();
server.listen({port:80});

//handshake for websocketserver (wss)
const wss = new WebSocket({
    httpServer:server
});

wss.on('request', request => {
    ++users;
    console.log("%d connection(s)", users);
    
    const sender = request.accept(null, request.origin);
    
    sender.on('message', message => {
        sender.send(`${message.utf8Data}`);
    });
});