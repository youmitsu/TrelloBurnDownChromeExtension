<template>
<div>
  <home-view v-show="isHome"></home-view>
  <sprint-new v-show="isSprintNew"></sprint-new>
</div>
</template>
<script>
import * as DataStore from '../lib/dataStore.js';
import viewType from '../common/viewType.js';
import homeView from './home.vue';
import sprintNew from './sprintNew.vue';

export default {
  created() {
    this.$store.commit('setting/SET_INITIAL_STATE');
    this.$store.commit('graph/SET_INITIAL_STATE');
  },
  computed: {
    isHome() {
      return this.$store.state.current.isHome;
    },
    isSprintNew() {
      return !this.$store.state.current.isHome && this.$store.state.current.view == viewType.SPRINT_NEW.name;
    }
  },
  components: {
    "home-view": homeView,
    "sprint-new": sprintNew
  }
}
</script>
