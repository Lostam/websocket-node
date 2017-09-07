"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
const WebSocket = require("ws");
class WebClient extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.intervals = [];
        this.type = 'Slave';
        this.url = process.env.NODE_URL || 'ws://localhost:8080';
        this.port = process.env.NODE_PORT || WebClient.getRandomPort();
    }
    searchMaster(options) {
        return new Promise((resolve, reject) => {
            this.connectAttempt(options)
                .then(() => {
                resolve();
                this.init();
            })
                .catch(() => {
                reject();
            });
        });
    }
    connectAttempt(options, currentRetry) {
        return new Promise((resolve, reject) => {
            currentRetry = currentRetry || 0;
            options = options || { reconnectionAttempts: 999, reconnectionDelay: 2000, reconnectionDelayMax: 10000 };
            if (currentRetry !== options.reconnectionAttempts) {
                console.log('Retry number : ', currentRetry);
                this.ioClient = new WebSocket(this.url);
                this.ioClient.onerror = (err) => {
                    setTimeout(() => {
                        return this.connectAttempt(options, currentRetry + 1)
                            .then(() => {
                            resolve();
                        })
                            .catch(() => {
                            reject();
                        });
                    }, options.reconnectionDelay);
                };
                this.ioClient.onopen = (() => {
                    this.send('new-socket', "Yo I'm new here" + this.id);
                    resolve();
                });
            }
            else {
                reject();
            }
        });
    }
    send(name, content) {
        let obj = {};
        obj[name] = content;
        let message = JSON.stringify(obj);
        this.ioClient.send(message);
    }
    disconnectListener() {
        this.ioClient.onclose = () => {
            console.log('disconnected');
            this.cleanIntervals();
            this.disconnect();
            this.emit('clientDisconnect');
        };
    }
    init() {
        this.serverListen(); // open port
        this.write(); // emiters
        this.disconnectListener(); // disconnect protocol
        this.setListeners(); // listener
    }
    setListeners() {
        this.listen('idUpdate', (message) => {
            console.info(message);
        });
        this.listen('new-socket', (message) => {
            console.info(message);
        });
        this.listen('alive', (message) => {
            console.info(message);
        });
        this.listen('sync', (data) => {
            this.dataManager.addData(data);
        });
        this.ioClient.onmessage = (message) => {
            this.handleMessage(message.data);
        };
    }
    newData(data) {
        this.send('sync', data);
    }
    write() {
        let interval2 = setInterval(() => {
            this.send('alive', "Yo I'm alive" + this.id);
        }, 1000 * 10);
        this.intervals.push(interval2);
    }
    cleanIntervals() {
        for (let interval of this.intervals) {
            clearInterval(interval);
        }
    }
    disconnect() {
        this.ioClient.close();
    }
    static getRandomPort() {
        return Math.floor(Math.random() * (8000) + 1000);
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=WebClient.js.map