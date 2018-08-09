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
        .then(res => {
          this.getBoards(res.username)
            .then(boards => {
              boards.map(v => {
                vm.boards.push(v);
              });
              vm.boards = boards;
              this.getWebhook()
                .then(result => {
                  result.map(v => {
                    vm.webhooks.push(v);
                  });
                  vm.webhooks = result;
                  this.getWebhookStatus()
                  this.loading = false;
                })
                .catch(err => {
                  console.error(err);
                  this.loading = false;
                });
            })
            .catch(err => {
              console.error(err);
              this.loading = false;
            });
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
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
      let webhookIds = vm.webhooks.map(v => v.idModel);
      vm.webhookBoards = vm.boards.map(v => {
        if (webhookIds.includes(v.id)) {
          return {
            boardId: v.id,
            boardName: v.name,
            isRegistered: true
          };
        }
        return {
          boardId: v.id,
          boardName: v.name,
          isRegistered: false
        };
      });
    }
  }
});
