<template>
<div class="ui secondary pointing inverted massive menu">
  <div id="boardDropdown" class="ui dropdown item" v-bind:class="{disabled: isLoading || isLoadingError}">
    <input type="hidden" name="board">
    <i class="dropdown icon"></i>
    <div class="text" v-bind:class="{default: isLoading || isLoadingError}">{{boardText || 'ボードを選択'}}</div>
    <div class="menu">
      <div v-for="boardItem in boardList" class="item" @click="registerBoard(boardItem)">{{boardItem.boardName}}</div>
    </div>
  </div>
  <div class="browse item">
    <span class="ui dropdown" v-text="graph.startDate"></span> ~
    <span class="ui dropdown" v-text="graph.endDate"></span>
  </div>
  <div class="ui flowing popup">
    <div class="ui form">
      <div id="startDate" class="field ui calendar required">
        <label>StartDate</label>
        <div class="ui left icon input">
          <i class="calendar icon"></i>
          <input id="start" type="text" placeholder="開始日" required v-model="startDate">
        </div>
      </div>
      <div id="endDate" class="field ui calendar required">
        <label>EndDate</label>
        <div class="ui left icon input">
          <i class="calendar icon"></i>
          <input id="end" type="text" placeholder="終了日" required v-model="endDate" />
        </div>
      </div>
      <div class="field">
        <label>Holidays</label>
        <div class="ui left icon input">
          <i class="calendar icon"></i>
          <input id="holidays" type="text" placeholder="休日" v-model="holidays"/>
        </div>
      </div>
    </div>
  </div>
  <div class="right menu">
    <a class="item" v-if="!isLoading">
        <i class="ui sync icon" @click="reload"></i>
      </a>
  </div>
</div>
</template>

<style scoped>
  #boardDropdown {
    padding-left: 0px;
  }
  .ui.secondary.pointing.massive.menu {
    background-color: #1976d2;
  }
</style>

<script>
export default {
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
