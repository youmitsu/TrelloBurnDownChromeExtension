  <template>
<v-container>
  <v-icon>
    {{loadResultIcon}}
  </v-icon>
  <v-form v-model="valid">
    <v-text-field
      v-model="devKey"
      label="Developer Key"
      required
      :loading="isLoading"
    ></v-text-field>
    <v-btn
      v-if="!devKey"
      @click="openKeyPage"
    >
       <v-icon left>input</v-icon>
       GET YOUR DEVKEY
    </v-btn>
    <v-text-field
      :type="tokenInputType"
      v-model="token"
      label="Token"
      required
      :append-icon="maskingIcon"
      :loading="isLoading"
      v-if="!!devKey"
      @click:append="toggleTrelloMask"
    ></v-text-field>
    <v-btn
      v-if="devKey && !token"
      @click="openTokenPage"
    >
       <v-icon left>input</v-icon>
       GET YOUR TOKEN
    </v-btn>
  </v-form>
</v-container>
</template>
<script>
import * as Tab from '../lib/tabUtil.js';
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';
export default {
  data: function() {
    return {
      valid: false,
      shouldTokenMasking: true
    }
  },
  computed: {
    devKey: {
      get() {
        return this.$store.state.trelloAuth.devKey;
      },
      set(value) {
        this.$store.dispatch('validateTrelloDevKey', value);
      }
    },
    token: {
      get() {
        return this.$store.state.trelloAuth.token;
      },
      set(value) {
        this.$store.dispatch('validateTrelloToken', value);
      }
    },
    maskingIcon() {
      return this.shouldTokenMasking ? "visibility" : "visibility_off";
    },
    tokenInputType() {
      return this.shouldTokenMasking ? "password" : "text";
    },
    loadResultIcon() {
      if(this.$store.state.trelloAuth.status == SUCCESS) {
        return "check";
      } else if (this.$store.state.trelloAuth.status == FAILED) {
        return "error";
      }
      return "";
    },
    isLoading() {
      return !!this.$store.state.trelloAuth.loading;
    }
  },
  methods: {
    toggleTrelloMask() {
      if(this.shouldTokenMasking) {
        this.shouldTokenMasking = false;
      } else {
        this.shouldTokenMasking = true;
      }
    },
    openKeyPage(context) {
      Tab.openOuterBrowser("https://trello.com/1/appKey/generate");
    },
    openTokenPage({state}) {
      Tab.openOuterBrowser(`https://trello.com/1/authorize?expiration=never&name=&scope=read,write&response_type=token&key=${this.$store.state.trelloAuth.devKey}`);
    },
  }
}
</script>
