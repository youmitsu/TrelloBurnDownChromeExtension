//外部ライブラリ
import Vue from 'vue';
import Vuetify from 'vuetify'
import Vuex from 'vuex';
import Chart from 'chartjs';
import "semantic-ui/dist/semantic.min.js";

//css
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vuetify/dist/vuetify.min.css";
import "../css/main.css";
import "semantic-ui/dist/semantic.min.css";
import "semantic-ui-calendar/dist/calendar.min.css";

//common
import { SUCCESS, FAILED, DEFAULT } from './common/loadStatusType.js';
import { GRAPH, SETTING } from './common/viewType.js';

//Utils
import * as DataStore from './lib/dataStore.js';
import * as ApiClient from './lib/apiClient.js';

//Stores
import graphStore from './stores/graphStore.js';
import settingStore from './stores/settingStore.js';

//App
import app from './layouts/app.vue';

Vue.use(Vuetify);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    serverAuth: {
      baseUrl: DataStore.get('baseUrl'),
      loading: false,
      status: DEFAULT
    },
    trelloAuth: {
      token: DataStore.get('token'),
      devKey: DataStore.get('devKey')
    },
    current: {
      isHome: true,
      view: 'graph'
    },
    launch: {
      server: false,
      trello: false,
      board: false
    }
  },
  getters: {
    isTrelloAuthenticated: state => {
      return state.trelloAuth.token && state.trelloAuth.devKey;
    },
    shouldShowTutorial: state => {
      return Object.keys(state.launch).filter(v => !state.launch[v]).length > 0;
    },
    tutorialPosition: state => {
      let isInitial = false;
      let position = 0;
      Object.keys(state.launch).forEach((v, i, a) => {
        if(!state.launch[v] && !isInitial) {
          isInitial = true;
          position = i + 1;
        }
      });
      return position == 0 ? Object.keys(state.launch).length : position;
    }
  },
  actions: {
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
    }
  },
  mutations: {
    SET_INITIAL_STATE(state) {
      if(DataStore.get('launch')) {
        state.launch = JSON.parse(DataStore.get('launch'));
      }
    },
    SET_CURRENT_VIEW(state, value) {
      state.current.isHome = value.isHome;
      state.current.view = value.view;
    },
    START_SERVER_LOADING(state) {
      state.serverAuth.loading = true;
      state.serverAuth.status = DEFAULT;
    },
    END_SERVER_LOADING(state, result) {
      state.serverAuth.loading = false;
      state.serverAuth.status = result.status;
    },
  },
  modules: {
    graph: graphStore,
    setting: settingStore
  }
});

new Vue({
  el: '#app',
  store,
  components: {
    "app-view": app
  }
})
