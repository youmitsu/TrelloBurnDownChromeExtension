<template>
<div class="ui main container" v-if="isGraphDisplayed">
  <div class="ui error message" v-if="isError">
    エラーが発生しました。
    <!-- <p>{{error.discription}}</p> -->
  </div>
  <div class="ui segment" v-bind:class="{loading: isLoading}" v-if="!isError">
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
    },
    isError() {
      console.log(this.$store.getters.isLoadingError);
      return this.$store.getters.isLoadingError;
    }
  }
}
</script>
