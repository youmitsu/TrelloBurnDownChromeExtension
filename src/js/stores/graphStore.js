import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';

import * as DataStore from '../lib/dataStore.js';
import * as ApiClient from '../lib/apiClient.js';

import { setConfigData, graphParam } from '../lib/chartUtil.js';
import { encrypt } from '../lib/cryptUtil.js';

export default {
  namespaced: true,
  state: {
    graphLoadState: {
      loading: false,
      status: DEFAULT
    },
    selectedBoard: {
      boardId: DataStore.get('boardId'),
      boardName: DataStore.get('boardName')
    },
    boardLoadState: {
      loading: false,
      status: DEFAULT
    },
    boardItems: [],
    graph: {
      startDate: DataStore.get('startDate'),
      endDate: DataStore.get('endDate'),
      holidays: DataStore.get('holidays'),
      data: null,
      options: null
    }
  },
  getters: {
    boardList: state => {
      return state.boardItems.length <= 0 ? ["ボードがありません"] : state.boardItems;
    },
    isBoardLoadingError: state => {
      return !state.boardLoadState.loading && state.boardLoadState.status === FAILED;
    },
    isGraphLoadingError: state => {
      return !state.graphLoadState.loading && state.graphLoadState.status === FAILED;
    },
    holidaysArr: state => {
      return state.graph.holidays.split(',');
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
    },
    SET_CHART_OPTIONS(state, data) {
      state.graph.options = data;
    },
    SET_SPRINT(state, data) {
      DataStore.set("sprints", JSON.stringify(data));
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
    initialLoad({commit, state, getters, dispatch, rootGetters}) {
      //TODO: localStorage内のデータでaction切り分ける
      return new Promise((resolve, reject) => {
        if(!rootGetters.trelloAuthenticated) {
          //TODO: 設定画面に遷移
        }
        commit('START_GRAPH_LOADING');
        commit('START_BOARD_LOADING');
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
    loadBoardList({state, commit, rootState}) {
      return new Promise((resolve, reject) => {
        ApiClient.getUser(rootState.trelloAuth.token, rootState.trelloAuth.devKey)
          .then(user => ApiClient.getBoards(user.username, rootState.trelloAuth.token, rootState.trelloAuth.devKey))
          .then(boards => {
            boards.forEach(v => {
              commit('ADD_BOARD', {
                boardId: v.id,
                boardName: v.name,
                isActive: v.id === state.selectedBoard.boardId
              });
            });
            commit('END_BOARD_LOADING', {
              status: SUCCESS
            });
            resolve();
          })
          .catch(err => {
            commit('END_BOARD_LOADING', {
              status: FAILED
            });
            commit('END_GRAPH_LOADING', {
              status: FAILED
            });
            reject(err);
          });
      });
    },
    loadGraph({state, commit, rootState}) {
      return new Promise((resolve, reject) => {
        ApiClient.getChartData(encrypt(rootState.trelloAuth.token), encrypt(rootState.trelloAuth.devKey),
          state.selectedBoard.boardId, state.graph.startDate,
          state.graph.endDate, state.graph.holidays)
          .then(json => {
            commit('SET_CHART_OPTIONS', {
              elements: {
                line: {
                  tension: 0
                }
              },
              responsive: true,
              maintainAspectRatio: false,
            });
            setConfigData(json, 0, "理想線", 'rgb(40, 82, 148, 0.1)', 'rgb(40, 82, 148, 0.9)', 'rgb(40, 82, 148, 0.5)'); //理想線
            setConfigData(json, 1, "残り作業時間", 'rgb(251, 224, 0, 0.1)', 'rgb(251, 224, 0, 0.9)', 'rgb(251, 224, 0, 0.5)'); //実績線
            setConfigData(json, 2, "実績作業時間", 'rgb(229, 57, 53, 0.1)', 'rgb(229, 57, 53, 0.9)', 'rgb(229, 57, 53, 0.5)'); //実績線
            commit('SET_GRAPH_DATA', json);
            commit('END_GRAPH_LOADING', {
              status: SUCCESS
            });
            resolve();
          })
          .catch(err => {
            commit('END_GRAPH_LOADING', {
              status: FAILED
            });
            reject(err);
          });
      });
    },
    saveSprint({commit}, data) {
      if(!data || 0 === Object.keys(data).length){
        return;
      }
      let old = DataStore.get("sprints") ? JSON.parse(DataStore.get("sprints")) : {};
      if (!old[data.board.boardId]) {
        old[data.board.boardId] = [];
      }
      old[data.board.boardId].push({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        holidays: data.holidays
      });
      commit('SET_SPRINT', old);
      //TODO: ダイアログ出して遷移先を選択させる
      commit('SET_CURRENT_VIEW', {
        view: 'graph',
        isHome: true
      }, { root: true });
    }
  }
}
