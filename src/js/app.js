//Vue系
import Vue from 'vue';
import Vuex from 'vuex';

//外部ライブラリ
import Chart from 'chartjs';

//common
import { SUCCESS, FAILED, DEFAULT } from './common/loadStatusType.js';

import * as ApiClient from './lib/apiClient.js';
import * as DataStore from './lib/dataStore.js';
import * as Tab from './lib/tabUtil.js';
import { initialWebhookState } from './lib/templateUtil.js';
import { encrypt } from './lib/cryptUtil.js';
import { setConfigData, graphParam } from './lib/chartUtil.js';

//Stores
import settingStore from './stores/settingStore.js';

//Components
import graphMenu from './components/graphMenu.vue';
import graphContent from './components/graph.vue';
import settingMenu from './components/settingMenu.vue';
import settingBackend from './components/settingBackend.vue';
import settingTrello from './components/settingTrello.vue';
import settingWebhooks from './components/settingWebhooks.vue';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    graphLoadState: {
      loading: false,
      status: DEFAULT
    },
    trelloAuth: {
      token: localStorage.getItem('token'),
      devKey: localStorage.getItem('devKey')
    },
    selectedBoard: {
      boardId: localStorage.getItem('boardId'),
      boardName: localStorage.getItem('boardName')
    },
    boardLoadState: {
      loading: false,
      status: DEFAULT
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
    isInputedDays: state => {
      return state.graph.stateDate && state.graph.endDate;
    },
    isTrelloAuthenticated: state => {
      return state.trelloAuth.token && state.trelloAuth.devKey;
    },
    isBoardLoadingError: state => {
      return !state.boardLoadState.loading && state.boardLoadState.status === FAILED;
    },
    isGraphLoadingError: state => {
      return !state.graphLoadState.loading && state.graphLoadState.status === FAILED;
    },
    isAbleChartLoad: (state, getters) => {
      return getters.isInputedBoard && getters.isInputedDays
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
    initialLoad({commit, state, getters, dispatch}) {
      //TODO: localStorage内のデータでaction切り分ける
      return new Promise((resolve, reject) => {
        if(!getters.trelloAuthenticated) {
          //TODO: 設定画面に遷移
        }
        dispatch('loadBoardList')
          .then(() => dispatch('loadGraph'))
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    loadBoardList({state, commit}) {
      return new Promise((resolve, reject) => {
        commit('START_BOARD_LOADING');
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
            commit('END_BOARD_LOADING', {
              status: "SUCCESS"
            });
            resolve();
          })
          .catch(err => {
            commit('END_BOARD_LOADING', {
              status: "FAILED"
            });
            reject(err);
          });
      });
    },
    loadGraph({state, commit}) {
      return new Promise((resolve, reject) => {
        commit('START_GRAPH_LOADING');
        ApiClient.getChartData(encrypt(state.trelloAuth.token), encrypt(state.trelloAuth.devKey),
          state.selectedBoard.boardId, state.graph.startDate,
          state.graph.endDate, state.graph.holidays)
          .then(json => {
            setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148, 0.9)', 'rgb(40, 82, 148, 0.5)'); //理想線
            setConfigData(json, 1, "残り作業時間", 'rgb(251, 224, 0, 0.1)', 'rgb(251, 224, 0, 0.9)', 'rgb(251, 224, 0, 0.5)'); //実績線
            setConfigData(json, 2, "実績作業時間", 'rgb(229, 57, 53, 0.1)', 'rgb(229, 57, 53, 0.9)', 'rgb(229, 57, 53, 0.5)'); //実績線
            let obj = graphParam(json);
            commit('SET_GRAPH_DATA', obj);
            commit('END_GRAPH_LOADING', {
              status: "SUCCESS"
            });
            resolve();
          })
          .catch(err => {
            commit('END_GRAPH_LOADING', {
              status: "FAILED"
            });
            reject(err);
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
    START_BOARD_LOADING(state) {
      state.boardLoadState.loading = true;
      state.boardLoadState.status = DEFAULT;
    },
    END_BOARD_LOADING(state, result) {
      state.boardLoadState.loading = false;
      state.boardLoadState.status = result.status;
    },
    START_GRAPH_LOADING(state) {
      state.graphLoadState.loading = true;
      state.graphLoadState.status = DEFAULT;
    },
    END_GRAPH_LOADING(state, result) {
      state.graphLoadState.loading = false;
      state.graphLoadState.status = result.status;
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
    "setting-trello": settingTrello,
    "setting-webhooks": settingWebhooks
  }
})
