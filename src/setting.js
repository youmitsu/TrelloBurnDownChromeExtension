var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    trelloAuth: {
      token: null,
      devKey: null
    },
    baseUrl: null
  },
  created: function() {
    this.trelloAuth.token = localStorage.getItem('token');
    this.trelloAuth.devKey = localStorage.getItem('devKey');
    this.baseUrl = localStorage.getItem('baseUrl');
  },
  computed: {},
  methods: {
    register: function() {
      if (this.trelloAuth.token && this.trelloAuth.devKey && this.baseUrl) {
        localStorage.setItem('token', this.trelloAuth.token);
        localStorage.setItem('devKey', this.trelloAuth.devKey);
        localStorage.setItem('baseUrl', this.baseUrl);
        alert("The registration is completed.");
        location.href = "./popup.html";
      }
    }
  }
});
