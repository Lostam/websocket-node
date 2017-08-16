import {WebServer} from "./WebServer";
import {WebClient} from "./WebClient";
import {DataManager} from "./DataManager";

const app = require('express')();

export class ConnectionManager {

    private wait: number = Math.round(Math.random() * 1500 + 500);
    private socket: WebClient | WebServer;
    private dataManager: DataManager;
    private id: string;
    private expressPort: number = 8000;

    constructor() {
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager(this.id);
        setTimeout(() => {
            this.chooseNode();
        }, this.wait);

        //this.openPort();


    }

    chooseNode() {
        let options = {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 3000,
            'reconnectionAttempts': 10
        };
        this.socket = new WebClient(this.dataManager, this.id);
        this.socket.connect(options);
        this.socket.searchMaster()
            .then(() => {
                console.log('Slave');
                this.clientDisconnectListener()
            })
            .catch((err) => {
                if (err) console.log(err);
                console.log('Master');
                this.socket = new WebServer(this.dataManager, this.id);
            });
    }

    private clientDisconnectListener() {
        this.socket.on('clientDisconnect', () => {
            console.log('an event occurred!');
            this.chooseNode()
        })
    }

    private openPort() {
        app.listen(this.expressPort, () => {
            console.log("Listening on port :", this.expressPort)
        });
        app.get('/', (req, res) => {
            let data = {
                id: this.id,
                data: this.dataManager.getData(),
                type: this.socket.getType()
            };
            res.send(data)
        })

    }

    static generateSixDigitId() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr[i] = Math.ceil(Math.random() * 6)
        }
        return arr.join('');
    }

}

let CM = new ConnectionManager();
