<template>
<div id="content">

  <!-- <setting-menu></setting-menu> -->
  <v-toolbar
    color="transparent"
    scroll-off-screen
    scroll-target="#scrolling-target"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Setting</v-toolbar-title>
  </v-toolbar>

  <div
    id="scrolling-target"
    class="scroll-y"
    style="max-height: 600px;"
  >
    <v-container style="height: 1000px;">
      <setting-backend></setting-backend>
      <setting-trello></setting-trello>
      <setting-webhooks></setting-webhooks>
    </v-container>
  </div>
</div>
</template>
<script>
import settingMenu from '../components/TheSettingMenu.vue';
import settingBackend from '../components/TheSettingBackend.vue';
import settingTrello from '../components/TheSettingTrello.vue';
import settingWebhooks from '../components/TheSettingWebhooks.vue';

export default {
  components: {
    "setting-menu": settingMenu,
    "setting-backend": settingBackend,
    "setting-trello": settingTrello,
    "setting-webhooks": settingWebhooks
  }
}
</script>
