<template>
<div>

  <graph-menus></graph-menus>

  <graph-content></graph-content>

</div>
</template>
<script>
import graphMenus from '../components/TheGraphMenus.vue';
import graphContent from '../components/TheGraph.vue';

export default {
  created: function() {
    this.$store.dispatch('graph/initialLoad')
      .then(() => {
      });
  },
  methods: {
  },
  components: {
    "graph-content": graphContent,
    "graph-menus": graphMenus
  }
}
</script>
