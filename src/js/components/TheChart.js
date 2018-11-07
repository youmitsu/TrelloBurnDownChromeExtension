import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options);
    this.$store.commit("graph/SET_GRAPH_IMAGE", this.$data._chart.toBase64Image());
  }
}
