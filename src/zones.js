const { remote, ipcRenderer, shell, session } = require('electron');
const { relative } = require('path');
const path = require('path');
const {PythonShell} = require('python-shell');
var hexToHsl = require('hex-to-hsl');
var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

//initialize light discovery client
client.init();
console.log('dashboard client created');


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


var option = document.createElement('option');
option.innerText = 'Select';
lightSelect.add(option);

lightSelect.addEventListener('change', (e) => {
    if (e.target.value.innerText != 'Select') {
        option.disabled = true;
    }
});

var lightContainer = document.getElementById('light-list')


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
var Zones = [];

class Zone {
    constructor() {
        this.label = "";
        this.data = 0;
        this.active = false;
        this.pyshell = "";
        this.id = "";
    }
}

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
            var newZone = new Zone();
            newZone.label = lightSelect[lightSelect.selectedIndex].innerText;
            newZone.id = lightSelect[lightSelect.selectedIndex].innerText.replace(/\s/g, '')
            
            Zones.push(newZone);
            screenDisplay.appendChild(zoneArea);
        }
    }
});

//listen for screen area addition
ipcRenderer.on("add-selection-area", (e, data, web_component_id) => {
    console.log(data);
    dimensions.push(data);
    Zones[dimensions.indexOf(data)].data = data;

    //show new zone n screen render
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
        for(var i = 0; i < Zones.length; i++) {
            if (Zones[i].id == event.target.id) {
                console.log(Zones[i])
                zoneControlChange(Zones[i]);
            }
        }
        
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



function zoneControlChange(Zone) {
    newZoneButton.hidden = true;
    lightSelect.hidden = true;

    startZoneButton.hidden = false;
    stopZoneButton.hidden = false;
    deleteZoneButton.hidden = false;

console.log(Zone.active)

    //running?
    if (Zone.active == true) {
        startZoneButton.disabled = true;
        stopZoneButton.disabled = false;
    } else {
        stopZoneButton.disabled = true;
        startZoneButton.disabled = false;
    }

    //add event listeners for start, stop, zone
    startZoneButton.addEventListener('click', () => {
        //if zone is running or is not selected, exit
        if (document.getElementById(Zone.id).style.borderWidth == "0px") {
            return;
        }
        if (Zone.active) {
            return;
        }
        client.light(Zone.label).on();
        //start color track
        Zone.pyshell = new PythonShell(path.join(__dirname, 'capture.py'), { mode: 'text', args: [Zone.label, Zone.data.left, Zone.data.right, Zone.data.top, Zone.data.bottom]});
        
        Zone.pyshell.on('message', function (message) {
            //console.log(message);
            //message format: hex color
            var hslColor = hexToHsl(`#${message}`);
            document.getElementById(Zone.id).style.backgroundColor = `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2]}%)`
            //change light color
            client.light(Zone.label).color(hslColor[0], hslColor[1], hslColor[2], 3500, 200)
        });


        Zone.active = true;

        startZoneButton.disabled = true;
        stopZoneButton.disabled = false;

    })

    stopZoneButton.addEventListener('click', () => {
        //if zone is not running or is not selected, exit
        if (document.getElementById(Zone.id).style.borderWidth == "0px") {
            return;
        }
        if (!Zone.active) {
            return;
        }
        Zone.pyshell.kill();
        startZoneButton.disabled = false;
        stopZoneButton.disabled = true;
        Zone.active = false;
        Zone.pyshell = "";
    })
}

client.on('light-new', (light) => {
    
    light.getLabel(function(error, data) {
        if (error) {
            throw error;
        }
        console.log(data);
        
        //add light to zones dropdown
        
        var lightOption = document.createElement('option');
        lightOption.innerText = data;
        lightSelect.add(lightOption);

        //add light to light list
        const lightName = document.createElement("div");
        lightName.classList.add('light-name');
        lightName.innerText = data.toUpperCase();
        lightName.addEventListener('click', () => {
            //on list light click, change color of div and change all sliders/swatches
            var lightsInList = document.getElementsByClassName('light-name');
            for (let i = 0; i < lightsInList.length; i++) {
                lightsInList[i].style.backgroundColor = 'transparent';
                lightsInList[i].style.color = 'rgb(209, 209, 209)';
            }
            lightName.style.backgroundColor = '#283136';
            lightName.style.color = 'white';
            changeControls(light);
        });
        lightContainer.appendChild(lightName);
    });
})

//SLIDER CONTROLS


const hueSlider = document.getElementById('hue-slider');
const saturationSlider = document.getElementById('saturation-slider');
const brightnessSlider = document.getElementById('brightness-slider');
const kelvinSlider = document.getElementById('kelvin-slider');

var activeLight = 0;
var wait = true;

function changeWait() {
    setTimeout(() => {
        wait = true
    }, 50);
}

//change lights when sliders change
hueSlider.addEventListener('input', (e) => {
    if (wait == true) {
        if (activeLight != 0) {
            activeLight.color(Number(hueSlider.value), Number(saturationSlider.value), Number(brightnessSlider.value)); // Set to red at 50% brightness
        }
        wait = false;
        changeWait();
    }
})

saturationSlider.addEventListener('input', (e) => {
    if (wait == true) {
        if (activeLight != 0) {
            activeLight.color(Number(hueSlider.value), Number(saturationSlider.value), Number(brightnessSlider.value)); // Set to red at 50% brightness
        }
        wait = false;
        changeWait();
    }
})

brightnessSlider.addEventListener('input', (e) => {
    if (wait == true) {
        if (activeLight != 0) {
            activeLight.color(Number(hueSlider.value), Number(saturationSlider.value), Number(brightnessSlider.value)); // Set to red at 50% brightness
        }
        wait = false;
        changeWait();
    }
})

//changes all sliders and current swatch to the selected light color
function changeControls(light) {
    light.getState(function(error, data) {
        if (error) {
            throw error;
        }
        console.log(data);
        if (data['color']['saturation'] == 0) {
            //change slider if white
            document.getElementById('kelvin-slider').value = data['color']['kelvin'];
            document.getElementById('hue-slider').value = 180;
            document.getElementById('saturation-slider').value = 50;
            document.getElementById('brightness-slider').value = 100;
            //change swatch shade
            if (document.getElementById('kelvin-slider').value >= 5250) {
                document.getElementById('current-swatch').style.backgroundColor = `hsl(${(Math.round(((kelvinSlider.value - 1500) / 7500) * 170)) + 30}, 100%, ${85 + (20 - Math.round(((kelvinSlider.value - 5250) / 3750) * 20))}%)`;
            } else {
                document.getElementById('current-swatch').style.backgroundColor = `hsl(${(Math.round(((kelvinSlider.value - 1500) / 7500) * 170)) + 30}, 100%, ${85 + (Math.round(((kelvinSlider.value - 1500) / 3750) * 20))}%)`;
            }
        } else {
            //change sliders if color
            document.getElementById('kelvin-slider').value = 5250;
            document.getElementById('hue-slider').value = data['color']['hue'];
            document.getElementById('saturation-slider').value = data['color']['saturation'];
            document.getElementById('brightness-slider').value = data['color']['brightness'];
            //change swatch color
            document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;
        }
        document.getElementById('current-swatch').value = data['color']['brightness'];
        
    })


    activeLight = light;
    console.log(activeLight);

}