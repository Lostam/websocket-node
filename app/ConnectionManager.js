"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebServer_1 = require("./WebServer");
const WebClient_1 = require("./WebClient");
const DataManager_1 = require("./DataManager");
class ConnectionManager {
    constructor() {
        this.wait = Math.round(Math.random() * 1500 + 500);
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager_1.DataManager(this.id);
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
        this.socket = new WebClient_1.WebClient(this.dataManager, this.id);
        this.socket.connect(options);
        this.socket.checkConnection()
            .then(() => {
            console.log('Slave');
            this.clientDisconnectListener();
        })
            .catch((err) => {
            console.log('Master');
            this.socket = new WebServer_1.WebServer(this.dataManager, this.id);
        });
    }
    clientDisconnectListener() {
        this.socket.on('clientDisconnect', () => {
            console.log('an event occurred!');
            let options = {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 3000,
                'reconnectionAttempts': 5
            };
            // this.connect(options)
        });
    }
    static generateSixDigitId() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr[i] = Math.ceil(Math.random() * 6);
        }
        return arr.join('');
    }
}
exports.ConnectionManager = ConnectionManager;
let CM = new ConnectionManager();
//# sourceMappingURL=ConnectionManager.js.map