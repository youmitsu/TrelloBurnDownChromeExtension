<template>
  <div>
    <div class="field" v-bind:class="{disabled:isLoading}">
      <label>{{formType}}</label>
      <div class="ui input">
        <!-- <input id="url" type="text" v-bind:placeholder="type" v-model="serverAuth.baseUrl" @change="validateServer" required> -->
        <input type="text" v-bind:placeholder="formType" v-model="formData" required>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["formType", "isLoading"],
    computed: {
      formData: {
        get() {
          return this.$store.state.setting.serverAuth.baseUrl;
        },
        set(value) {
          this.$store.dispatch('setting/validateBaseUrl', value);
        }
      }
    }
  }
</script>
