const { session } = require("electron");

var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

//initialize light discovery client
client.init();

const lightContainer = document.getElementById('light-list');
var hueSlider = document.getElementById('hue-slider');
var saturationSlider = document.getElementById('saturation-slider');
var brightnessSlider = document.getElementById('brightness-slider');
var kelvinSlider = document.getElementById('kelvin-slider');

client.on('light-new', (light) => {
    light.getLabel(function(error, data) {
        if (error) {
            throw error;
        }
        console.log(data);
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

}



