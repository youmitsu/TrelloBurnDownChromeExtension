<template>
  <div>
    <setting-title title="TrelloAuthentication"></setting-title>
    <form-error message="The Trello authentication is completed"></form-error>
    <form-success message="The Trello authentication is failed."></form-success>
    <i class="ui notched circle loading icon"></i>
    <form class="ui large form">
      <!-- <div class="ui button" v-if="!trelloAuth.token" v-on:click="openTokenPage">Get the token</div> -->
      <form-input formType="devKey"></form-input>
      <!-- <div class="ui button" v-if="!trelloAuth.token" v-on:click="openTokenPage">Get the token</div> -->
      <form-input formType="token"></form-input>
    </form>
  </div>
</template>
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
