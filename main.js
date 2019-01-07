const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


/*
const SerialPort = require("serialport");

SerialPort.list((err, ports) => {
    console.log(err, ports)
});
*/

let url;
if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/';
} else {
    url = `file://${process.cwd()}/dist/index.html`;
}

app.on('ready', () => {
    let window = new BrowserWindow({ width: 800, height: 600 })
    window.loadURL(url)
});