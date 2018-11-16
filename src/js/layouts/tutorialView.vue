<template>
<div>
  <v-toolbar>
    <v-toolbar-title>First Settings</v-toolbar-title>
  </v-toolbar>
  <v-stepper v-model="pageNumber">
    <v-stepper-header>
      <v-stepper-step :complete="pageNumber > 1" step="1">Name of step 1</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="pageNumber > 2" step="2">Name of step 2</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Name of step 3</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <tutorial-server></tutorial-server>
        <v-btn color="primary" @click="pageNumber = 2" :disabled="isDisabledServerNext">Next</v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <tutorial-trello></tutorial-trello>
        <v-btn color="primary" @click="pageNumber = 3">Next</v-btn>
        <v-btn flat @click="pageNumber = 1">Previous</v-btn>
      </v-stepper-content>
      <v-stepper-content step="3">
        <tutorial-board></tutorial-board>
        <v-btn color="primary" @click="">Completed!</v-btn>
        <v-btn flat @click="pageNumber = 2">Previous</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</div>
</template>
<script>
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';
import tutorialServer from '../components/TheTutorialServer.vue';
import tutorialTrello from '../components/TheTutorialServer.vue';
import tutorialBoard from '../components/TheTutorialServer.vue';

export default {
  data() {
    return {
      pageNumber: 1
    }
  },
  created: function() {},
  computed: {
    isDisabledServerNext() {
      return this.$store.state.serverAuth.status == FAILED || this.$store.state.serverAuth.loading;
    }
  },
  methods: {},
  components: {
    "tutorial-server": tutorialServer,
    "tutorial-trello": tutorialTrello,
    "tutorial-board": tutorialBoard
  }
}
</script>
