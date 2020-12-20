
// 1. Create the connection Objekt
var connection = new RTCMultiConnection();

connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

// 2. Activate screen, which is the whole monitor, not only the browser window!
connection.session = {
    screen: true,
    data: false,
    oneway: true
};

// 3. Create the callback for the stream
connection.onstream = function(event) {
    console.log('capture')
  // Make something with the event
  // event.stream contains the stream, event.mediaElement the media
  // I used event.mediaElement as parameter to draw the frage into an canvas; via context2d.drawImage(event.mediaElement, ...)
  // Then I create an base64 String via canvas.toDataURL("image/png") and 
  // Don't forget to stop the stream if you just want to have one single image
};

// 4. Start Desktop Sharing
connection.open({
  // you could register a onMediaCaptured callback here
});