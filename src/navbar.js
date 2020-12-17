const { remote } = require('electron');

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