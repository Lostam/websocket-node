"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const events_1 = require("events");
// import EventEmitter = NodeJS.EventEmitter;
class Socket extends events_1.EventEmitter {
    constructor(dataManager, id) {
        super();
        this.Logger = Logger_1.Logger;
        this.port = process.env.NODE_PORT || 3000;
        this.id = id;
        this.dataManager = dataManager;
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