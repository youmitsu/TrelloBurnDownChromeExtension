<template>
<div>
  <v-toolbar color="transparent">
    <v-toolbar-title>FirstSettings {{pageNumber}}: {{subTitle[pageNumber-1]}}</v-toolbar-title>
  </v-toolbar>
  <v-stepper
    v-model="pageNumber"
    class="mt-2"
  >
    <v-stepper-header>
      <v-stepper-step :complete="pageNumber > 1" step="1"></v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="pageNumber > 2" step="2"></v-stepper-step>
<!--
      <v-divider></v-divider>

      <v-stepper-step step="3"></v-stepper-step> -->
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <tutorial-server></tutorial-server>
        <v-btn color="primary" @click="movePage(2)" :disabled="isDisabledServerNext">NEXT</v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <tutorial-trello></tutorial-trello>
        <v-btn color="primary" @click="tutorialCompleted" :disabled="isDisabledTrelloNext">START!</v-btn>
        <v-btn flat @click="movePage(1)">BACK</v-btn>
      </v-stepper-content>
      <!-- <v-stepper-content step="3">
        <tutorial-board></tutorial-board>
        <v-btn color="primary" @click="">Completed!</v-btn>
        <v-btn flat @click="movePage(2)">Previous</v-btn>
      </v-stepper-content> -->
    </v-stepper-items>
  </v-stepper>
</div>
</template>
<script>
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';
import tutorialServer from '../components/TheTutorialServer.vue';
import tutorialTrello from '../components/TheTutorialTrello.vue';

export default {
  data() {
    return {
      pageNumber: this.$store.getters.tutorialPosition,
      subTitle: [
        "Server side settings",
        "Trello authentication settings"
      ]
    }
  },
  computed: {
    isDisabledServerNext() {
      return this.$store.state.serverAuth.status == FAILED || this.$store.state.serverAuth.loading;
    },
    isDisabledTrelloNext() {
      return this.$store.state.trelloAuth.status == FAILED || this.$store.state.trelloAuth.loading;
    }
  },
  methods: {
    movePage(value) {
      this.pageNumber = value;
    },
    moveToHome() {
      this.$store.commit('SET_TUTORIAL_COMPLETED');
    },
    tutorialCompleted() {
      this.$store.commit('SET_LAUNCH_STATE', {
        key: "trello",
        flg: true
      });
    }
  },
  components: {
    "tutorial-server": tutorialServer,
    "tutorial-trello": tutorialTrello
  }
}
</script>
