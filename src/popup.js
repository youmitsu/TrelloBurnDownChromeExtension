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
const KEY = "dGHLVUj3N3";
$(function() {
  $('.ui.dropdown').dropdown();
  var token = localStorage.token;
  var devKey = localStorage.devKey;
  if (!token || !devKey) {
    $('#boardSelectArea').hide();
    $('#graphArea').hide();
    $('#graphSettingArea').hide();
    return;
  }
  $('#token').val(token);
  $('#devKey').val(devKey);

  var boardId = localStorage.boardId;
  var boardName = localStorage.boardName;
  var defaultStartDate = localStorage.startDate;
  var defaultEndDate = localStorage.endDate;
  var defaultHolidays = localStorage.holidays;

  getUser({
    "token": token,
    "key": devKey,
    "fields": "username"
  }).then(user => {
    getBoards(user.username, {
      "token": token,
      "key": devKey,
      "filter": "open",
      "fields": "name",
      "lists": "none",
      "memberships": "none"
    }).then(boards => {
      boards.forEach(v => {
        appendBoardItem(v);
      });
      if (boardId && boardName) {
        $(`div[value=${boardId}]`).addClass('active selected');
        $('.text.default').removeClass('default').text(boardName);
        return boardId;
      }
    }).then(boardId => {
      if (!defaultStartDate || !defaultEndDate) {
        $('#desc').show();
        return;
      }
      $('#desc').hide();
      $('#start').val(defaultStartDate);
      $('#end').val(defaultEndDate);
      $('#holidays').val(defaultHolidays);
      $('.spinnerContainer').show();
      let encryptedToken = CryptoJS.AES.encrypt(token, KEY).toString();
      let encryptedKey = CryptoJS.AES.encrypt(devKey, KEY).toString();
      getChartData({
          "token": encryptedToken,
          "key": encryptedKey,
          "boardId": boardId,
          "startDate": defaultStartDate,
          "endDate": defaultEndDate,
          "holidays": defaultHolidays
        }).then(result => {
          var data = result;
          buildChart(data);
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  });
});

$('#showBtn').on('click', function() {
  localStorage.token = $('#token').val();
  localStorage.devKey = $('#devKey').val();
  localStorage.boardId = $('.menu > .item.active.selected').attr('value');
  localStorage.boardName = $('.menu > .item.active.selected').attr('data-value');
  console.log(localStorage.boardId);
  console.log(localStorage.boardName);
  localStorage.startDate = $('#start').val();
  localStorage.endDate = $('#end').val();
  localStorage.holidays = $('#holidays').val();
  location.reload();
  $('#app').hide();
  // $('.spinnerContainer').show();
  // $('.chartContainer').hide();
  // $('.inputArea').hide();
  // $('#desc').hide();
  // $('#boardSelectArea').hide();
  // getChartData(getChartParams())
  //   .then(result => {
  //     var data = result;
  //     buildChart(data);
  //   })
  //   .catch(err => {});
});

$('#registerBtn').on('click', function() {
  localStorage.token = $('#token').val();
  localStorage.devKey = $('#devKey').val();
  location.reload();
});

function appendBoardItem(board) {
  $(`<div>${board.name}</div>`).attr({
    class: "item",
    value: board.id,
    "data-value": board.name
  }).appendTo('.menu');
}

function getUser(params) {
  console.log(params);
  return new Promise((resolve, reject) => {
    $.get(`https://api.trello.com/1/tokens/${params.token}/member`, params, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      resolve(data);
    });
  });
}

function getBoards(username, params) {
  return new Promise((resolve, reject) => {
    $.get(`https://api.trello.com/1/members/${username}/boards`, params, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      console.log("apiRequest");
      resolve(data);
    });
  });
}

function getChartData(params) {
  return new Promise((resolve, reject) => {
    console.log(params);
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
  $('#boardSelectArea').show();
  var myChart = new Chart(ctx, obj);
}

//データのラベルや色などの設定を行う
function setConfigData(json, index, label, backgroundColor, borderColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].borderColor = borderColor;
}
