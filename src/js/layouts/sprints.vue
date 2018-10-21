<template>
<div>
  <v-toolbar
    color="transparent"
    scroll-off-screen
    scroll-target="#scrolling-target"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Sprints</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon @click="showSprintNew">add</v-icon>
    </v-btn>
  </v-toolbar>
  <v-container id="scrolling-target">
    <v-select
      :items="boardList"
      label="Board"
      item-text="boardName"
      item-value="boardId"
      v-model="selectedBoard"
      return-object
    ></v-select>
    <v-list two-line v-show="sprints.length > 0">
      <template v-for="(item, i) in sprints">
        <v-list-tile
            :key="i"
            avatar
            @click=""
          >
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
            <v-list-tile-sub-title>{{item.startDate}} ~ {{item.endDate}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-container>
</div>
</template>
<script>
export default {
  data() {
    return {
      selectedBoard: null
    }
  },
  mounted() {
    this.$store.dispatch('graph/loadBoardList')
      .then(() => {
      });
  },
  computed: {
    boardList() {
      return this.$store.getters['graph/boardList'];
    },
    sprints() {
      if(!this.selectedBoard) {
        return [];
      }
      return this.$store.getters['graph/sprintsOfBoard'](this.selectedBoard.boardId);
    }
  },
  methods: {
    showSprintNew() {
      this.$store.commit('SET_CURRENT_VIEW', {
        view: 'sprintNew',
        isHome: false
      });
    }
  }
}
</script>
