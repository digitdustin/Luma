//LOGIC FOR OPENING RENDER

const { remote, ipcRenderer } = require('electron');
const path = require('path');
const { noDeprecation } = require('process');

//elements
const captureButton = document.getElementById('capture-btn');

//functions 
const createResizeWindow = () => {
    //creates window used to capture part of the screen continuously and find color values of that portion.
    const BrowserWindow = remote.BrowserWindow;
    const resizeWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    //resizeWindow.webContents.openDevTools();
    
    //loads resize.html and js
    resizeWindow.loadFile(path.join(__dirname, 'resize.html'));
    //makes window full screen
    resizeWindow.maximize();
    //ignores all click events on window
    //resizeWindow.setIgnoreMouseEvents(true);
    //keeps window on top at all times
    resizeWindow.setAlwaysOnTop(true, 'screen-saver');
}

//event listeners
captureButton.addEventListener('click', createResizeWindow, false);

//https://stackoverflow.com/questions/43486438/electron-ipc-sending-data-between-windows/43486549
//listen for selection of screen area
ipcRenderer.on("add-selection-area", (e, data, web_component_id) => {
    console.log("msg receieved:");
    console.log(data);
});

//FADER






