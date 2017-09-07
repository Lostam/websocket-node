import {Socket} from "./Socket";
import {DataManager} from "./DataManager";

const WebSocket = require("ws");

export class WebServer extends Socket {

    private ioServer;

    protected id: string;
    protected type = 'Master';

    constructor(dataManager: DataManager, id: string) {
        super(dataManager, id);
        this.serverListen();
        let server = this.server;
        this.ioServer = new WebSocket.Server({server});
        this.setListeners();
        this.setUpConnection();
    }

    setUpConnection() {
        this.ioServer.on('connection', (ws: Socket) => {
            ws.on('message', (message) => {
                this.handleMessage(message, ws);
            });
            console.log('connected');
        });
    }

    protected send(name: string, content: any, whom?: any) {
        let obj = {};
        obj[name] = content;
        let message = JSON.stringify(obj);
        whom.send(message)
    }

    private sendAllElse(event: string, data: any, ws: Socket) {
        this.ioServer.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                this.send(event, data, client)
            }
        });
    }

    private sendAll(event: string, data: any) {
        this.ioServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.send(event, data, client)
            }
        });
    }

    setListeners() {
        this.listener['new-socket'] = (message, ws?: Socket) => {
            console.log(message);
            this.send('new-socket', 'Got Ya ' + this.id, ws);
            this.sendAllElse('new-socket', 'New Friend ' + message, ws)
        };

        this.listener['new'] = (message, ws?: Socket) => {
            console.log('Yo Yo Yo' + "  " + message);
            this.send('new', 'Got Ya ' + this.id, ws);
            this.sendAllElse('new', 'New Friend ' + message, ws)
        };
        this.listen('sync', (message, ws?: Socket) => {
            this.dataManager.addData(message);
            console.log('got ' + message);
            this.sendAllElse('sync', message, ws);
        });
        this.listen('alive', (message, ws?: Socket) => {
            console.log(message);
            this.send('alive', "Yo I'm alive too", ws);
        })
    }

    public newData(data) {
        this.sendAll('sync', data);
    }


}


