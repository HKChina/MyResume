const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let players = {};

wss.on('connection', function(ws) {

    const id = Math.random().toString(36).substr(2, 9);

    players[id] = { x: 100, y: 100 };

    ws.send(JSON.stringify({
        type: "init",
        id: id,
        players: players
    }));

    ws.on('message', function(message) {

        const data = JSON.parse(message);

        if (data.type === "move") {
            players[id].x = data.x;
            players[id].y = data.y;
        }

        broadcast();
    });

    ws.on('close', function() {
        delete players[id];
        broadcast();
    });

});

function broadcast() {
    const data = JSON.stringify({
        type: "update",
        players: players
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log("server running : 3000");