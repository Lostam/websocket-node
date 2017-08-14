"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const synchronizer_1 = require("./synchronizer");
const datastore_1 = require("./datastore");
/**
 * Created by oded on 5/3/17.
 */
class InterNode {
    static getNodeID() {
        return InterNode.nodeID;
    }
    static init(ioServer, ioClient, ...hosts) {
        InterNode.nodeID = Math.random().toString(36).substring(2, 8);
        InterNode.dataStore = new datastore_1.DataStore(InterNode.nodeID);
        InterNode.log('node ' + InterNode.nodeID + ' is up');
        let syncPath = 'sync', newDataPath = 'newData';
        InterNode.synchronizer = new synchronizer_1.Synchronizer(InterNode.SYNC_INTERVAL, hosts, syncPath, InterNode.nodeID, InterNode.dataStore);
        ioServer.on(syncPath, InterNode.sync());
        ioServer.on(newDataPath, InterNode.receiveBroadcast());
        // ioServer(syncPath, InterNode.receiveHttpGet());
    }
    static itemCount() {
        return InterNode.dataStore.itemCount();
    }
    static set(key, value, expire) {
        InterNode.dataStore.set(key, value, expire);
    }
    static get(key) {
        return InterNode.dataStore.get(key);
    }
    static aggregate(key, value, expire) {
        InterNode.dataStore.aggregate(key, value, expire);
    }
    static getAggregated(key) {
        return InterNode.dataStore.getAggregated(key);
    }
    static broadCast() {
    }
    static sync() {
        return (req, res) => {
            if (InterNode.synchronizer.isFreshData(req)) {
                res.send(InterNode.dataStore.getDataStoreDiff(req.query.node_id));
            }
            else {
                res.send({ status: Status.NOTHING_NEW });
            }
        };
    }
    static receiveBroadcast() {
        return (data) => {
            if (InterNode.synchronizer.isFreshData(data)) {
                // res.send(InterNode.dataStore.getDataStoreDiff(data.query.node_id));
            }
            else {
                // res.send({status: Status.NOTHING_NEW});
            }
        };
    }
    static log(message) {
        if (InterNode.logHandler) {
            InterNode.logHandler('internode: ' + InterNode.nodeID + ' : ' + message);
        }
    }
    static setLogHandler(logHandler) {
        InterNode.logHandler = logHandler;
    }
}
InterNode.SYNC_INTERVAL = 10 * 1000; //10s
exports.InterNode = InterNode;
class Status {
}
Status.NOTHING_NEW = 'nothing_new';
exports.Status = Status;
//# sourceMappingURL=internode.js.map