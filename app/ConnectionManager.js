"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebServer_1 = require("./WebServer");
const WebClient_1 = require("./WebClient");
const DataManager_1 = require("./DataManager");
class ConnectionManager {
    constructor() {
        this.wait = Math.round(Math.random() * 2500 + 500);
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager_1.DataManager(this.id);
    }
    chooseNode() {
        return new Promise((resolve, reject) => {
            let options = {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 3000,
                'reconnectionAttempts': 5
                // 10
            };
            this.socket = new WebClient_1.WebClient(this.dataManager, this.id);
            this.socket.searchMaster(options)
                .then(() => {
                console.log('Slave');
                this.clientDisconnectListener();
                resolve();
            })
                .catch((err) => {
                if (err)
                    console.log(err);
                console.log('Master');
                this.socket = new WebServer_1.WebServer(this.dataManager, this.id);
                resolve();
            });
        });
    }
    sync(data) {
        this.socket.newData(data);
    }
    clientDisconnectListener() {
        this.socket.on('clientDisconnect', () => {
            console.log('an event occurred!');
            this.chooseNode();
        });
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
    getType() {
        return this.socket.getType();
    }
}
exports.ConnectionManager = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map