<template>
<div class="ui secondary pointing inverted massive menu">
  <div id="boardSelectArea" class="ui dropdown item popup">
    <div class="text default" v-text="boardText"></div>
    <i class="dropdown icon"></i>
    <div class="menu">
      <div v-for="boardItem in boardList" @click="registerBoard(boardItem)" v-bind:class="{active: boardItem.isActive, selected: boardItem.isActive}" class="item" v-bind:value="boardItem.boardId" v-bind:data-value="boardItem.boardName">{{boardItem.boardName}}</div>
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
    <a class="item">
        <i class="ui sync icon" @click="reload"></i>
      </a>
    <a class="item" href="./setting.html">
        <i class="ui cog icon"></i>
      </a>
  </div>
</div>
</template>

<script>
export default {
  computed: {
    isInputedBoard() {
      return this.$store.getters.isInputedBoard;
    },
    boardText() {
      return this.$store.getters.boardDefaultText;
    },
    boardList() {
      return this.$store.getters.boardList;
    },
    graph() {
      return this.$store.state.graph;
    },
    startDate: {
      get() {
        return this.$store.state.graph.startDate;
      },
      set(value) {
        this.$store.commit('SET_START_DATE', value);
      }
    },
    endDate: {
      get() {
        return this.$store.state.graph.endDate;
      },
      set(value) {
        this.$store.commit('SET_END_DATE', value);
      }
    },
    holidays: {
      get() {
        return this.$store.state.graph.holidays;
      },
      set(value) {
        this.$store.commit('SET_HOLIDAYS', value);
      }
    }
  },
  methods: {
    reload() {
      this.$store.dispatch('reload');
    },
    registerBoard(boardItem) {
      this.$store.commit('SET_SELECT_BOARD', boardItem);
    }
  }
}
</script>
