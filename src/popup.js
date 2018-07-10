// var port = chrome.extension.connect({
//   name: "background"
// });
// port.postMessage("test");
// port.onMessage.addListener(function(response) {
//   console.log("Received from event page:  " + response);
//   console.log(response.status);
//   console.log(response.data);
//   var data = JSON.parse(response.data);
//   if (response.status === 'OK') {
//     buildChart(data);
//   }
// });
$(function() {
  var token = localStorage.token;
  var defaultStartDate = localStorage.startDate;
  var defaultEndDate = localStorage.endDate;
  var defaultHolidays = localStorage.holidays;
  if (!token || !defaultStartDate || !defaultEndDate) {
    $('#desc').show();
  } else {
    $('#desc').hide();
    $('#token').val(token);
    $('#start').val(defaultStartDate);
    $('#end').val(defaultEndDate);
    $('#holidays').val(defaultHolidays);
    $('.spinnerContainer').show();
    getChartData(getParams())
      .then(result => {
        var data = result;
        buildChart(data);
      })
      .catch(err => {});
  }
});

$('#showBtn').on('click', function() {
  console.log("clicked");
  localStorage.token=$('#token').val();
  localStorage.startDate = $('#start').val();
  console.log(localStorage.startDate);
  localStorage.endDate = $('#end').val();
  localStorage.holidays = $('#holidays').val();
  $('.spinnerContainer').show();
  $('.chartContainer').hide();
  $('.inputArea').hide();
  $('#desc').hide();
  getChartData(getParams())
    .then(result => {
      var data = result;
      buildChart(data);
    })
    .catch(err => {});
});

function getParams() {
  const key = "dGHLVUj3N3";
  let token = $('#token').val();
  let encryptedToken = CryptoJS.AES.encrypt(token, key).toString();
  let start = $('#start').val();
  let end = $('#end').val();
  let holidays = $('#holidays').val();
  return {
    "token": encryptedToken,
    "startDate": start,
    "endDate": end,
    "holidays": holidays
  };
}

function getChartData(params) {
  return new Promise((resolve, reject) => {
    $.get("https://us-central1-trelloburndownproject.cloudfunctions.net/getSprintPoint", params, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      var result = {
        status: "OK",
        "data": data
      };
      console.log("apiRequest");
      var data = JSON.parse(result.data);
      resolve(data);
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
  $('.spinnerContainer').hide();
  $('.chartContainer').show();
  $('.inputArea').show();
  var myChart = new Chart(ctx, obj);
}

//データのラベルや色などの設定を行う
function setConfigData(json, index, label, backgroundColor, borderColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].borderColor = borderColor;
}
