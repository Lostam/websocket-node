import {Logger} from "./Logger";
import {DataManager} from "./DataManager";
import {EventEmitter} from "events"
import {Express} from "express-serve-static-core";
import {Server} from "http";


export abstract class Socket extends EventEmitter {
    protected abstract type: string;
    protected abstract id: string;
    protected Logger = Logger;
    protected port = process.env.NODE_PORT || 8080;
    protected dataManager: DataManager;
    protected listener: { [name: string]: Function } = {};
    app:Express;
    server:Server;

    constructor(dataManager: DataManager, id: string) {
        super();
        this.id = id;
        this.dataManager = dataManager;
        this.app = require('express')();
        this.server = require('http').createServer(this.app);
    }

    // static send(whom, event, message, fn?: Function) {
    //     message = JSON.stringify([event, message]);
    //     whom.send(message, err => {
    //         if (fn && err) {
    //             fn(err);
    //         }
    //     });
    // }


    public abstract newData (data):void

    protected abstract send(name: string, content: any, whom?: any): void;

    protected listen(name: string, fn: Function) {
        this.listener[name] = fn;
    }

    protected handleMessage(message,ws?:Socket) {
        message = JSON.parse(message);
        let name = Object.keys(message)[0];
        let content = message[name];
        if (this.listener.hasOwnProperty(name)) {
            this.listener[name](content,ws);
        }
        else {
            console.error(`No Listener for ${name} exists`)
        }
    }

    public serverListen() {
        this.server.listen(this.port, () => {
            console.log('Listening on %d', this.server.address().port);
        });

        this.app.get('/', (req, res) => {
            res.send('Yo ' + this.id + " " + this.type)
        });
        this.app.get('/up', (req, res) => {
            let random: string = (Math.random() * 100).toString(36).substring(2, 8) + "::" + this.id;
            this.dataManager.addData([random]);
            this.send('sync', random);
            res.send(`sent ${random}`)
        });
        this.app.get('/all', (req, res) => {
            res.send(`${this.dataManager.getData()}`)
        });

        console.log('My Id: ', this.id);


    }
    public getId() {
        return this.id;
    }

    public getPort() {
        return this.port;
    }

    getType() {
        return this.type;
    }
}