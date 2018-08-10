var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    trelloAuth: {
      token: null,
      devKey: null
    },
    boards: [],
    webhooks: [],
    baseUrl: null,
    webhookStatus: [],
    webhookBoards: []
  },
  created: function() {
    this.trelloAuth.token = localStorage.getItem('token');
    this.trelloAuth.devKey = localStorage.getItem('devKey');
    this.baseUrl = localStorage.getItem('baseUrl');
  },
  mounted: function() {
    if (this.trelloAuth.token && this.trelloAuth.devKey && this.baseUrl) {
      this.loading = true;
      this.getUser()
        .then(user => this.getBoards(user.username))
        .then(boards => {
          vm.boards = [];
          boards.map(v => {
            vm.boards.push(v);
          });
          return;
        })
        .then(() => this.getWebhook())
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
      if (board.isRegistered) { //解除処理
        this.unregisterWebhook(board.webhookId)
          .then(res => {
            //let index = webhookBoards.map(v => v.boardId).indexOf(board.id);
          })
          .catch(err => {

          });
      } else { // 登録処理
        this.registerWebhook(board.boardId)
          .then(res => {
            //let index = webhookBoards.map(v => v.boardId).indexOf(board.id);
          })
          .catch(err => {

          });
      }
    },
    register: function() {
      localStorage.setItem('token', this.trelloAuth.token);
      localStorage.setItem('devKey', this.trelloAuth.devKey);
      localStorage.setItem('baseUrl', this.baseUrl);
      alert("The registration is completed.");
      location.href = "./popup.html";
    },
    getWebhook: function() {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/tokens/${this.trelloAuth.token}/webhooks?key=${this.trelloAuth.devKey}`, {
          method: 'GET'
        }).then(res => {
          return res.json();
        }).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getBoards: function(username) {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/members/${username}/boards?token=${this.trelloAuth.token}&key=${this.trelloAuth.devKey}&filter=open&fields=name&lists=none&memberships=none`, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(json => {
            resolve(json);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getUser: function() {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/tokens/${this.trelloAuth.token}/member?token=${this.trelloAuth.token}&key=${this.trelloAuth.devKey}&field=username`, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(json => {
            resolve(json);
          })
          .catch(err => {
            reject(err);
          });
      });
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
            isRegistered: true
          };
        } else {
          return {
            webhookId: null,
            boardId: board.id,
            boardName: board.name,
            isRegistered: false
          };
        }
      });
      vm.loading = false;
    },
    getWebhookIdFromboard: function(boardId) {
      let webhookId = "";
      vm.webhooks.forEach(v => {
        if(v.idModel == boardId) {
          webhookId = v.id;
        }
      });
      return webhookId;
    },
    unregisterWebhook: function(webhookId) {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/webhooks/${webhookId}?token=${this.trelloAuth.token}&key=${this.trelloAuth.devKey}`, {
            method: 'DELETE'
          })
          .then(res => res.json)
          .then(json => resolve(json))
          .catch(err => reject(err));
      });
    },
    registerWebhook: function(boardId) {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/webhooks/?idModel=${boardId}&callbackURL=https://us-central1-trelloburndownproject.cloudfunctions.net/execRegisterPoint&token=${this.trelloAuth.token}&key=${this.trelloAuth.devKey}` , {
            method: 'POST'
          })
          .then(res => res.json)
          .then(json => resolve(json))
          .catch(err => reject(err));
      });
    }
  }
});
