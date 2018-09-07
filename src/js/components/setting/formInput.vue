<template>
  <div>
    <!-- <i class="ui notched circle loading icon" v-if="serverAuth.loadState == 'loading'"></i> -->
    <div class="field">
    <!-- <div class="field" v-bind:class="{disabled: serverAuth.loadState == 'loading'}"> -->
      <label>{{formType}}</label>
      <div class="ui input">
        <!-- <input id="url" type="text" v-bind:placeholder="type" v-model="serverAuth.baseUrl" @change="validateServer" required> -->
        <input type="text" v-bind:placeholder="formType" required>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["formType"]
  }
</script>
