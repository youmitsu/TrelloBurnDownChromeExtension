import Vue from '../node_modules/vue/dist/vue.js';
import Vuex from '../node_modules/vuex/dist/vuex.js';
import * as ApiClient from './lib/apiClient.js';
import * as DataStore from './lib/dataStore.js';
import {
  encrypt
} from './lib/cryptUtil.js';
import {
  setConfigData
} from './lib/chartUtil.js';
import graphMenu from './components/graphMenu.vue';
import graphContent from './components/graph.vue';
Vue.use(Vuex);

var store = new Vuex.Store({
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
    initialLoad(context) {
      return new Promise((resolve, reject) => {
        store.commit('START_LOADING');
        ApiClient.getUser(store.state.trelloAuth.token, store.state.trelloAuth.devKey)
          .then(user => ApiClient.getBoards(user.username, store.state.trelloAuth.token, store.state.trelloAuth.devKey))
          .then(boards => {
            boards.forEach(v => {
              store.commit('ADD_BOARD', {
                boardId: v.id,
                boardName: v.name,
                isActive: v.id === store.state.selectedBoard.boardId
              });
            });
            //すでにボードが選択済みの場合、ボードのデフォルト値を設定する
            if (store.getters.isInputedBoard) {
              //TODO: jquery排除
              $('.text.default').removeClass('default').text(store.state.selectedBoard.boardName);
              return;
            }
            //
            // if (!this.graph.startDate || !this.graph.endDate) {
            //   //TODO: 入力してね文言の表示
            //   return;
            // }
          })
          .then(() => ApiClient.getChartData(encrypt(store.state.trelloAuth.token), encrypt(store.state.trelloAuth.devKey),
            store.state.selectedBoard.boardId, store.state.graph.startDate,
            store.state.graph.endDate, store.state.graph.holidays))
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
            store.commit('SET_GRAPH_DATA', obj);
            store.commit('END_LOADING', {
              status: "SUCCESS"
            });
            resolve();
          })
          .catch(err => {
            store.commit('END_LOADING', {
              status: "ERROR"
            });
          });
      });
    }
  },
  mutations: {
    SET_SELECT_BOARD(state, boardItem) {
      state.selectedBoard = boardItem;
      DataStore.set('boardId', store.selectedBoard.boardId);
      DataStore.set('boardName', store.selectedBoard.boardName);
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
  components: {
    "graph-menu": graphMenu,
    "graph-content": graphContent
  }
})
