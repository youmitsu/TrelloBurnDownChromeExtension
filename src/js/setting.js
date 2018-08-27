'use strict';
import * as apiClient from './apiClient.js';

var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    trelloAuth: {
      token: null,
      devKey: null,
      isError: false,
      loadState: "notStarted"
    },
    boards: [],
    webhooks: [],
    serverAuth: {
      baseUrl: null,
      isError: false,
      loadState: "notStarted"
    },
    webhookStatus: [],
    webhookBoards: []
  },
  created: function() {
    this.trelloAuth.token = localStorage.getItem('token') || "";
    this.trelloAuth.devKey = localStorage.getItem('devKey') || "";
    this.serverAuth.baseUrl = localStorage.getItem('baseUrl') || "";
  },
  updated: function() {
    localStorage.setItem('baseUrl', this.serverAuth.baseUrl);
    localStorage.setItem('token', this.trelloAuth.token);
    localStorage.setItem('devKey', this.trelloAuth.devKey);
  },
  mounted: function() {
    if (this.trelloAuth.token && this.trelloAuth.devKey && this.serverAuth.baseUrl) {
      this.loading = true;
      apiClient.getUser(this.trelloAuth.token, this.trelloAuth.devKey)
        .then(user => apiClient.getBoards(user.username, this.trelloAuth.token, this.trelloAuth.devKey))
        .then(boards => {
          vm.boards = [];
          boards.map(v => {
            vm.boards.push(v);
          });
          return;
        })
        .then(() => apiClient.getWebhook(this.trelloAuth.token, this.trelloAuth.devKey))
        .then(webhooks => {
          vm.webhooks = [];
          webhooks.map(v => {
            vm.webhooks.push(v);
          });
          return;
        })
        .then(() => this.getWebhookStatus())
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  computed: {
    trelloAuthenticated: function() {
      return localStorage.getItem('token') &&
        localStorage.getItem('devKey');
    }
  },
  methods: {
    toggleWebhook: function(board) {
      let index = vm.webhookBoards.map(v => v.boardId).indexOf(board.boardId);
      vm.webhookBoards[index].isloading = true;
      if (board.isRegistered) { //解除処理
        apiClient.unregisterWebhook(board.webhookId, this.trelloAuth.token, this.trelloAuth.devKey)
          .then(res => {
            vm.webhookBoards[index].isRegistered = false;
            vm.webhookBoards[index].isloading = false;
          })
          .catch(err => {

          });
      } else { // 登録処理
        apiClient.registerWebhook(board.boardId, this.serverAuth.baseUrl, this.trelloAuth.token, this.trelloAuth.devKey)
          .then(res => {
            vm.webhookBoards[index].webhookId = res.id;
            vm.webhookBoards[index].isRegistered = true;
            vm.webhookBoards[index].isloading = false;
          })
          .catch(err => {

          });
      }
    },
    getWebhookStatus: function() {
      let modelIds = vm.webhooks.map(v => v.idModel);
      let webhookIds = vm.webhooks.map(v => v.id);

      vm.webhookBoards = vm.boards.map((board, index, a) => {
        if (modelIds.includes(board.id)) {
          return {
            webhookId: this.getWebhookIdFromboard(board.id),
            boardId: board.id,
            boardName: board.name,
            backgroundImage: board.prefs.backgroundImageScaled ? board.prefs.backgroundImageScaled[0].url : null,
            isRegistered: true,
            isloading: false
          };
        } else {
          return {
            webhookId: null,
            boardId: board.id,
            boardName: board.name,
            backgroundImage: board.prefs.backgroundImageScaled ? board.prefs.backgroundImageScaled[0].url : null,
            isRegistered: false,
            isloading: false
          };
        }
      });
      vm.loading = false;
    },
    getWebhookIdFromboard: function(boardId) {
      let webhookId = "";
      vm.webhooks.forEach(v => {
        if (v.idModel == boardId) {
          webhookId = v.id;
        }
      });
      return webhookId;
    },
    openOuterBrowser: function(url) {
      chrome.tabs.create({
        "url": url
      });
    },
    openKeyPage: function() {
      this.openOuterBrowser("https://trello.com/1/appKey/generate");
    },
    openTokenPage: function() {
      this.openOuterBrowser(`https://trello.com/1/authorize?expiration=never&name=&scope=read,write&response_type=token&key=${this.trelloAuth.devKey}`);
    },
    validateTrello: function() {
      if(this.trelloAuth.token && this.trelloAuth.devKey){
        this.trelloAuth.loadState = "loading";
        apiClient.getUser(this.trelloAuth.token, this.trelloAuth.devKey)
          .then(res => {
            vm.trelloAuth.loadState = "completed";
            vm.trelloAuth.isError = false;
          })
          .catch(err => {
            vm.trelloAuth.loadState = "completed";
            vm.trelloAuth.isError = true;
          });
      }
    },
    validateServer: function() {
      if(this.serverAuth.baseUrl){
        this.serverAuth.loadState = "loading";
        apiClient.checkServerUrl()
          .then(res => {
            vm.serverAuth.loadState = "completed";
            vm.serverAuth.isError = false;
          })
          .catch(err => {
            vm.serverAuth.loadState = "completed";
            vm.serverAuth.isError = true;
          });
      }
    }
  }
});
