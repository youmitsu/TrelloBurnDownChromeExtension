<template>
<v-toolbar
  color="transparent"
  extended
>
  <v-toolbar-title>Graph</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-btn icon>
    <v-icon @click="reload">sync</v-icon>
  </v-btn>
  <v-btn icon>
    <v-icon @click="exportGraph">save</v-icon>
  </v-btn>
  <v-flex xs12 sm6 d-flex slot="extension">
    <v-select
      v-model="selectedBoard"
      :items="boardList"
      label="Board"
      item-text="boardName"
      item-value="boardId"
      :loading="isLoading"
      :disabled="isLoadingError"
      return-object
      ></v-select>
  </v-flex>
  <v-flex xs12 sm6 d-flex slot="extension">
    <v-select
      v-model="selectedSprint"
      :items="sprintList"
      label="Sprints"
      item-text="name"
      :loading="isLoading"
      :disabled="isLoadingError"
      return-object
      ></v-select>
  </v-flex>
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
    boardList() {
      return this.$store.getters['graph/boardList'];
    },
    selectedBoard: {
      get() {
        return this.$store.state.graph.selectedBoard;
      },
      set(value) {
        this.$store.commit('graph/SET_SELECT_BOARD', value);
      }
    },
    sprintList() {
      return this.$store.getters['graph/sprintsOfBoard'](this.selectedBoard.boardId);
    },
    selectedSprint: {
      get() {
        return this.$store.state.graph.selectedSprint;
      },
      set(value) {
        this.$store.commit('graph/SET_SELECTED_SPRINT', {
          value,
          sprints: this.$store.state.graph.sprints
        });
      }
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
        return this.$store.getters['graph/holidaysArr'];
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
    exportGraph() {
      let a = document.createElement('A');
      a.download = 'image.png';
      a.href = this.$store.state.graph.graphImage;
      document.body.appendChild(a);
      a.click(); //自動ダウンロード
      document.body.removeChild(a);
    }
  }
}
</script>
