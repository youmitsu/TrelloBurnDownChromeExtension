<template>
  <div id="content">
    <setting-title title="BackendSettings"></setting-title>
    <form-error message="The backend authentication is completed"></form-error>
    <form-success message="The backend authentication is failed."></form-success>
    <i class="ui notched circle loading icon"></i>
    <form class="ui large form">
      <form-input formType="baseUrl"></form-input>
    </form>
  </div>
</template>
<style>
  #content {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
<script>
  import settingTitle from './setting/title.vue';
  import formError from './setting/formError.vue';
  import formSuccess from './setting/formSuccess.vue';
  import formInput from './setting/formInput.vue';
  export default {
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
