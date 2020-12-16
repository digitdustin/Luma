const { remote } = require('electron');
const path = require('path');
const { brotliDecompressSync } = require('zlib');

//luma logo animation

const target = window.document.getElementById('logo')

const flickerLetter = letter => `<span style="animation: text-flicker-in-glow ${Math.random()*3}s linear both ">${letter}</span>`
const colorLetter = letter => `<span style="color: hsla(${(Math.random()*100) + 200}, 100%, 100%, 1);">${letter}</span>`;
const flickerAndColorText = text => 
  text
    .split('')
    .map(flickerLetter)
    .map(colorLetter)
    .join('');
const neonGlory = target => target.innerHTML = flickerAndColorText(target.textContent);


neonGlory(target);
target.onclick = ({ target }) =>  neonGlory(target);

//--------------------

//navbar functionality

const closeBtn = document.getElementById('close');
const minimizeBtn = document.getElementById('minimize');

closeBtn.addEventListener('click', () => {
    var w = remote.getCurrentWindow();
    w.close();
});

minimizeBtn.addEventListener('click', () => {
    var w = remote.getCurrentWindow();
    w.minimize(); 
})

//---------------------
//For ease and consistent background staging, the initial light discovery is a part of the start screen (embedded) 
//as opposed to loaded in a different html file.

const startBtn = document.getElementById('start-btn');
/*
startBtn.addEventListener('click', () => {
    var w = remote.getCurrentWindow();
    w.loadFile(path.join(__dirname, 'index.html'));
})*/

startBtn.addEventListener('click', transitionToPage);

//FADER
function transitionToPage() {
    document.getElementById('container').style.opacity = 0;
    setTimeout(function() { 
        //load new elements to discover lights
        document.getElementById('container').remove();
        //spawns new discover page
        createDiscoverPage();
        //var w = remote.getCurrentWindow();
        //w.loadFile(path.join(__dirname, 'index.html'));
    }, 1000)
}

function createDiscoverPage() {
    var div = document.createElement("div");
    div.id = "light-container";
    div.innerHTML = 'hello!'
    document.getElementById('body').appendChild(div);
    setTimeout(function() { 
    document.getElementById('light-container').style.opacity = 1;
    }, 200)
}