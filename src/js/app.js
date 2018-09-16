//外部ライブラリ
import Vue from 'vue';
import Vuex from 'vuex';
import Chart from 'chartjs';

//common
import { SUCCESS, FAILED, DEFAULT } from './common/loadStatusType.js';

//Utils
import * as DataStore from './lib/dataStore.js';

//Stores
import graphStore from './stores/graphStore.js';
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
  created: function() {
    store.dispatch('graph/initialLoad')
      .then(() => {
        //TODO: できれば子Componentに持っていく
        this.$nextTick(() => {
          const ctx = this.$el.querySelector('#myChart').getContext('2d');
          ctx.canvas.height = 500;
          var myChart = new Chart(ctx, store.state.graph.graph.data);
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
        store.commit('graph/SET_START_DATE', text);
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
        store.commit('graph/SET_END_DATE', text);
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
