chrome.extension.onConnect.addListener(function(port) {
  console.log("fuga");
  port.onMessage.addListener(function(request) {
    console.log('Received from popup: ' + request);
    $.get("https://us-central1-trelloburndownproject.cloudfunctions.net/getSprintPoint", {}, function(data) {
      var result = {
        status: "OK",
        "data": data
      };
      port.postMessage(result);
    });
    //port.postMessage("Hi Popup.js");
  });
});
