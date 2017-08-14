"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
class WebServer extends Socket_1.Socket {
    constructor(dataManager, id) {
        super(dataManager, id);
        this.ioServer = require('socket.io').listen(this.http);
        this.http.listen(this.port);
        console.log(`Listening on port ${this.port}...`);
        this.setUpConnection();
    }
    setUpConnection() {
        this.ioServer.sockets.on('connection', (socket) => {
            socket.on('dataSync', (data) => {
                console.log(data);
                this.dataManager.addData(data);
            });
            socket.on('disconnect', (data) => {
                console.log(`${data} has disconnected`);
            });
            socket.on('newSlaveAlert', (id) => {
                let index = this.dataManager.getNextMapIndex();
                this.dataManager.addSocket(id, index);
                socket.emit("updateNewSlave", this.dataManager.getData(), this.dataManager.getSockets());
                this.ioServer.sockets.emit("newSocket", id, index);
            });
        });
        setInterval(() => {
            this.ioServer.sockets.emit('newUpdate', `reached ${this.dataManager.getData().length} data`);
            this.printData();
        }, 1000 * 10 * 1);
    }
    printData() {
        console.log('Clients :', this.ioServer.clients().sockets.length);
        this.Logger.log({ data: this.dataManager.getData().length, id: this.id });
        this.dataManager.clear();
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=WebServer.js.map