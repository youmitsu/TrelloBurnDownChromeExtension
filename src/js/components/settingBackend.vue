<template>
  <div>
    <setting-title v-bind:title="title"></setting-title>
    <form-error v-bind:message="successMessage"></form-error>
    <form-success v-bind:message="errorMessage"></form-success>
  </div>
</template>
<script>
  import settingTitle from './setting/title.vue';
  import formError from './setting/formError.vue';
  import formSuccess from './setting/formSuccess.vue';
  export default {
    props: ["title", "successMessage", "errorMessage"],
    computed: {
      isLoadingError() {
        return this.$store.getters.setting.isLoadingError;
      }
    },
    components: {
      'setting-title': settingTitle,
      'form-error': formError,
      'form-success': formSuccess
    }
  }
</script>
