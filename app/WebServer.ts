import {Socket} from "./Socket";
import {DataManager} from "./DataManager";
const app = require('express')();
const server = require('http').createServer();


export class WebServer extends Socket {

    private ioServer = require('socket.io')(this.port,{ pingInterval: 60000 } );
    protected id: string;
    protected type = 'Master';

    constructor(dataManager:DataManager,id:string) {
        super(dataManager,id);
        // this.http.listen(this.port);
        // console.log(`Listening on port ${this.port}...`);
        this.setUpConnection();
        console.log('My Id: ' , this.id);
    }

    setUpConnection() {
        this.ioServer.sockets.on('connection', (socket) => {
            console.log('Connected');
            socket.on('dataSync', (data:string) => {
                console.log(data);
                this.dataManager.addData([data]);
            });

            socket.on('disconnect',(data)=>{
                console.log(`${data} has disconnected`)
            });

            socket.on('newSlaveSync',(id:string,slaveData:string[])=>{

                let index = this.dataManager.getNextMapIndex();
                this.dataManager.addSocket(id,index);
                let sockets:Array<any> = this.dataManager.getSockets();
                this.syncData(socket,slaveData);

                this.ioServer.sockets.emit("newSocket",id,index);
                socket.emit("updateNewSlave",sockets);
                this.ioServer.sockets.emit("newSocket",id,index);
            });
        });
        setInterval(() => {
            this.ioServer.sockets.emit('newUpdate', `reached ${this.dataManager.getData().length} data`);
            this.printData();
        }, 1000 * 10 * 3);
    }

    syncData (socket,slaveData) {
        let data:Array<any> = this.dataManager.getData();
        let difference = this.dataManager.findDiff(data,slaveData);
        if (difference.own.length>0) {
            this.dataManager.addData(difference.own);
            socket.broadcast.emit('dataSync',difference.own)
        }
        if (difference.remote.length>0) {
            socket.emit("dataSync",difference.remote);
        }

    }

    printData() {
        console.log('Clients :', this.ioServer.clients().sockets.length);
        this.Logger.log({data: this.dataManager.getData().length, id: this.id});
    }


}


