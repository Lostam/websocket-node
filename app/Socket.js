"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const events_1 = require("events");
class Socket extends events_1.EventEmitter {
    constructor(dataManager, id) {
        super();
        this.Logger = Logger_1.Logger;
        this.port = process.env.NODE_PORT || 8080;
        this.listener = {};
        this.id = id;
        this.dataManager = dataManager;
        this.app = require('express')();
        this.server = require('http').createServer(this.app);
    }
    listen(name, fn) {
        this.listener[name] = fn;
    }
    handleMessage(message, ws) {
        message = JSON.parse(message);
        let name = Object.keys(message)[0];
        let content = message[name];
        if (this.listener.hasOwnProperty(name)) {
            this.listener[name](content, ws);
        }
        else {
            console.error(`No Listener for ${name} exists`);
        }
    }
    serverListen() {
        this.server.listen(this.port, () => {
            console.log('Listening on %d', this.server.address().port);
        });
        this.app.get('/', (req, res) => {
            res.send('Yo ' + this.id + " " + this.type);
        });
        this.app.get('/up', (req, res) => {
            let random = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.dataManager.addData([random]);
            this.send('sync', random);
            res.send(`sent ${random}`);
        });
        this.app.get('/all', (req, res) => {
            res.send(`${this.dataManager.getData()}`);
        });
        console.log('My Id: ', this.id);
    }
    getId() {
        return this.id;
    }
    getPort() {
        return this.port;
    }
    getType() {
        return this.type;
    }
}
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map