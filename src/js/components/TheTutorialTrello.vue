  <template>
<v-container>
  <v-form v-model="valid">
    <v-text-field
      v-model="devKey"
      label="Developer Key"
      :rules="rules"
      required
      :loading="isLoading"
    ></v-text-field>
    <v-text-field
      :type="tokenInputType"
      v-model="token"
      label="Token"
      :rules="rules"
      required
      :append-icon="maskingIcon"
      :append-outer-icon="loadResultIcon"
      :loading="isLoading"
      v-if="devKeyState"
      @click:append="toggleTrelloMask"
    ></v-text-field>
  </v-form>
</v-container>
</template>
<script>
import { SUCCESS, FAILED, DEFAULT } from '../common/loadStatusType.js';
export default {
  data: function() {
    return {
      valid: false,
      rules: [
        value => !!value || 'Required'
      ],
      shouldTokenMasking: true
    }
  },
  computed: {
    devKey: {
      get() {
        return this.$store.state.trelloAuth.devKey;
      },
      set(value) {
        //this.$store.dispatch('checkServer', value);
      }
    },
    devKeyState() {
      return this.$store.state.setting.trelloAuth.devKey;
    },
    token: {
      get() {
        return this.$store.state.trelloAuth.token;
      },
      set(value) {
        //this.$store.dispatch('checkServer', value);
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
    }
  }
}
</script>
