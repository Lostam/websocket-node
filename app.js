"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionManager_1 = require("./app/ConnectionManager");
const Logger_1 = require("./app/Logger");
let CM = new ConnectionManager_1.ConnectionManager();
setTimeout(() => {
    CM.chooseNode()
        .then(() => {
        Logger_1.Logger.log(`${CM.getType()} ${CM.getId()} Is Up`);
    });
}, Math.round(Math.random() * 2500 + 500));
//
// function runData() {
//     setInterval(() => {
//         let x = (Math.random() * 100).toString(36).substring(2, 8) + (Math.random() * 100).toString(36).substring(2, 8);
//         CM.sync(x);
//         console.error(x);
//     }, Math.random() * (7000) + 3000);
// } 
//# sourceMappingURL=app.js.map