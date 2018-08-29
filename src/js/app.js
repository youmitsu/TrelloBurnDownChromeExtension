import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    // todos: [],
    // dones: []
  },
  getters: {
    // todos(state) {
    //   return state.todos;
    // },
  },
  actions: {
    // addTodo(context, todo) {
    //   context.commit('ADD_TODO', todo.text);
    // },
  },
  mutations: {
    // ADD_TODO(state, text) {
    //   var todo = {
    //     id: 0,
    //     text: text
    //   }
    //   if (state.todos.length !== 0) {
    //     todo.id = state.todos[state.todos.length - 1].id + 1;
    //   }
    //   state.todos.push(todo);
    // },
  }
});

new Vue({
  el: '#app',
  store,
  components: {}
})
