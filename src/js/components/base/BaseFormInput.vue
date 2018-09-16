<template>
  <div>
    <div class="field" v-bind:class="{disabled:isLoading}">
      <label>{{formType}}</label>
      <div class="ui input">
        <input type="text" v-bind:placeholder="formType" v-model="formData" required>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["formType", "isLoading", "dataState", "actionNameSpace"],
    computed: {
      formData: {
        get() {
          return this.dataState;
        },
        set(value) {
          this.$store.dispatch(this.actionNameSpace, value);
        }
      }
    }
  }
</script>
