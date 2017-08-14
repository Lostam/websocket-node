import {Socket} from "./Socket";
import {DataManager} from "./DataManager";


export class WebClient extends Socket {

    private ioClient = require('socket.io-client');
    protected id: string;
    private url = process.env.NODE_URL || 'http://localhost:' + this.port;
    public socketEmitter: SocketIOClient.Socket;
    private connected: boolean = false;

    constructor(dataManager:DataManager,id:string) {
        super(dataManager,id);
    }

    connect(options) {
        this.socketEmitter = this.ioClient.connect(this.url,options)
    }

    public checkConnection() {
        return new Promise((resolve, reject) => {
            this.socketEmitter.on('connect', () => {
                this.initialData();
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
                this.emit('clientDisconnect');
                this.disconnect();

            });
        });
    }

    public initialData () {
        this.socketEmitter.emit('newSlaveAlert',this.id);
        this.setListeners();

    }

    private setListeners() {

        this.socketEmitter.on("updateNewSlave",(data,sockets:Array<any>)=>{
            this.dataManager.setSockets(sockets);
            this.dataManager.setData(data);
            console.log("Data Length : " , this.dataManager.getData().length);
        });
        this.socketEmitter.on('newSocket',(id,index)=>{
            this.dataManager.addSocket(id,index);
            console.log("Data Socket : " ,this.dataManager.getSockets());
        })
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
