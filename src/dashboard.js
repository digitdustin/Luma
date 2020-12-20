const { session } = require("electron");

var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

//initialize light discovery client
client.init();
console.log('dashboard client created');

const lightSelect = document.getElementById('light-select');
var option = document.createElement('option');
option.innerText = 'Select';
lightSelect.add(option);

//FOR TESTING-------

var option2 = document.createElement('option');
option2.innerText = 'sample light';
lightSelect.add(option2);

var option3 = document.createElement('option');
option3.innerText = 'sample light 2';
lightSelect.add(option3);

var lightName2 = document.createElement("div");
        lightName2.classList.add('light-name');
        lightName2.innerText = 'sample light 1'.toUpperCase();
        lightName2.addEventListener('click', () => {
            //on list light click, change color of div and change all sliders/swatches
            var lightsInList = document.getElementsByClassName('light-name');
            for (let i = 0; i < lightsInList.length; i++) {
                lightsInList[i].style.backgroundColor = 'transparent';
                lightsInList[i].style.color = 'rgb(209, 209, 209)';
            }
            lightName2.style.backgroundColor = '#283136';
            lightName2.style.color = 'white';
        });
        document.getElementById('light-list').appendChild(lightName2);

//------------------

lightSelect.addEventListener('change', (e) => {
    if (e.target.value.innerText != 'Select') {
        option.disabled = true;
    }
});

const lightContainer = document.getElementById('light-list');
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

client.on('light-new', (light) => {
    light.on();
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
            if (kelvinSlider.value >= 5250) {
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



