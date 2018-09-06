<template>
  <div class="ui main container" v-if="isGraphDisplayed">
    <div class="ui segment" v-bind:class="{loading: isLoading}">
      <div id="graphArea">
        <div class="chartContainer">
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    isGraphDisplayed() {
      return this.$store.getters.isTrelloAuthenticated;
    },
    isLoading() {
      return this.$store.state.loadState.loading
    }
  }
}
</script>
