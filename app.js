const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const uuidV4 = require('uuid/v4');

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {}

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  // Register Socket
  const id = uuidV4();
  clients[id] = ws;
  console.info('New User Joined:', ws.id)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    let msgObj = {}

    try {
    	msgObj = JSON.parse(message)
    } catch(e) {

    }
    // BroadCast offer
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msgObj);
      }
    });

  });
});

server.listen(8000, function listening() {
  console.log('Listening on %d', server.address().port);
});