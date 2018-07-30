var vm = new Vue({
  el: "#app",
  data: {
    loading: false,
    trelloAuth: {
      token: null,
      devKey: null
    }
  },
  created: function() {
    this.trelloAuth.token = localStorage.getItem('token');
    this.trelloAuth.devKey = localStorage.getItem('devKey');
  },
  computed: {
  },
  methods: {
    register: function() {
      if(this.trelloAuth.token && this.trelloAuth.devKey) {
        localStorage.setItem('token', this.trelloAuth.token);
        localStorage.setItem('devKey', this.trelloAuth.devKey);
        alert("The registration is completed.");
        location.href = "./popup.html";
      }
    }
  }
});
