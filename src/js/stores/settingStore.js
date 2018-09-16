//common
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';

//libs
import * as DataStore from '../lib/dataStore.js';
import * as ApiClient from '../lib/apiClient.js';
import { initialWebhookState } from '../lib/templateUtil.js';

export default {
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
    isLoadingError: (state, getters) => {
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
      console.log("mutation");
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
            status: SUCCESS
          });
        })
        .catch(err => {
          commit('END_SERVER_LOADING', {
            status: FAILED
          });
        });
    },
    checkTrelloApi({ state, getters, commit }) {
      if (getters.isExistTrelloParams) {
        commit('START_TRELLO_LOADING');
        ApiClient.getUser(state.trelloAuth.token, state.trelloAuth.devKey)
          .then(data => {
            commit('END_TRELLO_LOADING', {
              status: SUCCESS
            });
          })
          .catch(err => {
            commit('END_TRELLO_LOADING', {
              status: FAILED
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
      console.log("started");
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
        console.log("loaded");
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
