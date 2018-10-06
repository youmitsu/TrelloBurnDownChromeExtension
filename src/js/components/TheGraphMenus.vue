<template>
<v-toolbar dark color="primary">
  <v-toolbar-side-icon></v-toolbar-side-icon>
  <v-toolbar-title>Chart</v-toolbar-title>
  <!-- <v-flex xs12 sm6 d-flex>
    <v-select
      v-model="selectedBoard"
      :items="boardList"
      item-text="boardName"
      item-value="boardId"
      :loading="isLoading"
      :disabled="isLoadingError"
      return-object
      ></v-select>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu
        ref="startMenu"
        :close-on-content-click="false"
        v-model="startMenu"
        :nudge-right="60"
        :return-value.sync="startDate"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
    >
        <v-text-field
          slot="activator"
          v-model="startDate"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="startDate" @input="$refs.startMenu.save(startDate)"></v-date-picker>
    </v-menu>
  </v-flex>
  <v-flex xs3 sm3 md3>
    <v-menu
        ref="endMenu"
        :close-on-content-click="false"
        v-model="endMenu"
        :nudge-right="60"
        :return-value.sync="endDate"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
    >
        <v-text-field
          slot="activator"
          v-model="endDate"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="endDate" @input="$refs.endMenu.save(endDate)"></v-date-picker>
    </v-menu>
  </v-flex>-->
  <v-spacer></v-spacer>
  <v-btn icon>
    <v-icon @click="reload">sync</v-icon>
  </v-btn>
  <v-btn icon>
    <v-icon @click="reload">settings_input_composite</v-icon>
  </v-btn>
</v-toolbar>
</template>
<script>
export default {
  data() {
    return {
      startMenu: false,
      endMenu: false
    }
  },
  computed: {
    boardList() {
      return this.$store.state.graph.boardItems;
    },
    selectedBoard: {
      get() {
        return this.$store.state.graph.selectedBoard;
      },
      set(value) {
        this.$store.commit('graph/SET_SELECT_BOARD', value);
      }
    },
    isLoading() {
      return this.$store.state.graph.boardLoadState.loading;
    },
    isLoadingError() {
      return this.$store.getters['graph/isLoadingError'];
    },
    startDate: {
      get() {
        return this.$store.state.graph.graph.startDate;
      },
      set(value) {
        this.$store.commit('graph/SET_START_DATE', value);
      }
    },
    endDate: {
      get() {
        return this.$store.state.graph.graph.endDate;
      },
      set(value) {
        this.$store.commit('graph/SET_END_DATE', value);
      }
    },
    holidays: {
      get() {
        return this.$store.state.graph.graph.holidays;
      },
      set(value) {
        this.$store.commit('graph/SET_HOLIDAYS', value);
      }
    }
  },
  methods: {
    reload() {
      this.$store.dispatch('graph/reload');
    }
  }
}
</script>
