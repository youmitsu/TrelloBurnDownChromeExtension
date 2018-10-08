<template>
  <div id="content">
    <setting-title title="BackendSettings"></setting-title>
    <form-success message="The backend authentication is completed" v-if="isLoadingSuccess"></form-success>
    <form-error message="The backend authentication is failed." v-if="isLoadingError"></form-error>
    <i class="ui notched circle loading icon" v-if="isLoading"></i>
    <form class="ui large form">
      <form-input formType="baseUrl" v-bind:isLoading="isLoading" v-bind:dataState="serverState" actionNameSpace="setting/validateBaseUrl"></form-input>
    </form>
  </div>
</template>
<script>
  import settingTitle from './base/BaseTitle.vue';
  import formError from './base/BaseFormError.vue';
  import formSuccess from './base/BaseFormSuccess.vue';
  import formInput from './base/BaseFormInput.vue';
  export default {
    computed: {
      isLoadingError() {
        return this.$store.getters['setting/isLoadingError'];
      },
      isLoadingSuccess() {
        return this.$store.getters['setting/isLoadingSuccess'];
      },
      isLoading() {
        return this.$store.state.setting.serverAuth.loading;
      },
      serverState() {
        return this.$store.state.setting.serverAuth.baseUrl;
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
