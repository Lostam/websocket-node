export class DataManager {

    private data: any[] = [];
    private sockets: Map<number, string>;
    private id: string;

    constructor(id: string) {
        this.sockets = new Map();
        this.setId(id);
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getId(): string | null {
        return this.id || null;

    }

    public setData(data: any[]) {
        this.data = data;
    }

    public getData() {
        return this.data;
    }

    public addData(newData: any): void {
        this.data = DataManager.joinArraysWithoutDuplications(this.data, [newData]);
        // this.data.push(newData)
    }


    public addSocket(newSocket: string, index: number): void {
        this.sockets.set(index, newSocket);
    }

    public setSockets(sockets: Array<[number, string]>) {
        this.sockets = new Map(sockets);
    }

    public getSockets(): Array<[number, string]> {
        return Array.from(this.sockets);
    }

    public getNextMapIndex(): number {
        let map = this.sockets;
        let big: number = 0;
        for (let key of map.keys()) {
            big = key > big ? key : big;
        }
        return big + 1;
    }

    public getNextMaster(): string {
        return this.sockets.get(1);
    }

    public findDiff(ownArr, remoteArr): { own: Array<any>, remote: Array<any> } {
        let arr = DataManager.joinArraysWithoutDuplications(ownArr, remoteArr);
        let differenceFrom1 = arr.filter(x => ownArr.indexOf(x) == -1);
        let differenceFrom2 = arr.filter(x => remoteArr.indexOf(x) == -1);
        return {
            own: differenceFrom1,
            remote: differenceFrom2
        }
    }

    static joinArraysWithoutDuplications(arr1: Array<any>, arr2: Array<any>) {
        return [...new Set([...arr1, ...arr2])];
    }

    public clear(): void {
        this.data = [];
    }
}