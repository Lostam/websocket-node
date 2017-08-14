import {Socket} from "./Socket";


export class WebClient extends Socket {

    private ioClient = require('socket.io-client');
    protected id: string;
    private url = process.env.NODE_URL || 'http://localhost:' + this.port;
    public socketEmitter: SocketIOClient.Socket;
    private connected: boolean = false;

    constructor() {
        super();
    }

    connect(options) {
        this.socketEmitter = this.ioClient.connect(this.url,options)
    }

    public checkConnection() {
        return new Promise((resolve, reject) => {
            this.socketEmitter.on('connect', () => {
                this.write();
                resolve();
                this.connected = true;
            });
            this.socketEmitter.on('connect_error', (error) => {
                console.log('connect_error')
            });
            this.socketEmitter.on('reconnect_error', (error) => {
                console.log('reconnect_error')
            });
            this.socketEmitter.on('reconnect_failed', (timeout) => {
                reject();
                console.log('connect_failed', timeout)
            });
            this.socketEmitter.on('reconnect', (reconnect) => {
                console.log('reconnect' , reconnect)
            });
            this.socketEmitter.on('reconnect_attempt', (attemptNumber) => {
                console.log('reconnect_attempt: ', attemptNumber)
            });
            this.socketEmitter.on('disconnect', (reason) => {
                console.log('disconnect' , reason);
                this.disconnect();
                let options = {
                    'reconnection': true,
                    'reconnectionDelay': 1000,
                    'reconnectionDelayMax': 3000,
                    'reconnectionAttempts': 5
                };
                this.connect(options)
            });
        });

    }

    public isConnected() {
        return this.connected;
    }

    public write() {
        setInterval(() => {
            let random = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.socketEmitter.emit('dataSync', {data: random})
        }, 1000);

        this.socketEmitter.on('newUpdate', (data) => {
            console.log(data + "::" + this.id);
        })
    }

    public disconnect() {
        this.socketEmitter.disconnect();
    }
}
