const { session } = require("electron");

var hueSlider = document.getElementById('hue-slider');
var saturationSlider = document.getElementById('saturation-slider');
var brightnessSlider = document.getElementById('brightness-slider');
var kelvinSlider = document.getElementById('kelvin-slider');

//set initial slider values (will change when bulb is selected)
kelvinSlider.style.backgroundImage =  'linear-gradient(90deg, hsl(30, 100%, 80%), hsl(200, 100%, 80%))';
hueSlider.style.background = '-webkit-linear-gradient(0deg, hsl(0, 100%, 50%) 0%, hsl(60, 100%, 50%) 17%, hsl(120, 100%, 50%) 33%, hsl(180, 100%, 50%) 50%, hsl(240, 100%, 50%) 67%, hsl(300, 100%, 50%) 83%, hsl(0, 100%, 50%) 100%)';
saturationSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, 0%, 50%), hsl(${hueSlider.value}, 50%, 50%), hsl(${hueSlider.value}, 100%, 50%)`;
brightnessSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, 100%, 0%), hsl(${hueSlider.value}, 100%, 50%), hsl(${hueSlider.value}, 100%, 100%)`;

//set initial value of big swatch
document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;

// Update the current slider value (each time you drag the slider handle) as well as big swatch color
hueSlider.oninput = () => {
    saturationSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, 0%, ${brightnessSlider.value}%), hsl(${hueSlider.value}, 50%, ${brightnessSlider.value}%), hsl(${hueSlider.value}, 100%, ${brightnessSlider.value}%)`;
    brightnessSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, 100%, 0%), hsl(${hueSlider.value}, 100%, 50%), hsl(${hueSlider.value}, 100%, 100%)`;
    console.log(hueSlider.value)

    document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;

}

saturationSlider.oninput = () => {
    hueSlider.style.background = `-webkit-linear-gradient(0deg, hsl(0, ${saturationSlider.value}%, ${brightnessSlider.value}%) 0%, hsl(60, ${saturationSlider.value}%, ${brightnessSlider.value}%) 17%, hsl(120, ${saturationSlider.value}%, ${brightnessSlider.value}%) 33%, hsl(180, ${saturationSlider.value}%, ${brightnessSlider.value}%) 50%, hsl(240, ${saturationSlider.value}%, ${brightnessSlider.value}%) 67%, hsl(300, ${saturationSlider.value}%, ${brightnessSlider.value}%) 83%, hsl(0, ${saturationSlider.value}%, ${brightnessSlider.value}%) 100%)`;
    brightnessSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, ${saturationSlider.value}%, 0%), hsl(${hueSlider.value}, ${saturationSlider.value}%, 50%), hsl(${hueSlider.value}, ${saturationSlider.value}%, 100%)`;
    console.log(saturationSlider.value)

    document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;
}

brightnessSlider.oninput = () => {
    hueSlider.style.background = `-webkit-linear-gradient(0deg, hsl(0, ${saturationSlider.value}%, ${brightnessSlider.value}%) 0%, hsl(60, ${saturationSlider.value}%, ${brightnessSlider.value}%) 17%, hsl(120, ${saturationSlider.value}%, ${brightnessSlider.value}%) 33%, hsl(180, ${saturationSlider.value}%, ${brightnessSlider.value}%) 50%, hsl(240, ${saturationSlider.value}%, ${brightnessSlider.value}%) 67%, hsl(300, ${saturationSlider.value}%, ${brightnessSlider.value}%) 83%, hsl(0, ${saturationSlider.value}%, ${brightnessSlider.value}%) 100%)`;
    saturationSlider.style.backgroundImage = `linear-gradient(90deg, hsl(${hueSlider.value}, 0%, ${brightnessSlider.value}%), hsl(${hueSlider.value}, 50%, ${brightnessSlider.value}%), hsl(${hueSlider.value}, 100%, ${brightnessSlider.value}%)`;
    console.log(brightnessSlider.value)

    document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;
}

kelvinSlider.oninput = () => {
    hueSlider.value = 180;
    saturationSlider.value = 50;
    brightnessSlider.value = 100;
    if (kelvinSlider.value >= 5250) {
        document.getElementById('current-swatch').style.backgroundColor = `hsl(${(Math.round(((kelvinSlider.value - 1500) / 7500) * 170)) + 30}, 100%, ${85 + (20 - Math.round(((kelvinSlider.value - 5250) / 3750) * 20))}%)`;
    } else {
        document.getElementById('current-swatch').style.backgroundColor = `hsl(${(Math.round(((kelvinSlider.value - 1500) / 7500) * 170)) + 30}, 100%, ${85 + (Math.round(((kelvinSlider.value - 1500) / 3750) * 20))}%)`;
    }
    
}