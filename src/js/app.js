//外部ライブラリ
import Vue from 'vue';
import Vuetify from 'vuetify'
import Vuex from 'vuex';
import Chart from 'chartjs';

//common
import { SUCCESS, FAILED, DEFAULT } from './common/loadStatusType.js';

//Utils
import * as DataStore from './lib/dataStore.js';

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
      token: localStorage.getItem('token'),
      devKey: localStorage.getItem('devKey')
    }
  },
  getters: {
    isTrelloAuthenticated: state => {
      return state.trelloAuth.token && state.trelloAuth.devKey;
    }
  },
  actions: {
  },
  mutations: {
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
