<template>
<div>
  <setting-backend></setting-backend>

  <setting-trello></setting-trello>

  <setting-webhooks></setting-webhooks>
</div>
</template>
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
