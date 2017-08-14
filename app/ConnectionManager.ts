// export class WebNode {
//
// }

import {WebServer} from "./WebServer";
import {WebClient} from "./WebClient";

export class ConnectionManager {

    private wait: number = Math.round(Math.random() * 1500 + 500);
    private socket: WebClient | WebServer;

    constructor() {
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
        this.socket = new WebClient();
        this.socket.connect(options);

        this.socket.checkConnection()
            .then(() => {
                console.log('Slave');
            })
            .catch((err) => {
                console.log('Master');
                this.socket = new WebServer();
            });
    }
}

let CM = new ConnectionManager();
