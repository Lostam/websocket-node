import {ConnectionManager} from "./app/ConnectionManager";
import {Logger} from "./app/Logger";


let CM = new ConnectionManager();

setTimeout(() => {
    CM.chooseNode()
        .then(() => {
            Logger.log(`${CM.getType()} ${CM.getId()} Is Up`)
        })
}, Math.round(Math.random() * 2500 + 500));
//
// function runData() {
//     setInterval(() => {
//         let x = (Math.random() * 100).toString(36).substring(2, 8) + (Math.random() * 100).toString(36).substring(2, 8);
//         CM.sync(x);
//         console.error(x);
//     }, Math.random() * (7000) + 3000);
// }