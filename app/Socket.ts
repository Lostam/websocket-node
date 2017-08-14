import {Logger} from "./Logger";
import {ConnectionManager} from "./ConnectionManager";
import {DataManager} from "./DataManager";
import {EventEmitter} from "events"
// import EventEmitter = NodeJS.EventEmitter;

const app = require('express')();
const http = require('http').createServer(app);


export abstract class Socket extends EventEmitter{
    protected abstract id: string;
    protected Logger = Logger;
    protected port = 3000;
    protected http = http;
    protected dataManager: DataManager;

    constructor(dataManager:DataManager,id:string) {
        super();
        this.id = id;
        this.dataManager = dataManager;
    }
    public getId() {
        return this.id;
    }

    public getPort() {
        return this.port;
    }
}