const { remote, ipcRenderer } = require('electron');

//elements
const holder = document.getElementById('holder');

var selections = [];

//functions 
const boxSelect = (event) => {
    
    //to see if user is holding down mouse
    var pressing = true;
    
    //store original mouse coords for movement
    const originalPosition = {
        X: event.clientX,
        Y: event.clientY
    }
    var selectDiv = document.createElement('div');
    selectDiv.classList.add('selection')

    selectDiv.style.position = 'absolute';
    selectDiv.style.background = 'rgba(59, 59, 59, 0.171)';
    selectDiv.style.zIndex = 2;
    selectDiv.style.border = '1px solid white';

    document.getElementById('holder').appendChild(selectDiv);

    holder.addEventListener('mousemove', (e) => {
        if (pressing) {
            //mousemove listener to visually change selection
            if (e.clientX <= originalPosition.X) {
                //if moving left from start pt
                selectDiv.style.left = e.clientX + "px";
                selectDiv.style.right = originalPosition.X + "px";
                selectDiv.style.width = originalPosition.X - e.clientX + "px";
            } else if (e.clientX > originalPosition.X) {
                //if moving right from start pt
                selectDiv.style.left = originalPosition.X + "px";
                selectDiv.style.right = e.clientX + "px";
                selectDiv.style.width = e.clientX - originalPosition.X + "px";
            }
            if (e.clientY < originalPosition.Y) {
                //if moving up from start pt
                selectDiv.style.top = e.clientY + "px";
                selectDiv.style.bottom = originalPosition.Y + "px";
                selectDiv.style.height = originalPosition.Y - e.clientY + "px";
            } else if (e.clientY >= originalPosition.Y) {
                //if moving down from start pt
                selectDiv.style.top = originalPosition.Y + "px";
                selectDiv.style.bottom = e.clientY + "px";
                selectDiv.style.height = e.clientY - originalPosition.Y + "px";
            }
        }
        
    })

    holder.addEventListener('mouseup', (e) => {
        pressing = false;
        var selectionBounds = selectDiv.getBoundingClientRect();
        console.log(selectionBounds);
        selections.push(selectionBounds);

        //send dimensions of screen selection
        ipcRenderer.sendTo(
            remote.getGlobal("mainWindow").webContents.id,
            "add-selection-area",
            {
                x: selectionBounds.x, 
                y: selectionBounds.y, 
                bottom: selectionBounds.bottom, 
                top: selectionBounds.top,
                left: selectionBounds.left, 
                right:selectionBounds.right, 
                height: selectionBounds.height, 
                width: selectionBounds.width
            }
          );

        //close window after selection
        let w = remote.getCurrentWindow();
        w.close();
    })


}

//event listeners
holder.addEventListener('mousedown', boxSelect, false);



