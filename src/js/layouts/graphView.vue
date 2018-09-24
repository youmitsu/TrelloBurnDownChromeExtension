<template>
<div>

  <graph-menu></graph-menu>

  <graph-content></graph-content>

</div>
</template>
<script>
import graphMenu from '../components/TheGraphMenu.vue';
import graphContent from '../components/TheGraph.vue';

export default {
  created: function() {
    this.$store.dispatch('graph/initialLoad')
      .then(() => {
      });
  },
  mounted: function() {
    const onStartDate = this.setStartDate;
    const onEndDate = this.setEndDate;
    $('.ui.dropdown').dropdown();
    $('.menu .browse').popup({
      hoverable: true,
      position: 'bottom center',
      on: 'click'
    });
    $('#startDate.ui.calendar').calendar({
      type: 'date',
      formatter: {
        date: function(date) {
          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return year + '/' + month + '/' + day;
        }
      },
      onChange: function(date, text, mode) {
        onStartDate(text);
      }
    });
    $('#endDate.ui.calendar').calendar({
      type: 'date',
      formatter: {
        date: function(date) {
          var day = ('0' + date.getDate()).slice(-2);
          var month = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          return year + '/' + month + '/' + day;
        }
      },
      onChange: function(date, text, mode) {
        onEndDate(text);
      }
    });
  },
  methods: {
    setStartDate(text) {
      this.$store.commit('graph/SET_START_DATE', text);
    },
    setEndDate(text) {
      this.$store.commit('graph/SET_END_DATE', text);
    }
  },
  components: {
    "graph-menu": graphMenu,
    "graph-content": graphContent
  }
}
</script>
