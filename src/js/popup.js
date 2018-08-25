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
'use strict';
import * as apiClient from './apiClient.js';
import {encrypt} from './cryptUtil.js';

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
  created: function() {},
  mounted() {
    $('.ui.accordion').accordion();
    $('.ui.dropdown').dropdown();
    $('.menu .browse').popup({
      hoverable: true,
      position: 'bottom center',
      on: 'click'
    });
    $('#startDate.ui.calendar').calendar({
      type: 'date',
      formatter: {
        date: function(date) {
          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return year + '/' + month + '/' + day;
        }
      },
      onChange: function(date, text, mode) {
        vm.graph.startDate = text;
      }
    });
    $('#endDate.ui.calendar').calendar({
      type: 'date',
      formatter: {
        date: function(date) {
          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return year + '/' + month + '/' + day;
        }
      },
      onChange: function(date, text, mode) {
        vm.graph.endDate = text;
      }
    });
    this.initialLoad();
  },
  updated: function() {
    localStorage.setItem('boardId', this.selectedBoard.boardId);
    localStorage.setItem('boardName', this.selectedBoard.boardName);
    localStorage.setItem('startDate', this.graph.startDate);
    localStorage.setItem('endDate', this.graph.endDate);
    localStorage.setItem('holidays', this.graph.holidays);
  },
  computed: {
    isCalendarInputed: function() {
      return this.graph.startDate && this.graph.endDate;
    },
    trelloAuthenticated: function() {
      return localStorage.getItem('token') &&
        localStorage.getItem('devKey');
    },
    isValidServerConfig: function() {
      return localStorage.getItem('baseUrl');
    },
    boardDefaultText: function() {
      return this.selectedBoard.boardName || "ボードを選択";
    }
  },
  methods: {
    initialLoad: function() {
      this.loading = true;
      apiClient.getUser(this.trelloAuth.token, this.trelloAuth.devKey)
        .then(user => apiClient.getBoards(user.username, this.trelloAuth.token, this.trelloAuth.devKey))
        .then(boards => {
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
          if (!this.graph.startDate || !this.graph.endDate) {
            //TODO: 入力してね文言の表示
            return;
          }
        })
        .then(() => apiClient.getChartData(encrypt(this.trelloAuth.token), encrypt(this.trelloAuth.devKey),
          this.selectedBoard.boardId, this.graph.startDate,
          this.graph.endDate, this.graph.holidays))
        .then(json => {
          vm.loading = false;
          setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148, 0.9)', 'rgb(40, 82, 148, 0.5)'); //理想線
          setConfigData(json, 1, "残り作業時間", 'rgb(251, 224, 0, 0.1)', 'rgb(251, 224, 0, 0.9)', 'rgb(251, 224, 0, 0.5)'); //実績線
          setConfigData(json, 2, "実績作業時間", 'rgb(229, 57, 53, 0.1)', 'rgb(229, 57, 53, 0.9)', 'rgb(229, 57, 53, 0.5)'); //実績線
          var obj = {
            type: 'line',
            options: {
              elements: {
                line: {
                  tension: 0
                }
              },
              responsive: true,
              maintainAspectRatio: false,
            }
          }
          obj.data = json;
          vm.graph.data = obj;
          vm.$nextTick(() => {
            const ctx = this.$el.querySelector('#myChart').getContext('2d');
            ctx.canvas.height = 500;
            var myChart = new Chart(ctx, vm.graph.data);
          });
        })
        .catch(err => {
          //TODO: エラーハンドリング
          vm.error.status = true;
          vm.error.discription = err;
          vm.loading = false;
        });
    },
    reload: function() {
      localStorage.setItem('boardId', $('#dropmenu.menu > .item.active.selected').attr('value'));
      localStorage.setItem('boardName', $('#dropmenu.menu > .item.active.selected').attr('data-value'));
      localStorage.setItem('startDate', $('#start').val());
      localStorage.setItem('endDate', $('#end').val());
      localStorage.setItem('holidays', $('#holidays').val());
      location.reload();
    },
    registerBoard: function(boardItem) {
      localStorage.setItem('boardId', boardItem.boardId);
      localStorage.setItem('boardName', boardItem.boardName);
    }
  }
});

//データのラベルや色などの設定を行う
function setConfigData(json, index, label, backgroundColor, borderColor, pointColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].pointBackgroundColor = pointColor;
  json.datasets[index].fill = true;
  json.datasets[index].borderColor = borderColor;
}