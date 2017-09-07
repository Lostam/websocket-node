// let ioClient = require('socket.io-client');
//
// let socketEmitter = ioClient.connect('http://localhost:80');
// setInterval(() => {
//     let ran = (Math.random() * 100).toString(36).substring(2, 8) + "::" + '111111';
//     socketEmitter.emit('dataSync', {data: ran})
// }, 500);

//
// app.listen(9000,()=>{
//
// })
//
// app.get('/',(req,res)=>{
//     console.log('x');
//     res.send('OK');
// })
(function () {
    let message = "aaa";
    let event = "sss";
    let arr = ["aaa", "sss"];
    let json = JSON.stringify(arr);
    let unjson = JSON.parse('["dataSync",".z4vjo::313413"]');
    console.log(json);
    console.log(unjson[0],unjson[1]);

})();