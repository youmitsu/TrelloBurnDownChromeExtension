chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(request) {
    console.log('Received from popup: ' + request);
    $.get("https://us-central1-trelloburndownproject.cloudfunctions.net/getSprintPoint", getParams(),  function(data) {
      var result = {
        status: "OK",
        "data": data
      };
      port.postMessage(result);
    });
  });
});

function getParams() {
  return {
    "startDate": "2018/06/06",
    "endDate": "2018/06/18"
  };
}
