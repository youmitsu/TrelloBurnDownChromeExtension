<template>
  <div id="content">
    <setting-title title="AvailableBoards" v-show="trelloAuthenticated"></setting-title>
    <h4 v-show="trelloAuthenticated">
      The list of boards you are able to acquired data.<br/>
      You can switch enable or disable by clicking right button.
    </h4>
    <i class="ui notched circle loading icon" v-if="isLoading"></i>
    <div class="ui segment" v-if="isDisplayBoardList">
      <div class="ui middle aligned divided list">
        <div class="item" v-for="board in webhookBoards">
          <div class="right floated content">
            <div class="ui button" v-bind:class="{basic: !board.isRegistered, blue: board.isRegistered, loading: board.isloading}">
              {{board.isRegistered ? "Registered" : "Register"}}
            </div>
          </div>
          <img class="ui avatar middle aligned image" v-bind:src="board.backgroundImage || './image/no_image.png'">
          <div class="content header">
            {{board.boardName}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  #content {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
<script>
  import settingTitle from './setting/title.vue';
  import * as ApiClient from '../lib/apiClient.js';
  export default {
    computed: {
      trelloAuthenticated() {
        return this.$store.getters['setting/isExistTrelloParams'];
      },
      isLoading() {
        return this.$store.state.setting.webhooksState.loading;
      },
      isDisplayBoardList() {
        return !this.isLoading && this.trelloAuthenticated;
      },
      webhookBoards() {
        return this.$store.state.setting.webhookBoards;
      }
    },
    components: {
      'setting-title': settingTitle
    },
    mounted: function() {
      if(this.$store.getters['setting/isExistTrelloParams']) {
        this.$store.commit('setting/START_WEBHOOK_LOADING');
        //apiコールをdispatch
        this.$store.dispatch('setting/loadWebhookList');
      }
    }
  }
</script>
