<template>
<div>
  <graph-view v-show="isGraphView"></graph-view>
  <setting-view v-show="isSettingView"></setting-view>
  <v-bottom-nav :active.sync="currentView.view" :value="true">
    <v-btn color="teal" flat value="graph">
      <span>GRAPH</span>
      <v-icon>show_chart</v-icon>
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
    "setting-view": settingView
  }
}
</script>
