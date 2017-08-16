"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebServer_1 = require("./WebServer");
const WebClient_1 = require("./WebClient");
const DataManager_1 = require("./DataManager");
const app = require('express')();
class ConnectionManager {
    constructor() {
        this.wait = Math.round(Math.random() * 1500 + 500);
        this.expressPort = 8000;
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager_1.DataManager(this.id);
        setTimeout(() => {
            this.chooseNode();
        }, this.wait);
        //this.openPort();
    }
    chooseNode() {
        let options = {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 3000,
            'reconnectionAttempts': 10
        };
        this.socket = new WebClient_1.WebClient(this.dataManager, this.id);
        this.socket.connect(options);
        this.socket.searchMaster()
            .then(() => {
            console.log('Slave');
            this.clientDisconnectListener();
        })
            .catch((err) => {
            if (err)
                console.log(err);
            console.log('Master');
            this.socket = new WebServer_1.WebServer(this.dataManager, this.id);
        });
    }
    clientDisconnectListener() {
        this.socket.on('clientDisconnect', () => {
            console.log('an event occurred!');
            this.chooseNode();
        });
    }
    openPort() {
        app.listen(this.expressPort, () => {
            console.log("Listening on port :", this.expressPort);
        });
        app.get('/', (req, res) => {
            let data = {
                id: this.id,
                data: this.dataManager.getData(),
                type: this.socket.getType()
            };
            res.send(data);
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