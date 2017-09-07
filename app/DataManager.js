"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataManager {
    constructor(id) {
        this.data = [];
        this.sockets = new Map();
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
        this.data = DataManager.joinArraysWithoutDuplications(this.data, [newData]);
        // this.data.push(newData)
    }
    addSocket(newSocket, index) {
        this.sockets.set(index, newSocket);
    }
    setSockets(sockets) {
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
    getNextMaster() {
        return this.sockets.get(1);
    }
    findDiff(ownArr, remoteArr) {
        let arr = DataManager.joinArraysWithoutDuplications(ownArr, remoteArr);
        let differenceFrom1 = arr.filter(x => ownArr.indexOf(x) == -1);
        let differenceFrom2 = arr.filter(x => remoteArr.indexOf(x) == -1);
        return {
            own: differenceFrom1,
            remote: differenceFrom2
        };
    }
    static joinArraysWithoutDuplications(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    }
    clear() {
        this.data = [];
    }
}
exports.DataManager = DataManager;
//# sourceMappingURL=DataManager.js.map