import {Synchronizer} from "./synchronizer";
import {DataStore} from "./datastore";
import Server = SocketIO.Server;
import Socket = SocketIOClient.Socket;
/**
 * Created by oded on 5/3/17.
 */
export class InterNode {

    static nodeID: string;
    private static dataStore: DataStore;
    private static synchronizer: Synchronizer;
    private static SYNC_INTERVAL = 10*1000;//10s
    public ioServer : Server;
    public ioClient : Socket;

    public static getNodeID() {
        return InterNode.nodeID;
    }

    public static init(ioServer:Server,ioClient:Socket, ...hosts: string[]) {
        InterNode.nodeID = Math.random().toString(36).substring(2, 8);
        InterNode.dataStore = new DataStore(InterNode.nodeID);
        InterNode.log('node ' + InterNode.nodeID + ' is up');
        let syncPath = 'sync', newDataPath = 'newData';
        InterNode.synchronizer = new Synchronizer(InterNode.SYNC_INTERVAL, hosts, syncPath, InterNode.nodeID, InterNode.dataStore);
        ioServer.on(syncPath,InterNode.sync());
        ioServer.on(newDataPath,InterNode.receiveBroadcast());
        // ioServer(syncPath, InterNode.receiveHttpGet());
    }


    public static itemCount() {
        return InterNode.dataStore.itemCount();
    }

    public static set(key: string, value: string, expire?: number): void {
        InterNode.dataStore.set(key, value, expire)
    }

    public static get(key: string): any {
        return InterNode.dataStore.get(key);
    }

    public static aggregate(key: string, value: number, expire: number): void {
        InterNode.dataStore.aggregate(key, value, expire);
    }

    public static getAggregated(key: string): any {
        return InterNode.dataStore.getAggregated(key);
    }

    private static broadCast () {

    }
    private static sync(): (req: any, res: any) => void {
        return (req: any, res: any) => {
            if (InterNode.synchronizer.isFreshData(req)) {
                res.send(InterNode.dataStore.getDataStoreDiff(req.query.node_id));
            } else {
                res.send({status: Status.NOTHING_NEW});
            }
        }
    }

    private static receiveBroadcast(): (data) => void {
        return (data) => {
            if (InterNode.synchronizer.isFreshData(data)) {
                // res.send(InterNode.dataStore.getDataStoreDiff(data.query.node_id));
            } else {
                // res.send({status: Status.NOTHING_NEW});
            }
        }
    }

    static log(message: string) {
        if (InterNode.logHandler) {
            InterNode.logHandler('internode: ' + InterNode.nodeID + ' : ' + message);
        }
    }

    public static setLogHandler(logHandler: (message: string) => void) {
        InterNode.logHandler = logHandler;
    }

    private static logHandler: (message: string) => void;

}

export class Status {
    static NOTHING_NEW = 'nothing_new';
}