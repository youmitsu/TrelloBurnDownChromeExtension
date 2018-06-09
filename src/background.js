chrome.extension.onConnect.addListener(function(port) {
  console.log("fuga");
  port.onMessage.addListener(function(request) {
    console.log('Received from popup: ' + request);
    port.postMessage("Hi Popup.js");
  });
});
