const currentSwatch = document.createElement('div');
currentSwatch.id = 'current-swatch';


for (let i = 0; i < 12; i++) {
    const newSwatch = document.createElement('div');
    newSwatch.classList.add('swatch');
    newSwatch.style.backgroundColor = `hsl(${i / 12 * 360}, ${(i / 12 * 20) + 50}%, ${(i / 12 * 20) + 40}%)`
    newSwatch.addEventListener('click', () => {
        //clicking a color will change sliders and big swatch
        document.getElementById('hue-slider').value = i / 12 * 360;
        document.getElementById('saturation-slider').value = (i / 12 * 20) + 50;
        document.getElementById('brightness-slider').value = (i / 12 * 20) + 40;
        document.getElementById('current-swatch').style.backgroundColor = `hsl(${hueSlider.value}, ${saturationSlider.value}%, ${brightnessSlider.value}%)`;
    })
    document.getElementById('swatches').appendChild(newSwatch);
}


document.getElementById('swatches').appendChild(currentSwatch);