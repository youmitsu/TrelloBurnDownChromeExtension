<template>
<div>
  <v-tabs v-model="active" color="cyan" dark slider-color="yellow" centered>
    <v-tab v-for="view in viewList" :key="view.id">
      {{ view.name }}
      <v-icon v-if="view.name == viewType.GRAPH.name">show_chart</v-icon>
      <v-icon v-if="view.name == viewType.SETTING.name">settings</v-icon>
    </v-tab>
    <v-tab-item :key="viewType.GRAPH.id">
      <graph-view></graph-view>
    </v-tab-item>
    <v-tab-item :key="viewType.SETTING.id">
      <setting-view></setting-view>
    </v-tab-item>
  </v-tabs>
  <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="transparent">
    <v-btn color="teal" flat value="recent">
      <span>Recent</span>
      <v-icon>history</v-icon>
    </v-btn>

    <v-btn color="teal" flat value="favorites">
      <span>Favorites</span>
      <v-icon>favorite</v-icon>
    </v-btn>

    <v-btn color="teal" flat value="nearby">
      <span>Nearby</span>
      <v-icon>place</v-icon>
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
      active: null,
      "viewType": viewType
    }
  },
  computed: {
    viewList() {
      return viewType.items;
    }
  },
  components: {
    "graph-view": graphView,
    "setting-view": settingView
  }
}
</script>
