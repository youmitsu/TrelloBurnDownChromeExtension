<template>
<div class="ui main container" v-if="isGraphDisplayed">
  <div class="ui error message" v-if="isError">
    エラーが発生しました。
  </div>
  <div class="ui segment" v-bind:class="{loading: isLoading}" v-if="!isError">
    <burndown-chart
      v-bind:chartData="graphData"
      v-bind:options="graphOptions"
      v-bind:width="400"
      v-bind:height="420">
    </burndown-chart>
  </div>
</div>
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
