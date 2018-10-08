<template>
<v-container v-if="isGraphDisplayed">
  <div class="ui error message" v-if="isError">
    エラーが発生しました。
  </div>
  <v-card
    class="elevation-5 pa-3"
    v-bind:class="{loading: isLoading}"
    v-if="!isError"
    flat
    height="420px">
    <burndown-chart
      v-bind:chartData="graphData"
      v-bind:options="graphOptions"
      v-bind:width="400"
      v-bind:height="400"
      v-if="!isLoading">
    </burndown-chart>
    <div class="text-xs-center">
      <v-progress-circular
        :size="30"
        color="primary"
        indeterminate
        v-if="isLoading"
      ></v-progress-circular>
    </div>
  </v-card>
</v-container>
</template>
<script>
import TheChart from './TheChart.js';
export default {
  computed: {
    isGraphDisplayed() {
      return this.$store.getters.isTrelloAuthenticated;
    },
    isLoading() {
      return this.$store.state.graph.graphLoadState.loading
    },
    isError() {
      return this.$store.getters['graph/isGraphLoadingError'];
    },
    graphData() {
      return this.$store.state.graph.graph.data;
    },
    graphOptions() {
      return this.$store.state.graph.graph.options;
    }
  },
  components: {
    'burndown-chart': TheChart
  }
}
</script>
