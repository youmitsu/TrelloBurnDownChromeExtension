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
var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    error: {
      status: false,
      discription: null
    },
    trelloAuth: {
      token: localStorage.getItem('token'),
      devKey: localStorage.getItem('devKey')
    },
    selectedBoard: {
      boardId: localStorage.getItem('boardId'),
      boardName: localStorage.getItem('boardName')
    },
    boardItems: [],
    graph: {
      startDate: localStorage.getItem('startDate'),
      endDate: localStorage.getItem('endDate'),
      holidays: localStorage.getItem('holidays'),
      data: null
    }
  },
  created: function() {
  },
  mounted() {
    $('.ui.accordion').accordion();
    $('.ui.dropdown').dropdown();
    this.loading = true;
    this.initialLoad();
  },
  computed: {
    isCalendarInputed: function() {
      return !this.loading && (!this.graph.startDate || !this.graph.endDate);
    },
    trelloAuthenticated: function() {
      return localStorage.getItem('token') && localStorage.getItem('devKey')
    },
    boardDefaultText: function() {
      return this.selectedBoard.boardName || "ボードを選択";
    }
  },
  methods: {
    initialLoad: function() {
      getUser({
        "token": this.trelloAuth.token,
        "key": this.trelloAuth.devKey,
        "fields": "username"
      }).then(user => {
        getBoards(user.username, {
          "token": this.trelloAuth.token,
          "key": this.trelloAuth.devKey,
          "filter": "open",
          "fields": "name",
          "lists": "none",
          "memberships": "none"
        }).then(boards => {
          boards.forEach(v => {
            this.boardItems.push({
              boardId: v.id,
              boardName: v.name,
              isActive: v.id === this.selectedBoard.boardId
            });
          });
          if (this.selectedBoard.boardId && this.selectedBoard.boardName) {
            $('.text.default').removeClass('default').text(this.selectedBoard.boardName);
            return;
          }
        }).then(() => {
          if (!this.graph.startDate || !this.graph.endDate) {
            //TODO: 入力してね文言の表示
            return;
          }
          this.loading = true;
          //TODO: 暗号化いらない
          let encryptedToken = CryptoJS.AES.encrypt(this.trelloAuth.token, KEY).toString();
          let encryptedKey = CryptoJS.AES.encrypt(this.trelloAuth.devKey, KEY).toString();
          getChartData({
              "token": encryptedToken,
              "key": encryptedKey,
              "boardId": this.selectedBoard.boardId,
              "startDate": this.graph.startDate,
              "endDate": this.graph.endDate,
              "holidays": this.graph.holidays
            }).then(json => {
              vm.loading = false;
              setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148)'); //理想線
              setConfigData(json, 1, "残り作業時間", 'rgb(251, 224, 0, 0.1)', 'rgb(251, 224, 0)'); //実績線
              setConfigData(json, 2, "実績作業時間", 'rgb(229, 57, 53, 0.1)', 'rgb(229, 57, 53)'); //実績線
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
              vm.graph.data = obj;
              vm.$nextTick(() => {
                const ctx = this.$el.querySelector('#myChart').getContext('2d')
                var myChart = new Chart(ctx, vm.graph.data);
              });
            })
            .catch(err => {
              //TODO: エラーハンドリング
              vm.error.status = true;
              vm.error.discription = err;
              vm.loading = false;
            });
        });
      });
    },
    reload: function() {
      localStorage.setItem('boardId', $('#dropmenu.menu > .item.active.selected').attr('value'));
      localStorage.setItem('boardName', $('#dropmenu.menu > .item.active.selected').attr('data-value'));
      localStorage.setItem('startDate', $('#start').val());
      localStorage.setItem('endDate', $('#end').val());
      localStorage.setItem('holidays', $('#holidays').val());
      location.reload();
    }
  }
});

function getUser(params) {
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
      resolve(data);
    });
  });
}

function getChartData(params) {
  return new Promise((resolve, reject) => {
    $.get(localStorage.getItem('baseUrl'), params, function(data) {
      //TODO: APIリクエストがエラーだった場合のエラーハンドリング
      var result = {
        status: "OK",
        "data": data
      };
      var data = JSON.parse(result.data);
      resolve(data);
    });
  });
}

//データのラベルや色などの設定を行う
function setConfigData(json, index, label, backgroundColor, borderColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].borderColor = borderColor;
}
