import {Socket} from "./Socket";
import {DataManager} from "./DataManager";


export class WebClient extends Socket {

    private ioClient = require('socket.io-client');
    protected id: string;
    protected type = 'Slave';
    private url =  process.env.NODE_URL || 'http://localhost:' + this.port;
        // "http://wb.realtimeopt.com";

    public socketEmitter: SocketIOClient.Socket;

    constructor(dataManager: DataManager, id: string) {
        super(dataManager, id);
    }

    connect(options) {
        console.log('Trying to connect on url: ' , this.url);

        this.socketEmitter = this.ioClient.connect(this.url, options)
    }

    public searchMaster() {
        return new Promise((resolve, reject) => {
            this.socketEmitter.on('connect', () => {
                console.log('My Id: ' , this.id);
                this.initialData();
                this.write();
                resolve();
            });
            this.socketEmitter.on('reconnect_failed', (timeout) => {
                reject();
                console.log('connect_failed', timeout)
            });

        });
    }

    public initialData() {
        let data:string[] = this.dataManager.getData();
        this.socketEmitter.emit('newSlaveSync', this.id, data);
        this.setListeners();
        this.setConnectionListeners();

    }

    private setListeners() {

        this.socketEmitter.on("updateNewSlave", (sockets: Array<any>) => {
            this.dataManager.setSockets(sockets);
            // this.dataManager.setData(data);
            console.log("Data Length : ", this.dataManager.getData().length);
        });
        this.socketEmitter.on('newSocket', (id, index) => {
            this.dataManager.addSocket(id, index);
        });
        this.socketEmitter.on('dataSync', (data) => {
            this.dataManager.addData(data);
        })
    }

    private setConnectionListeners() {
        this.socketEmitter.on('connect_error', () => {
            console.log('connect_error')
        });
        this.socketEmitter.on('reconnect_error', () => {
            console.log('reconnect_error')
        });
        this.socketEmitter.on('reconnect', (reconnect) => {
            console.log('reconnect', reconnect)
        });
        this.socketEmitter.on('reconnect_attempt', (attemptNumber) => {
            console.log('reconnect_attempt: ', attemptNumber)
        });
        this.socketEmitter.on('disconnect', (reason) => {
            console.log('disconnect', reason);
            this.emit('clientDisconnect');
            this.disconnect();

        });
    }

    public write() {
        setInterval(() => {
            let random:string = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.dataManager.addData([random]);
            this.socketEmitter.emit('dataSync', random)
        }, 1000);

        this.socketEmitter.on('newUpdate', (data) => {
            console.log(data + "::" + this.id);
        })
    }

    public disconnect() {
        this.socketEmitter.disconnect();
    }
}
