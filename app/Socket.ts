import {Logger} from "./Logger";
import {ConnectionManager} from "./ConnectionManager";

const app = require('express')();
const http = require('http').createServer(app);


export abstract class Socket extends ConnectionManager{
    protected abstract id: string;
    protected Logger = Logger;
    protected port = 3000;
    protected http = http;

    constructor() {
        this.id = Socket.generateSixDigitId();
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

    public getPort() {
        return this.port;
    }
}