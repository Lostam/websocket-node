"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataManager {
    constructor(id) {
        this.data = [];
        this.sockets = new Map();
        console.log(this.sockets);
        this.setId(id);
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id || null;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    addData(newData) {
        this.data.push(newData);
    }
    addSocket(newSocket, index) {
        console.log(this.sockets);
        console.log(index);
        console.log(newSocket);
        this.sockets.set(index, newSocket);
    }
    setSockets(sockets) {
        console.log('sockets', sockets);
        this.sockets = new Map(sockets);
    }
    getSockets() {
        return Array.from(this.sockets);
    }
    getNextMapIndex() {
        let map = this.sockets;
        let big = 0;
        for (let key of map.keys()) {
            big = key > big ? key : big;
        }
        return big + 1;
    }
    clear() {
        this.data = [];
    }
}
exports.DataManager = DataManager;
//# sourceMappingURL=dataManager.js.map