import {WebServer} from "./WebServer";
import {WebClient} from "./WebClient";
import {DataManager} from "./DataManager";
import {Socket} from "./Socket";


export class ConnectionManager {
    private wait: number = Math.round(Math.random() * 2500 + 500);
    private socket: WebClient | WebServer;
    private dataManager: DataManager;
    private id: string;

    constructor() {
        this.id = ConnectionManager.generateSixDigitId();
        this.dataManager = new DataManager(this.id);
    }

    chooseNode() {
        return new Promise((resolve, reject) => {
            let options = {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 3000,
                'reconnectionAttempts': 5
                // 10
            };
            this.socket = new WebClient(this.dataManager, this.id);
            this.socket.searchMaster(options)
                .then(() => {
                    console.log('Slave');
                    this.clientDisconnectListener();
                    resolve();
                })
                .catch((err) => {
                    if (err) console.log(err);
                    console.log('Master');
                    this.socket = new WebServer(this.dataManager, this.id);
                    resolve();
                });

        });
    }

    sync(data) {
        this.socket.newData(data);
    }

    private clientDisconnectListener() {
        this.socket.on('clientDisconnect', () => {
            console.log('an event occurred!');
            this.chooseNode()
        })
    }

    static generateSixDigitId() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr[i] = Math.ceil(Math.random() * 6)
        }
        return arr.join('');
    }

    public getId() {
        return this.id;
    }

    public getType() {
        return this.socket.getType();
    }
}