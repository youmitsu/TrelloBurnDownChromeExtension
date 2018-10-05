<template>
<v-toolbar>
  <v-flex xs12 sm6 d-flex>
    <v-select
      v-model="selectedBoard"
      :items="boardList"
      item-text="boardName"
      item-value="boardId"
      label="Selected Board"
      :loading="isLoading"
      return-object
      ></v-select>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu
      ref="startMenu"
      :close-on-content-click="false"
      v-model="startMenu" :nudge-right="40"
      :return-value.sync="startDate"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px">
      <v-text-field slot="activator" v-model="startDate" label="StartDate" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="startDate" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="startMenu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.startMenu.save(startDate)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu
      ref="endMenu"
      :close-on-content-click="false"
      v-model="endMenu"
      :nudge-right="40"
      :return-value.sync="endDate"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px">
      <v-text-field slot="activator" v-model="endDate" label="EndDate" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="endDate" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="endMenu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.endMenu.save(endDate)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-spacer></v-spacer>
  <v-icon>sync</v-icon>
</v-toolbar>
</template>
<script>
export default {
  data() {
    return {
      startMenu: false,
      endMenu: false
    }
  },
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
    selectedBoard: {
      get() {
        return this.$store.state.graph.selectedBoard;
      },
      set(value) {
        this.$store.commit('graph/SET_SELECT_BOARD', value);
      }
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
        // return this.$store.state.graph.graph.startDate;
        new Date();
      },
      set(value) {
        this.$store.commit('graph/SET_START_DATE', value);
      }
    },
    endDate: {
      get() {
        // return this.$store.state.graph.graph.endDate;
        new Date();
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
    }
  }
}
</script>
