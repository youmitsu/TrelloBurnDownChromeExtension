<template>
<div id="content">
  <setting-backend></setting-backend>

  <setting-trello></setting-trello>

  <setting-webhooks></setting-webhooks>
</div>
</template>
<style scoped>
  #content {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
<script>
import settingBackend from '../components/TheSettingBackend.vue';
import settingTrello from '../components/TheSettingTrello.vue';
import settingWebhooks from '../components/TheSettingWebhooks.vue';

export default {
  components: {
    "setting-backend": settingBackend,
    "setting-trello": settingTrello,
    "setting-webhooks": settingWebhooks
  }
}
</script>
