<template>
  <div>
    <setting-title v-bind:title="title"></setting-title>
    <form-error v-bind:message="successMessage"></form-error>
    <form-success v-bind:message="errorMessage"></form-success>
    <form-input v-bind:formType="formType"></form-input>
  </div>
</template>
<script>
  import settingTitle from './setting/title.vue';
  import formError from './setting/formError.vue';
  import formSuccess from './setting/formSuccess.vue';
  import formInput from './setting/formInput.vue';
  export default {
    props: ["title", "successMessage", "errorMessage", "formType"],
    computed: {
      isLoadingError() {
        return this.$store.getters.setting.isLoadingError;
      }
    },
    components: {
      'setting-title': settingTitle,
      'form-error': formError,
      'form-success': formSuccess,
      'form-input': formInput
    }
  }
</script>
