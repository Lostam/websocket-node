import {Socket} from "./Socket";
import {DataManager} from "./DataManager";
import Timer = NodeJS.Timer;

const WebSocket = require("ws");

export class WebClient extends Socket {
    private ioClient: any;
    private intervals: Timer[] = [];
    protected id: string;
    protected type = 'Slave';
    private url = process.env.NODE_URL || 'ws://localhost:8080';
    public port = process.env.NODE_PORT || WebClient.getRandomPort();

    constructor(dataManager: DataManager, id: string) {
        super(dataManager, id);
    }

    public searchMaster(options) {
        return new Promise((resolve, reject) => {
            this.connectAttempt(options)
                .then(() => {
                    resolve();
                    this.init();
                })
                .catch(() => {
                    reject();
                });
        });
    }

    public connectAttempt(options: WSClientOptions, currentRetry?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            currentRetry = currentRetry || 0;

            options = options || {reconnectionAttempts: 999, reconnectionDelay: 2000, reconnectionDelayMax: 10000};

            if (currentRetry !== options.reconnectionAttempts) {
                console.log('Retry number : ', currentRetry);

                this.ioClient = new WebSocket(this.url);
                this.ioClient.onerror = (err) => {
                    setTimeout(() => {
                        return this.connectAttempt(options, currentRetry + 1)
                            .then(() => {
                                resolve();
                            })
                            .catch(() => {
                                reject();
                            });
                    }, options.reconnectionDelay);
                };
                this.ioClient.onopen = (() => {
                    this.send('new-socket', "Yo I'm new here" + this.id);
                    resolve();
                });
            }
            else {
                reject();
            }
        })
    }

    protected send(name, content) {
        let obj = {};
        obj[name] = content;
        let message = JSON.stringify(obj);
        this.ioClient.send(message);

    }

    private disconnectListener() {
        this.ioClient.onclose = () => {
            console.log('disconnected');
            this.cleanIntervals();
            this.disconnect();
            this.emit('clientDisconnect');

        };
    }

    public init() {
        this.serverListen(); // open port
        this.write(); // emiters
        this.disconnectListener(); // disconnect protocol
        this.setListeners(); // listener
    }

    private setListeners() {
        this.listen('idUpdate', (message) => {
            console.info(message);
        });
        this.listen('new-socket', (message) => {
            console.info(message);
        });
        this.listen('alive', (message) => {
            console.info(message);
        });
        this.listen('sync', (data) => {
            this.dataManager.addData(data);
        });

        this.ioClient.onmessage = (message: any) => {
            this.handleMessage(message.data);
        };
    }

    public newData(data) {
        this.send('sync', data);
    }

    public write() {
        let interval2 = setInterval(() => {
            this.send('alive', "Yo I'm alive" + this.id);
        }, 1000 * 10);
        this.intervals.push(interval2);
    }

    private cleanIntervals() {
        for (let interval of this.intervals) {
            clearInterval(interval);
        }
    }

    public disconnect() {
        this.ioClient.close();
    }

    static getRandomPort() {
        return Math.floor(Math.random() * (8000) + 1000);
    }
}

interface WSClientOptions {
    reconnectionDelay?: number,
    reconnectionDelayMax?: number,
    reconnectionAttempts?: number
}