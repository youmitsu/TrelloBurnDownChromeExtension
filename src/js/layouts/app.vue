<template>
<div>
  <v-tabs v-model="active" color="cyan" dark slider-color="yellow" fixed-tabs>
    <v-tab v-for="view in viewList" :key="view.id">
      {{ view.name }}
    </v-tab>
    <v-tab-item :key="viewType.GRAPH.id">
      <graph-view></graph-view>
    </v-tab-item>
    <v-tab-item :key="viewType.SETTING.id">
      <setting-view></setting-view>
    </v-tab-item>
  </v-tabs>
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
