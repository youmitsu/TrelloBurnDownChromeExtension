var port = chrome.extension.connect({
  name: "background"
});
port.postMessage("test");
port.onMessage.addListener(function(response) {
  console.log("Received from event page:  " + response);
  console.log(response.status);
  console.log(response.data);
  var data = JSON.parse(response.data);
  if (response.status === 'OK') {
    buildChart(data);
  }
});

$('#showBtn').on('click', function() {
  console.log("clicked");
  getChartData()
    .then(result => {
      var data = JSON.parse(result.data);
      buildChart(data);
    })
    .catch(err => {
      console.log(err);
    });
});

function getChartData() {
  return new Promise((resolve, reject) => {
    $.get("https://us-central1-trelloburndownproject.cloudfunctions.net/getSprintPoint", {}, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      var result = {
        status: "OK",
        "data": data
      };
      var data;
      try {
        data = JSON.parse(result.data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function buildChart(json) {
  setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148)'); //理想線
  setConfigData(json, 1, "実績線", 'rgb(251, 224, 0, 0.4)', 'rgb(251, 224, 0)'); //実績線
  var obj = {
    type: 'line',
    options: {
      elements: {
        line: {
          tension: 0
        }
      }
    }
  }
  obj.data = json;
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, obj);
}

//データのラベルや色などの設定を行う
function setConfigData(json, index, label, backgroundColor, borderColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].borderColor = borderColor;
}
