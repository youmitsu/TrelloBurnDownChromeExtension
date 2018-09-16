//Vue系
import Vue from 'vue';
import Vuex from 'vuex';

//外部ライブラリ
import Chart from 'chartjs';

//common
import { SUCCESS, FAILED, DEFAULT } from './common/loadStatusType.js';

//Components
import * as ApiClient from './lib/apiClient.js';
import * as DataStore from './lib/dataStore.js';
import * as Tab from './lib/tabUtil.js';
import { initialWebhookState } from './lib/templateUtil.js';
import { encrypt } from './lib/cryptUtil.js';
import { setConfigData, graphParam } from './lib/chartUtil.js';
import graphMenu from './components/graphMenu.vue';
import graphContent from './components/graph.vue';
import settingMenu from './components/settingMenu.vue';
import settingBackend from './components/settingBackend.vue';
import settingTrello from './components/settingTrello.vue';
import settingWebhooks from './components/settingWebhooks.vue';
Vue.use(Vuex);

const settingStore = {
  namespaced: true,
  state: {
    serverAuth: {
      baseUrl: DataStore.get('baseUrl'),
      loading: false,
      status: DEFAULT
    },
    trelloAuth: {
      devKey: DataStore.get('devKey'),
      token: DataStore.get('token'),
      loading: false,
      status: DEFAULT
    },
    webhooksState: {
      loading: false,
      status: DEFAULT
    },
    webhookBoards: []
  },
  getters: {
    isLoadingError: state => {
      return !state.serverAuth.loading && state.serverAuth.status === FAILED;
    },
    isLoadingSuccess: state => {
      return !state.serverAuth.loading && state.serverAuth.status === SUCCESS;
    },
    isTrelloLoadingError: state => {
      return !state.trelloAuth.loading && state.trelloAuth.status === FAILED;
    },
    isTrelloLoadingSuccess: state => {
      return !state.trelloAuth.loading && state.trelloAuth.status === SUCCESS;
    },
    isExistTrelloParams: state => {
      return state.trelloAuth.devKey && state.trelloAuth.token;
    }
  },
  mutations: {
    SET_BASEURL(state, baseUrl) {
      state.serverAuth.baseUrl = baseUrl;
      DataStore.set('baseUrl', state.serverAuth.baseUrl);
    },
    START_SERVER_LOADING(state) {
      state.serverAuth.loading = true;
      state.serverAuth.status = DEFAULT;
    },
    END_SERVER_LOADING(state, result) {
      state.serverAuth.loading = false;
      state.serverAuth.status = result.status;
    },
    SET_DEVKEY(state, devKey) {
      state.trelloAuth.devKey = devKey;
      DataStore.set('devKey', state.trelloAuth.devKey);
    },
    SET_TOKEN(state, token) {
      state.trelloAuth.token = token;
      DataStore.set('token', state.trelloAuth.token);
    },
    START_TRELLO_LOADING(state) {
      state.trelloAuth.loading = true;
      state.trelloAuth.status = DEFAULT;
    },
    END_TRELLO_LOADING(state, result) {
      state.trelloAuth.loading = false;
      state.trelloAuth.status = result.status;
    },
    SET_BOARDS(state, data) {
      state.boards = data;
    },
    START_WEBHOOK_LOADING(state) {
      state.webhooksState.loading = true;
    },
    END_WEBHOOK_LOADING(state) {
      state.webhooksState.loading = false;
      state.webhooksState.status = DEFAULT;
    },
    SET_WEBHOOKS_BOARDS(state, data) {
      state.webhookBoards = data;
    },
    START_LOADING_WEBHOOK_BY_INDEX(state, index) {
      state.webhookBoards[index].loading = true;
    },
    END_LOADING_WEBHOOK_BY_INDEX(state, index) {
      state.webhookBoards[index].loading = false;
      state.webhookBoards[index].status = DEFAULT;
    },
    ENABLE_WEBHOOK_BY_INDEX(state, data) {
      state.webhookBoards[data.index].isRegistered = true;
      state.webhookBoards[data.index].webhookId = data.id;
    },
    DISABLE_WEBHOOK_BY_INDEX(state, index) {
      state.webhookBoards[index].isRegistered = false;
      state.webhookBoards[index].webhookId = null;
    }
  },
  actions: {
    validateBaseUrl({ commit, dispatch }, value) {
      commit('SET_BASEURL', value);
      dispatch('checkServer', value);
    },
    validateTrelloAuth({ commit, dispatch }, value) {
      commit('SET_TOKEN', value);
      dispatch('checkTrelloApi');
    },
    validateDevKey({ commit }, value) {
      commit('SET_DEVKEY', value);
      dispatch('checkTrelloApi');
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
    },
    checkTrelloApi({ state, getters, commit }) {
      if (getters.isExistTrelloParams) {
        commit('START_TRELLO_LOADING');
        ApiClient.getUser(state.trelloAuth.token, state.trelloAuth.devKey)
          .then(data => {
            commit('END_TRELLO_LOADING', {
              status: "SUCCESS"
            });
          })
          .catch(err => {
            commit('END_TRELLO_LOADING', {
              status: "FAILED"
            });
          });
      }
    },
    openKeyPage(context) {
      Tab.openOuterBrowser("https://trello.com/1/appKey/generate");
    },
    openTokenPage({state}) {
      Tab.openOuterBrowser(`https://trello.com/1/authorize?expiration=never&name=&scope=read,write&response_type=token&key=${state.trelloAuth.devKey}`);
    },
    loadWebhookList({state, commit}) {
      Promise.all([
        ApiClient.getUserAndBoards(state.trelloAuth.token, state.trelloAuth.devKey),
        ApiClient.getWebhook(state.trelloAuth.token, state.trelloAuth.devKey)
      ])
      .then(results => [results[0], results[1].map(webhook => ({id: webhook.id, idModel: webhook.idModel})), results[1].map(v => v.idModel)])
      .then((values) => {
        let boardIds = values[0];
        let webhookIds = values[1];
        let webhookBoardIds = values[2];
        let formattedIds = boardIds.map(board => {
          let index = webhookBoardIds.indexOf(board.id);
          return index == -1 ? initialWebhookState(null, board, false) : initialWebhookState(webhookIds[index].id, board, true);
        });
        return formattedIds;
      })
      .then(result => {
        commit('SET_WEBHOOKS_BOARDS', result);
        commit('END_WEBHOOK_LOADING');
      })
      .catch(err => {
        commit('END_WEBHOOK_LOADING');
      });
    },
    toggleWebhook({state, commit}, board) {
      let index = state.webhookBoards.map(v => v.boardId).indexOf(board.boardId);
      if(index == -1) {
        //TODO: エラーハンドリング
      } else {
        commit('START_LOADING_WEBHOOK_BY_INDEX', index);
        if(board.isRegistered) {
          ApiClient.unregisterWebhook(board.webhookId, state.trelloAuth.token, state.trelloAuth.devKey)
            .then(res => {
              commit('DISABLE_WEBHOOK_BY_INDEX', index);
              commit('END_LOADING_WEBHOOK_BY_INDEX', index);
            })
            .catch(err => {
              //TODO: エラーハンドリング
              commit('END_LOADING_WEBHOOK_BY_INDEX', index);
            });
        } else {
          ApiClient.registerWebhook(board.boardId, state.serverAuth.baseUrl, state.trelloAuth.token, state.trelloAuth.devKey)
            .then(res => {
              commit('ENABLE_WEBHOOK_BY_INDEX', {"index": index, id: res.id});
              commit('END_LOADING_WEBHOOK_BY_INDEX', index);
            })
            .catch(err => {
              //TODO: エラーハンドリング
              commit('END_LOADING_WEBHOOK_BY_INDEX', index);
            });
        }
      }
    }
  }
};

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
