"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
const app = require('express')();
const server = require('http').createServer();
class WebServer extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.ioServer = require('socket.io')(this.port, { pingInterval: 60000 });
        this.type = 'Master';
        // this.http.listen(this.port);
        // console.log(`Listening on port ${this.port}...`);
        this.setUpConnection();
        console.log('My Id: ', this.id);
    }
    setUpConnection() {
        this.ioServer.sockets.on('connection', (socket) => {
            console.log('Connected');
            socket.on('dataSync', (data) => {
                console.log(data);
                this.dataManager.addData([data]);
            });
            socket.on('disconnect', (data) => {
                console.log(`${data} has disconnected`);
            });
            socket.on('newSlaveSync', (id, slaveData) => {
                let index = this.dataManager.getNextMapIndex();
                this.dataManager.addSocket(id, index);
                let sockets = this.dataManager.getSockets();
                this.syncData(socket, slaveData);
                this.ioServer.sockets.emit("newSocket", id, index);
                socket.emit("updateNewSlave", sockets);
                this.ioServer.sockets.emit("newSocket", id, index);
            });
        });
        setInterval(() => {
            this.ioServer.sockets.emit('newUpdate', `reached ${this.dataManager.getData().length} data`);
            this.printData();
        }, 1000 * 10 * 3);
    }
    syncData(socket, slaveData) {
        let data = this.dataManager.getData();
        let difference = this.dataManager.findDiff(data, slaveData);
        if (difference.own.length > 0) {
            this.dataManager.addData(difference.own);
            socket.broadcast.emit('dataSync', difference.own);
        }
        if (difference.remote.length > 0) {
            socket.emit("dataSync", difference.remote);
        }
    }
    printData() {
        console.log('Clients :', this.ioServer.clients().sockets.length);
        this.Logger.log({ data: this.dataManager.getData().length, id: this.id });
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=WebServer.js.map