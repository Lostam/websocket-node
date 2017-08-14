"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("./Socket");
class WebServer extends Socket_1.Socket {
    constructor() {
        super();
        this.ioServer = require('socket.io').listen(this.http);
        this.data = [];
        this.http.listen(this.port);
        console.log(`Listening on port ${this.port}...`);
        this.setUpConnection();
    }
    setUpConnection() {
        this.ioServer.sockets.on('connection', (socket) => {
            // console.log('connected');
            socket.on('dataSync', (data) => {
                console.log(data);
                this.data.push(data);
            });
            socket.on('disconnect', (data) => {
                console.log(`${data} has disconnected`);
            });
            setInterval(() => {
                socket.broadcast.emit('newUpdate', `reached ${this.data.length} data`);
                this.printData();
            }, 1000 * 10 * 3);
        });
    }
    printData() {
        console.log('Clients :', this.ioServer.clients().sockets.length);
        this.Logger.log({ data: this.data.length, id: this.id });
        this.data = [];
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=WebServer.js.map