export class DataManager {

    private data: any[] = [];
    private sockets: Map<number, string>;
    private id: string;

    constructor(id: string) {
        this.sockets = new Map();
        console.log(this.sockets);
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

    public addData(newData) {
        this.data.push(newData)
    }


    public addSocket(newSocket, index) {
        console.log(this.sockets);
        console.log(index);
        console.log(newSocket);
        this.sockets.set(index, newSocket);
    }

    public setSockets(sockets:Array<Array<number | string>>) {
        console.log('sockets', sockets);
        this.sockets = new Map(sockets);
    }

    public getSockets(): Array<Array<number | string>> {
        return Array.from(this.sockets);
    }

    public getNextMapIndex ():number {
        let map = this.sockets;
        let big: number = 0;
        for (let key of map.keys()) {
            big = key > big ? key : big;
        }
        return big+1;
    }

    public clear(): void {
        this.data = [];
    }
}