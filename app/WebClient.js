"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
class WebClient extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.ioClient = require('socket.io-client');
        this.url = process.env.NODE_URL || 'http://localhost:' + this.port;
        this.connected = false;
    }
    connect(options) {
        this.socketEmitter = this.ioClient.connect(this.url, options);
    }
    checkConnection() {
        return new Promise((resolve, reject) => {
            this.socketEmitter.on('connect', () => {
                this.initialData();
                this.write();
                resolve();
                this.connected = true;
            });
            this.socketEmitter.on('connect_error', (error) => {
                console.log('connect_error');
            });
            this.socketEmitter.on('reconnect_error', (error) => {
                console.log('reconnect_error');
            });
            this.socketEmitter.on('reconnect_failed', (timeout) => {
                reject();
                console.log('connect_failed', timeout);
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
        });
    }
    initialData() {
        this.socketEmitter.emit('newSlaveAlert', this.id);
        this.setListeners();
    }
    setListeners() {
        this.socketEmitter.on("updateNewSlave", (data, sockets) => {
            this.dataManager.setSockets(sockets);
            this.dataManager.setData(data);
            console.log("Data Length : ", this.dataManager.getData().length);
        });
        this.socketEmitter.on('newSocket', (id, index) => {
            this.dataManager.addSocket(id, index);
            console.log("Data Socket : ", this.dataManager.getSockets());
        });
    }
    write() {
        setInterval(() => {
            let random = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.socketEmitter.emit('dataSync', { data: random });
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