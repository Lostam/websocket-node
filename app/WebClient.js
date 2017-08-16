"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
class WebClient extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.ioClient = require('socket.io-client');
        this.type = 'Slave';
        this.url = process.env.NODE_URL || 'http://localhost:' + this.port;
    }
    connect(options) {
        console.log('Trying to connect on url: ', this.url);
        this.socketEmitter = this.ioClient.connect(this.url, options);
    }
    searchMaster() {
        return new Promise((resolve, reject) => {
            this.socketEmitter.on('connect', () => {
                console.log('My Id: ', this.id);
                this.initialData();
                this.write();
                resolve();
            });
            this.socketEmitter.on('reconnect_failed', (timeout) => {
                reject();
                console.log('connect_failed', timeout);
            });
        });
    }
    initialData() {
        let data = this.dataManager.getData();
        this.socketEmitter.emit('newSlaveSync', this.id, data);
        this.setListeners();
        this.setConnectionListeners();
    }
    setListeners() {
        this.socketEmitter.on("updateNewSlave", (sockets) => {
            this.dataManager.setSockets(sockets);
            // this.dataManager.setData(data);
            console.log("Data Length : ", this.dataManager.getData().length);
        });
        this.socketEmitter.on('newSocket', (id, index) => {
            this.dataManager.addSocket(id, index);
        });
        this.socketEmitter.on('dataSync', (data) => {
            this.dataManager.addData(data);
        });
    }
    setConnectionListeners() {
        this.socketEmitter.on('connect_error', () => {
            console.log('connect_error');
        });
        this.socketEmitter.on('reconnect_error', () => {
            console.log('reconnect_error');
        });
        this.socketEmitter.on('reconnect', (reconnect) => {
            console.log('reconnect', reconnect);
        });
        this.socketEmitter.on('reconnect_attempt', (attemptNumber) => {
            console.log('reconnect_attempt: ', attemptNumber);
        });
        this.socketEmitter.on('disconnect', (reason) => {
            console.log('disconnect', reason);
            this.emit('clientDisconnect');
            this.disconnect();
        });
    }
    write() {
        setInterval(() => {
            let random = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.dataManager.addData([random]);
            this.socketEmitter.emit('dataSync', random);
        }, 1000);
        this.socketEmitter.on('newUpdate', (data) => {
            console.log(data + "::" + this.id);
        });
    }
    disconnect() {
        this.socketEmitter.disconnect();
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=WebClient.js.map