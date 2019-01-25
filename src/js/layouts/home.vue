<template>
<div>
  <graph-view v-show="isGraphView"></graph-view>
  <sprints-view v-show="isSprintsView"></sprints-view>
  <setting-view v-show="isSettingView"></setting-view>
  <v-bottom-nav
    :active.sync="currentView.view"
    :value="true"
    fixed
    color="white"
  >
    <v-btn color="teal" flat value="graph">
      <span>GRAPH</span>
      <v-icon>show_chart</v-icon>
    </v-btn>
    <v-btn color="teal" flat value="sprints">
      <span>SPRINTS</span>
      <v-icon>list</v-icon>
    </v-btn>
    <v-btn color="teal" flat value="setting">
      <span>SETTING</span>
      <v-icon>settings</v-icon>
    </v-btn>
  </v-bottom-nav>
</div>
</template>
<script>
import viewType from '../common/viewType.js';
import graphView from './graphView.vue';
import sprintsView from './sprints.vue';
import settingView from './settingView.vue';

export default {
  data() {
    return {
      active: null
    }
  },
  computed: {
    isGraphView() {
      return this.$store.state.current.view == viewType.GRAPH.name;
    },
    isSettingView() {
      return this.$store.state.current.view == viewType.SETTING.name;
    },
    isSprintsView() {
      return this.$store.state.current.view == viewType.SPRINTS.name;
    },
    currentView: {
      get() {
        return this.$store.state.current;
      },
      set(value) {
        this.$store.commit('SET_CURRENT_VIEW', {
          isHome: true,
          view: value
        });
      }
    }
  },
  components: {
    "graph-view": graphView,
    "sprints-view": sprintsView,
    "setting-view": settingView
  }
}
</script>
