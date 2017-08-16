import {Logger} from "./Logger";
import {ConnectionManager} from "./ConnectionManager";
import {DataManager} from "./DataManager";
import {EventEmitter} from "events"
// import EventEmitter = NodeJS.EventEmitter;

export abstract class Socket extends EventEmitter{
     protected abstract type:string;
    protected abstract id: string;
    protected Logger = Logger;
    protected port = process.env.NODE_PORT || 3000;
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

    getType () {
        return this.type;
    }
}