"use strict";
// export class WebNode {
//
// }
Object.defineProperty(exports, "__esModule", { value: true });
const WebServer_1 = require("./WebServer");
const WebClient_1 = require("./WebClient");
class ConnectionManager {
    constructor() {
        this.wait = Math.round(Math.random() * 1500 + 500);
        setTimeout(() => {
            this.chooseNode();
        }, this.wait);
    }
    chooseNode() {
        let options = {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 3000,
            'reconnectionAttempts': 5
        };
        this.socket = new WebClient_1.WebClient();
        this.socket.connect(options);
        this.socket.checkConnection()
            .then(() => {
            console.log('Slave');
        })
            .catch((err) => {
            console.log('Master');
            this.socket = new WebServer_1.WebServer();
        });
    }
}
exports.ConnectionManager = ConnectionManager;
let CM = new ConnectionManager();
//# sourceMappingURL=ConnectionManager.js.map