/**
 * Created by lostam on 15/05/2017.
 */
'use strict';

const winston = require('winston');
require('winston-loggly-bulk');


class Logger {
    private INPUT_TOKEN: string;
    private SUB_DOMAIN: string;
    private TAGS: string;

    constructor() {
        this.INPUT_TOKEN = '892712bd-b0c5-4770-9bb4-cbf9a18394f7';
        this.SUB_DOMAIN = 'zippor';
        this.TAGS = 'SocketTest';
        winston.add(winston.transports.Loggly, {
            inputToken: this.INPUT_TOKEN,
            subdomain: this.SUB_DOMAIN,
            tags: [this.TAGS],
            json: true
        });

    }

    public log(error) {
        winston.log('info',error);
    }

}

let logger = new Logger();
export {logger as Logger};
