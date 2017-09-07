/**
 * Created by lostam on 15/05/2017.
 */
'use strict';

const winston = require('winston');

require('winston-loggly-bulk');


class Logger {
    static INPUT_TOKEN: string = '892712bd-b0c5-4770-9bb4-cbf9a18394f7';
    static SUB_DOMAIN: string = 'zippor';
    static TAGS: string = 'Websocket';
    private remoteLogger;

    constructor() {
        let remoteTransport = [
            new winston.transports.Loggly({
                inputToken: Logger.INPUT_TOKEN,
                subdomain: Logger.SUB_DOMAIN,
                tags: [Logger.TAGS],
                json: true
            })
        ];

        this.remoteLogger = new winston.Logger({
            transports: remoteTransport,
            exitOnError: false
        });
    }

    public log(message) {
        this.remoteLogger['info'](message);
    }

}

let logger = new Logger();
export {logger as Logger};
