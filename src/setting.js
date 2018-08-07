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
    webhookStatus: []
  },
  created: function() {
    this.trelloAuth.token = localStorage.getItem('token');
    this.trelloAuth.devKey = localStorage.getItem('devKey');
    this.baseUrl = localStorage.getItem('baseUrl');
  },
  mounted: function() {
    //fetch(`https://api.trello.com/1/members/${localStorage.getItem('username')}/boards`)
    //
    // fetch(`https://api.trello.com/1/tokens/${this.trelloAuth.token}/webhooks?key=${this.trelloAuth.devKey}`, {
    //   method: 'GET'
    // }).then(res => {
    //   return res.json();
    // }).then(response => {
    //   console.log(response);
    // }).catch(error => {
    //   console.log(error);
    // });
  },
  computed: {},
  methods: {
    register: function() {
      if (this.trelloAuth.token && this.trelloAuth.devKey && this.baseUrl) {
        vm.getUser()
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
                  })
                  .catch(err => {
                    console.error(err);
                  });
              })
              .catch(err => {
                console.error(err);
              });
          })
          .catch(err => {
            console.error(err);
          });
        // localStorage.setItem('token', this.trelloAuth.token);
        // localStorage.setItem('devKey', this.trelloAuth.devKey);
        // localStorage.setItem('baseUrl', this.baseUrl);
        // alert("The registration is completed.");
        // location.href = "./popup.html";
      }
    },
    getWebhook: function() {
      return new Promise((resolve, reject) => {
        fetch(`https://api.trello.com/1/tokens/${vm.trelloAuth.token}/webhooks?key=${vm.trelloAuth.devKey}`, {
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
        fetch(`https://api.trello.com/1/members/${username}/boards?token=${vm.trelloAuth.token}&key=${vm.trelloAuth.devKey}&filter=open&fields=name&lists=none&memberships=none`, {
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
        fetch(`https://api.trello.com/1/tokens/${vm.trelloAuth.token}/member?token=${vm.trelloAuth.token}&key=${vm.trelloAuth.devKey}&field=username`, {
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
      console.log(vm.boards);
      console.log(vm.webhooks);
      let webhookIds = vm.webhooks.map(v => v.idModel);
      vm.boards.map(v => {
        if(webhookIds.includes(v.id)){
          console.log(v.id);
        }
      });
      // let maps = vm.webhooks.flatMap(cv => cv.id);
      // console.log(maps);
      // vm.webhooks.forEach(v => {
      //   console.log(vm.boards.include(v.idModel));
      // });
    }
  }
});
