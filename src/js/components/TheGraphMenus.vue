<template>
<v-toolbar>
  <v-flex xs12 sm6 d-flex>
    <v-select :items="boardListItems" label="Selected Board"></v-select>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="290px">
      <v-text-field slot="activator" v-model="date" label="StartDate" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="290px">
      <v-text-field slot="activator" v-model="date" label="EndDate" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-spacer></v-spacer>
  <v-icon>sync</v-icon>
</v-toolbar>
</template>
<script>
export default {
  data: () => ({
    items: [{
        title: 'Click Me'
      },
      {
        title: 'Click Me'
      },
      {
        title: 'Click Me'
      },
      {
        title: 'Click Me 2'
      }
    ],
    date: null,
    menu: false,
    modal: false,
    menu2: false
  }),
  computed: {
    isInputedBoard() {
      return this.$store.getters['graph/isInputedBoard'];
    },
    boardText() {
      return this.$store.getters['graph/boardDefaultText'];
    },
    boardList() {
      return this.$store.state.graph.boardItems;
    },
    boardListItems() {
      return this.$store.state.graph.boardItems.map(v => v.boardName);
    },
    graph() {
      return this.$store.state.graph.graph;
    },
    isLoading() {
      return this.$store.state.graph.boardLoadState.loading;
    },
    isLoadingError() {
      return this.$store.getters['graph/isLoadingError'];
    },
    startDate: {
      get() {
        return this.$store.state.graph.graph.startDate;
      },
      set(value) {
        this.$store.commit('graph/SET_START_DATE', value);
      }
    },
    endDate: {
      get() {
        return this.$store.state.graph.graph.endDate;
      },
      set(value) {
        this.$store.commit('graph/SET_END_DATE', value);
      }
    },
    holidays: {
      get() {
        return this.$store.state.graph.graph.holidays;
      },
      set(value) {
        this.$store.commit('graph/SET_HOLIDAYS', value);
      }
    }
  },
  methods: {
    reload() {
      this.$store.dispatch('graph/reload');
    },
    registerBoard(boardItem) {
      this.$store.commit('graph/SET_SELECT_BOARD', boardItem);
    }
  }
}
</script>
