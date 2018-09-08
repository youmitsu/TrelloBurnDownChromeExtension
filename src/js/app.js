//Vue系
import Vue from 'vue';
import Vuex from 'vuex';

//外部ライブラリ
import Chart from 'chartjs';
import * as ApiClient from './lib/apiClient.js';
import * as DataStore from './lib/dataStore.js';
import { encrypt } from './lib/cryptUtil.js';
import { setConfigData } from './lib/chartUtil.js';
import graphMenu from './components/graphMenu.vue';
import graphContent from './components/graph.vue';
import settingMenu from './components/settingMenu.vue';
import settingBackend from './components/settingBackend.vue';
import settingTrello from './components/settingTrello.vue';
Vue.use(Vuex);

const settingStore = {
  namespaced: true,
  state: {
    serverAuth: {
      baseUrl: DataStore.get('baseUrl'),
      loading: false,
      status: ""
    },
    trelloAuth: {
      devKey: null,
      token: null,
      loading: false,
      status: ""
    }
  },
  getters: {
    isLoadingError: state => {
      return !state.serverAuth.loading && state.serverAuth.status === 'FAILED';
    },
    isLoadingSuccess: state => {
      return !state.serverAuth.loading && state.serverAuth.status === 'SUCCESS';
    }
  },
  mutations: {
    SET_BASEURL(state, baseUrl) {
      state.serverAuth.baseUrl = baseUrl;
      DataStore.set('baseUrl', state.serverAuth.baseUrl);
    },
    START_SERVER_LOADING(state) {
      state.serverAuth.loading = true;
      state.serverAuth.status = "";
    },
    END_SERVER_LOADING(state, result) {
      state.serverAuth.loading = false;
      state.serverAuth.status = result.status;
    }
  },
  actions: {
    validateBaseUrl({ commit, dispatch }, value) {
      commit('SET_BASEURL', value);
      dispatch('checkServer', value);
    },
    checkServer({ commit }, baseUrl) {
      commit('START_SERVER_LOADING');
      ApiClient.checkServerUrl(baseUrl)
        .then(data => {
          commit('END_SERVER_LOADING', {
            status: "SUCCESS"
          });
        })
        .catch(err => {
          commit('END_SERVER_LOADING', {
            status: "FAILED"
          });
        });
    }
  },
  modules: {
    server: {

    },
    trello: {

    }
  }
};

const store = new Vuex.Store({
  state: {
    loadState: {
      loading: false,
      status: "", // status: "" or "SUCCESS" or "FAILED"
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
  getters: {
    boardDefaultText: state => {
      return state.selectedBoard.boardName || "ボードを選択";
    },
    boardList: state => {
      return state.boardItems.length <= 0 ? ["ボードがありません"] : state.boardItems;
    },
    isInputedBoard: state => {
      return state.selectedBoard.boardId && state.selectedBoard.boardName;
    },
    isTrelloAuthenticated: state => {
      return state.trelloAuth.token && state.trelloAuth.devKey;
    },
    isLoadingError: state => {
      return !state.loadState.loading && state.loadState.status === 'FAILED';
    }
  },
  actions: {
    setSelectBoard({ commit }, boardItem) {
      commit('SET_SELECT_BOARD', boardItem);
    },
    setBoardItems({ commit }, boardItems) {
      commit('SET_BOARD_ITEMS', boardItems);
    },
    reload(context) {
      location.reload();
    },
    initialLoad({commit, state, getters}) {
      return new Promise((resolve, reject) => {
        commit('START_LOADING');
        ApiClient.getUser(state.trelloAuth.token, state.trelloAuth.devKey)
          .then(user => ApiClient.getBoards(user.username, state.trelloAuth.token, state.trelloAuth.devKey))
          .then(boards => {
            boards.forEach(v => {
              commit('ADD_BOARD', {
                boardId: v.id,
                boardName: v.name,
                isActive: v.id === state.selectedBoard.boardId
              });
            });
            if (getters.isInputedBoard) {
              return;
            }
            //
            // if (!this.graph.startDate || !this.graph.endDate) {
            //   //TODO: 入力してね文言の表示
            //   return;
            // }
          })
          .then(() => ApiClient.getChartData(encrypt(state.trelloAuth.token), encrypt(state.trelloAuth.devKey),
            state.selectedBoard.boardId, state.graph.startDate,
            state.graph.endDate, state.graph.holidays))
          .then(json => {
            setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148, 0.9)', 'rgb(40, 82, 148, 0.5)'); //理想線
            setConfigData(json, 1, "残り作業時間", 'rgb(251, 224, 0, 0.1)', 'rgb(251, 224, 0, 0.9)', 'rgb(251, 224, 0, 0.5)'); //実績線
            setConfigData(json, 2, "実績作業時間", 'rgb(229, 57, 53, 0.1)', 'rgb(229, 57, 53, 0.9)', 'rgb(229, 57, 53, 0.5)'); //実績線
            let obj = {
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
            commit('SET_GRAPH_DATA', obj);
            commit('END_LOADING', {
              status: "SUCCESS"
            });
            resolve();
          })
          .catch(err => {
            commit('END_LOADING', {
              status: "FAILED"
            });
          });
      });
    }
  },
  mutations: {
    SET_SELECT_BOARD(state, boardItem) {
      state.selectedBoard = boardItem;
      DataStore.set('boardId', state.selectedBoard.boardId);
      DataStore.set('boardName', state.selectedBoard.boardName);
    },
    SET_START_DATE(state, startDate) {
      state.graph.startDate = startDate;
      DataStore.set('startDate', state.graph.startDate);
    },
    SET_END_DATE(state, endDate) {
      state.graph.endDate = endDate;
      DataStore.set('endDate', state.graph.endDate);
    },
    SET_HOLIDAYS(state, holidays) {
      state.graph.holidays = holidays;
      DataStore.set('holidays', state.graph.holidays);
    },
    START_LOADING(state) {
      state.loadState.loading = true;
      state.loadState.status = "";
    },
    END_LOADING(state, result) {
      state.loadState.loading = false;
      state.loadState.status = result.status;
    },
    ADD_BOARD(state, board) {
      state.boardItems.push(board);
    },
    SET_GRAPH_DATA(state, data) {
      state.graph.data = data;
    }
  },
  modules: {
    setting: settingStore
  }
});

new Vue({
  el: '#app',
  store,
  created: function() {
    store.dispatch('initialLoad')
      .then(() => {
        //TODO: できれば子Componentに持っていく
        this.$nextTick(() => {
          const ctx = this.$el.querySelector('#myChart').getContext('2d');
          ctx.canvas.height = 500;
          var myChart = new Chart(ctx, store.state.graph.data);
        });
      });
  },
  mounted: function() {
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
        store.commit('SET_START_DATE', text);
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
        store.commit('SET_END_DATE', text);
      }
    });
  },
  components: {
    "graph-menu": graphMenu,
    "graph-content": graphContent,
    "setting-menu": settingMenu,
    "setting-backend": settingBackend,
    "setting-trello": settingTrello
  }
})
