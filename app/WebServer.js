"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
const WebSocket = require("ws");
class WebServer extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.type = 'Master';
        this.serverListen();
        let server = this.server;
        this.ioServer = new WebSocket.Server({ server });
        this.setListeners();
        this.setUpConnection();
    }
    setUpConnection() {
        this.ioServer.on('connection', (ws) => {
            ws.on('message', (message) => {
                this.handleMessage(message, ws);
            });
            console.log('connected');
        });
    }
    send(name, content, whom) {
        let obj = {};
        obj[name] = content;
        let message = JSON.stringify(obj);
        whom.send(message);
    }
    sendAllElse(event, data, ws) {
        this.ioServer.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                this.send(event, data, client);
            }
        });
    }
    sendAll(event, data) {
        this.ioServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.send(event, data, client);
            }
        });
    }
    setListeners() {
        this.listener['new-socket'] = (message, ws) => {
            console.log(message);
            this.send('new-socket', 'Got Ya ' + this.id, ws);
            this.sendAllElse('new-socket', 'New Friend ' + message, ws);
        };
        this.listener['new'] = (message, ws) => {
            console.log('Yo Yo Yo' + "  " + message);
            this.send('new', 'Got Ya ' + this.id, ws);
            this.sendAllElse('new', 'New Friend ' + message, ws);
        };
        this.listen('sync', (message, ws) => {
            this.dataManager.addData(message);
            console.log('got ' + message);
            this.sendAllElse('sync', message, ws);
        });
        this.listen('alive', (message, ws) => {
            console.log(message);
            this.send('alive', "Yo I'm alive too", ws);
        });
    }
    newData(data) {
        this.sendAll('sync', data);
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=WebServer.js.map