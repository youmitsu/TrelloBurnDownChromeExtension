import Vue from '../node_modules/vue/dist/vue.js';
import Vuex from '../node_modules/vuex/dist/vuex.js';
import graphMenu from './components/graphMenu.vue';
Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    loadState: {
      loading: false,
      status: "", // status: "" or "SUCCESS" or "FAILED"
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
    }
  },
  actions: {
    setSelectBoard({commit}, boardItem) {
      commit('SET_SELECT_BOARD', boardItem);
    },
    setBoardItems({commit}, boardItems) {
      commit('SET_BOARD_ITEMS', boardItems);
    },
    reload(context) {
      location.reload();
    }
  },
  mutations: {
    SET_SELECT_BOARD(state, boardItem) {
      state.selectedBoard = boardItem;
    },
    SET_START_DATE(state, startDate) {
      state.graph.startDate = startDate;
    },
    SET_END_DATE(state, endDate) {
      state.graph.endDate = endDate;
    },
    SET_HOLIDAYS(state, holidays) {
      state.graph.holidays = holidays;
    }
  }
});

new Vue({
  el: '#app',
  store,
  created: function() {
    
  },
  components: {
    "graph-menu": graphMenu
  }
})
