<template>
<v-container>
  <v-form v-model="valid">
    <v-text-field
      v-model="baseUrl"
      label="BaseUrl"
      required
      :append-outer-icon="loadResultIcon"
      :loading="isLoading"
    ></v-text-field>
  </v-form>
</v-container>
</template>
<script>
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';
export default {
  data: function() {
    return {
      valid: false,
    }
  },
  computed: {
    baseUrl: {
      get() {
        return this.$store.state.serverAuth.baseUrl;
      },
      set(value) {
        this.$store.dispatch('checkServer', value);
      }
    },
    loadResultIcon() {
      if(this.$store.state.serverAuth.status == SUCCESS) {
        return "check";
      } else if (this.$store.state.serverAuth.status == FAILED) {
        return "error";
      }
      return "";
    },
    isLoading() {
      return !!this.$store.state.serverAuth.loading;
    }
  }
}
</script>
