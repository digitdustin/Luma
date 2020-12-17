//import discover from './scripts/discover.js';
const lottie = require('lottie-web')
const { remote, app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');

  

//---------------------PAGE CHANGE--------------------------//
//For ease and consistent background staging, the initial light discovery is a part of the start screen (embedded) 
//as opposed to loaded in a different html file.

const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', transitionToPage);

//FADER
function transitionToPage() {
    document.getElementById('container').style.opacity = 0;
    document.getElementById('container2').style.opacity = 0;
    setTimeout(() => { 
        //load new elements to discover lights
        document.getElementById('container').innerHTML = '';
        document.getElementById('container2').innerHTML = '';
        //spawns new discover page
        buildDiscoverPage();
        //var w = remote.getCurrentWindow();
        //w.loadFile(path.join(__dirname, 'index.html'));
        /* var w = remote.getCurrentWindow();
        w.setSize(800, 500, true);
        w.center(); */
    }, 1000)
}

function buildDiscoverPage() {
    //Build DOM
    document.getElementById('container').style.opacity = 1;
    document.getElementById('container2').style.opacity = 1;
    var div = document.createElement("div");
    var loader = document.createElement("div");

    div.id = "discover-message";
    loader.id = "loader";


    var anim;
    var animData = ({
        container: document.getElementById('container2'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '../bulb2.json',
        
      });

      anim = lottie.loadAnimation(animData);

    div.innerHTML = '<p style="margin-right: -10px;">Searching for lights on your network<p><lottie-player src="https://assets3.lottiefiles.com/packages/lf20_SPdvRD.json"  background="transparent"  speed="1"  style="width: 50px; height: 50px;"  loop  autoplay></lottie-player>';
    loader.innerHTML = '<lottie-player src="https://assets9.lottiefiles.com/temp/lf20_eZyh21.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"    ></lottie-player>'
    
    document.getElementById('container').appendChild(div);
    document.getElementById('container2').appendChild(loader);
    setTimeout(function() { 
        document.getElementById('container').style.opacity = 1;
    }, 400)
    
    //DISCOVER ALL BULBS AND DISPLAY
    const Lifx  = require('node-lifx-lan');

    Lifx.discover().then((device_list) => {
        console.log('reached 1')
        if (device_list.length != 0) {
            console.log('reached 2')
            loader.innerHTML = '<lottie-player src="https://assets9.lottiefiles.com/temp/lf20_eZyh21.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;" autoplay ></lottie-player>'
            anim.play();
            
            document.getElementById('container').style.opacity = 0;

            setTimeout(function() { 
                //display all lights to screen and continue button
                document.getElementById('discover-message').innerHTML = `<p style="margin-right: -10px;">${device_list.length} lights found!<p>`
                //create light element for each light

                device_list.forEach((device) => {
                    device.getLightState().then((res) => {
                    console.log(res);

                    var lightContainer = document.createElement("div");
                    lightContainer.classList.add('light-container');
        
                    var lightColor = document.createElement("div")
                    lightColor.classList.add('light-color');
                    var hue = res['color']['hue'];
                    var saturation = res['color']['saturation'];
                    var brightness = res['color']['brightness'];
                    var kelvin = res['color']['kelvin'];
                    var power = res['power'];
                    if (power == 1) {
                        if (saturation == 0) {
                            //the color is a white, judge based on kelvin
                            hue = (Math.round((1 - (9000- kelvin) / 7500)) * 170) + 30;
                            saturation = 100;
                            brightness = 80;
                        } else {
                            //if the color is not white
                            hue = Math.round((hue * 360));
                            brightness = 80 - Math.round((saturation * 30))
                            saturation = 100;
                        }
                    } else {
                        //light is off
                        brightness = 15;
                        saturation = 0;
                        hue = 0;
                    }
                    
                    //if hue and saturation == 0, the color is a white (judged by kelvin)
                    lightColor.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
                    //lightColor.style.backgroundColor = `hsl(100, 100%, 50%)`;
                    lightContainer.appendChild(lightColor);
                            
                    var lightName = document.createElement("div")
                    lightName.classList.add('light-name');
                    lightName.innerText = device['deviceInfo']['label'];
                    lightContainer.appendChild(lightName);
        
                    document.getElementById('container').appendChild(lightContainer);
                });
                
            })

            
        }, 800)
            setTimeout(function() { 
                //continue button
                var continueBtn = document.createElement("button");
                continueBtn.id = "continue-btn";
                continueBtn.className = "uk-button uk-button-default";
                continueBtn.innerText = "Continue";
                continueBtn.style.backgroundColor = "#11171a";
                console.log('color changed');
                continueBtn.style.marginTop = "10px";
                continueBtn.style.color = "white"
                continueBtn.style.zIndex = "99";

                continueBtn.addEventListener('click', () => {
                    console.log('next page');
                })

                document.getElementById('container').appendChild(continueBtn);
                
                document.getElementById('container').style.opacity = 1;
            }, 1500)
        } else {
            //if no lights are found:
            console.log("no lights found")
        }
    }).catch((error) => {
        console.error(error);
    });
    //------------------------    

    
}

