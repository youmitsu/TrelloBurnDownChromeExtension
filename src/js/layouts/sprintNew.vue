<template>
<div>
  <v-toolbar
    color="transparent"
    scroll-off-screen
    scroll-target="#scrolling-target"
  >
    <v-btn icon @click="back">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title>New Sprint</v-toolbar-title>
  </v-toolbar>
  <v-container id="scrolling-target">
  </v-container>
</div>
</template>
<script>
export default {
  methods: {
    back() {
      this.$store.commit('SET_CURRENT_VIEW', {
        isHome: true,
        view: 'graph'
      });
    }
  }
}
</script>
