<template>
<v-container>
  <v-form v-model="valid">
    <v-text-field
      v-model="baseUrl"
      :rules="rules"
      label="BaseUrl"
      required
    ></v-text-field>
  </v-form>
</v-container>
</template>
<script>
export default {
  data: function() {
    return {
      valid: false,
      rules: []
    }
  },
  computed: {
    baseUrl: {
      get() {
        return this.$store.state.serverAuth.baseUrl;
      },
      set(value) {
        //this.$store.dispatch(this.actionNameSpace, value);
      }
    }
  }
}
</script>
