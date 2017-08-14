"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const ConnectionManager_1 = require("./ConnectionManager");
const app = require('express')();
const http = require('http').createServer(app);
class Socket extends ConnectionManager_1.ConnectionManager {
    constructor() {
        this.Logger = Logger_1.Logger;
        this.port = 3000;
        this.http = http;
        this.id = Socket.generateSixDigitId();
    }
    static generateSixDigitId() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr[i] = Math.ceil(Math.random() * 6);
        }
        return arr.join('');
    }
    getId() {
        return this.id;
    }
    getPort() {
        return this.port;
    }
}
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map