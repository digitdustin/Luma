const { remote, ipcRenderer } = require('electron');
const { relative } = require('path');
const path = require('path');
const { start } = require('repl');


//get aspect ratio of screen for display
var aspect = aspectRatio();
console.log(aspect);

//screen display dimensions
const screenDisplay = document.getElementById('screen');
screenDisplay.style.height = '350px';
screenDisplay.style.width = ((350 * aspect[0]) / aspect[1]) + "px";
screenDisplay.addEventListener('click', (event) => {
    var allZones = document.getElementsByClassName('screen-zone');
    for (let i = 0; i < allZones.length; i++) {
        allZones[i].style.borderWidth = "0px";
    }
    newZoneButton.hidden = false;
    lightSelect.hidden = false;

    startZoneButton.hidden = true;
    stopZoneButton.hidden = true;
    deleteZoneButton.hidden = true;
})

//light select dropdown
const zoneControl = document.getElementById('zone-control');
var lightSelect = document.createElement('select');
lightSelect.classList.add('uk-select');
lightSelect.id = 'light-select';
zoneControl.appendChild(lightSelect);

//new zone button
var newZoneButton = document.createElement('button');
newZoneButton.className="uk-button uk-button-default";
newZoneButton.id = 'new-zone-button';
newZoneButton.innerText = 'New Zone';
newZoneButton.style.color = 'white';
zoneControl.appendChild(newZoneButton);

var startZoneButton = document.createElement('button');
startZoneButton.className="uk-button uk-button-default";
startZoneButton.id = 'start-zone-button';
startZoneButton.innerText = 'Start Zone';
startZoneButton.style.color = 'white';
startZoneButton.hidden = true;
zoneControl.appendChild(startZoneButton);

var stopZoneButton = document.createElement('button');
stopZoneButton.className="uk-button uk-button-default";
stopZoneButton.id = 'stop-zone-button';
stopZoneButton.innerText = 'Stop Zone';
stopZoneButton.style.color = 'white';
stopZoneButton.hidden = true;
zoneControl.appendChild(stopZoneButton);

var deleteZoneButton = document.createElement('button');
deleteZoneButton.className="uk-button uk-button-default";
deleteZoneButton.id = 'delete-zone-button';
deleteZoneButton.innerText = 'Delete Zone';
deleteZoneButton.style.color = 'white';
deleteZoneButton.hidden = true;
zoneControl.appendChild(deleteZoneButton);

var dimensions = [];
var lights = [];

//launch resize from newzonebutton click
newZoneButton.addEventListener('click', () => {
    if (lightSelect[lightSelect.selectedIndex].innerText != 'Select') {
        
        if (lights.includes(lightSelect[lightSelect.selectedIndex].innerText)) {
            
            alert('Light already has zone!')
            
        } else {
            lights.push(lightSelect[lightSelect.selectedIndex].innerText);
            
            getResizeArea(lightSelect[lightSelect.selectedIndex].innerText);
        
            //lights lign up with dimensions in same indices
            console.log('light label pushed');

            //create div on screen display to show zone;
            var zoneArea = document.createElement('div');
            //remove spaces from light name for id
            zoneArea.id = lightSelect[lightSelect.selectedIndex].innerText.replace(/\s/g, '');
            zoneArea.classList.add('screen-zone');
            screenDisplay.appendChild(zoneArea);
        }
    }
});

//listen for screen area addition
ipcRenderer.on("add-selection-area", (e, data, web_component_id) => {
    console.log(data);
    dimensions.push(data);

    console.log('dimensions pushed');
    var zone = document.getElementById(lights[dimensions.indexOf(data)].replace(/\s/g, ''));
    console.log(Math.round(((data.top/screen.width) * parseInt((screenDisplay.style.height).slice(0, -2)))));
    console.log(screen.width);
    
    zone.style.width = Math.round(((data.width/screen.width) * parseInt((screenDisplay.style.width).slice(0, -2)))) + "px";
    zone.style.height = Math.round(((data.height/screen.height) * parseInt((screenDisplay.style.height).slice(0, -2)))) + "px";
    zone.style.top = Math.round(((data.top/screen.height) * parseInt((screenDisplay.style.height).slice(0, -2)))) + "px";
    zone.style.left = Math.round(((data.left/screen.width) * parseInt((screenDisplay.style.width).slice(0, -2)))) + "px";

    zone.addEventListener('click', (event) => {
        event.stopPropagation();
        //set all borders to none except selected
        var allZones = document.getElementsByClassName('screen-zone');
        for (let i = 0; i < allZones.length; i++) {
            allZones[i].style.borderWidth = "0px";
        }
        zone.style.border = '2px solid white';

        //switch zone control to control selected zone
        zoneControlChange(lights[dimensions.indexOf(data)], data);
    })
});

//functions ot find aspect ratio of screen
function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function aspectRatio() {
    var w = screen.width;
    var h = screen.height;
    var r = gcd (w, h);

    return [w/r, h/r];
}

function getResizeArea(label) {
    createResizeWindow();
}

const createResizeWindow = () => {
    var dimensions = [];
    
    //creates window used to capture part of the screen continuously and find color values of that portion.
    const BrowserWindow = remote.BrowserWindow;
    const resizeWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        resizable: true,
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

    resizeWindow.resizable = false;
    //ignores all click events on window
    //resizeWindow.setIgnoreMouseEvents(true);
    //keeps window on top at all times
    resizeWindow.setAlwaysOnTop(true, 'screen-saver');
}

function zoneControlChange(label, data) {
    newZoneButton.hidden = true;
    lightSelect.hidden = true;

    startZoneButton.hidden = false;
    stopZoneButton.hidden = false;
    deleteZoneButton.hidden = false;

    //add event listeners for start, stop, zone
    startZoneButton.addEventListener('click', () => {
        const BrowserWindow = remote.BrowserWindow;
        const captureWindow = new BrowserWindow({
            
            resizable: true,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true
            }
        });
    
        //resizeWindow.webContents.openDevTools();
        
        //loads resize.html and js
        captureWindow.loadFile(path.join(__dirname, 'capture.html'));
        //makes window full screen
        //resizeWindow.maximize();
    
        //ignores all click events on window
        //resizeWindow.setIgnoreMouseEvents(true);
        //keeps window on top at all times
        //resizeWindow.setAlwaysOnTop(true, 'screen-saver');
    })
    
 

    

}