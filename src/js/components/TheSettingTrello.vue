<template>
  <div id="content">
    <setting-title title="TrelloAuthentication"></setting-title>
    <form-success message="The Trello authentication is completed" v-if="isLoadingSuccess"></form-success>
    <form-error message="The Trello authentication is failed." v-if="isLoadingError"></form-error>
    <i class="ui notched circle loading icon" v-if="isLoading"></i>
    <form class="ui large form">
      <form-input formType="devKey" v-bind:isLoading="isLoading" v-bind:dataState="devKeyState" actionNameSpace="setting/validateDevKey"></form-input>
      <div class="ui button" v-if="!devKeyState" @click="openKeyPage">Get the developer key</div>
      <form-input formType="token" v-bind:isLoading="isLoading" v-bind:dataState="tokenState" actionNameSpace="setting/validateTrelloAuth" v-if="devKeyState"></form-input>
      <div class="ui button" v-if="devKeyState && !tokenState" @click="openTokenPage">Get the token</div>
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
        return this.$store.getters['setting/isTrelloLoadingError'];
      },
      isLoadingSuccess() {
        return this.$store.getters['setting/isTrelloLoadingSuccess'];
      },
      isLoading() {
        return this.$store.state.setting.trelloAuth.loading;
      },
      devKeyState() {
        return this.$store.state.setting.trelloAuth.devKey;
      },
      tokenState() {
        return this.$store.state.setting.trelloAuth.token;
      }
    },
    methods: {
      openKeyPage() {
        this.$store.dispatch('setting/openKeyPage');
      },
      openTokenPage() {
        this.$store.dispatch('setting/openTokenPage');
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
