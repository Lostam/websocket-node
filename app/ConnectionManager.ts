
import {WebServer} from "./WebServer";
import {WebClient} from "./WebClient";
import {DataManager} from "./DataManager";

export class ConnectionManager {

    private wait: number = Math.round(Math.random() * 1500 + 500);
    private socket: WebClient | WebServer;
    private dataManager:DataManager;
    private id:string;

    constructor() {
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager(this.id);

        setTimeout(() => {
            this.chooseNode();
        }, this.wait);
    }

    chooseNode() {
        let options = {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 3000,
            'reconnectionAttempts': 5
        };
        this.socket = new WebClient(this.dataManager,this.id);
        this.socket.connect(options);
        this.socket.checkConnection()
            .then(() => {
                console.log('Slave');
                this.clientDisconnectListener()
            })
            .catch((err) => {
                console.log('Master');
                this.socket = new WebServer(this.dataManager,this.id);
            });
    }

    private clientDisconnectListener () {
        this.socket.on('clientDisconnect',()=>{
            console.log('an event occurred!');
            let options = {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 3000,
                'reconnectionAttempts': 5
            };
            // this.connect(options)
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
