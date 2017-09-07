/**
 * Created by lostam on 15/05/2017.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
require('winston-loggly-bulk');
class Logger {
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
    log(message) {
        this.remoteLogger['info'](message);
    }
}
Logger.INPUT_TOKEN = '892712bd-b0c5-4770-9bb4-cbf9a18394f7';
Logger.SUB_DOMAIN = 'zippor';
Logger.TAGS = 'Websocket';
let logger = new Logger();
exports.Logger = logger;
//# sourceMappingURL=Logger.js.map