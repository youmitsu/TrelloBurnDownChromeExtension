<template>
<v-toolbar
  color="transparent"
  extended
>
  <v-toolbar-side-icon></v-toolbar-side-icon>
  <v-toolbar-title>Graph</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-btn icon>
    <v-icon>add</v-icon>
  </v-btn>
  <v-btn icon>
    <v-icon @click="reload">sync</v-icon>
  </v-btn>
  <v-flex slot="extension" xs12 sm6 d-flex>
    <v-select
      v-model="selectedBoard"
      :items="boardList"
      label="Board"
      item-text="boardName"
      item-value="boardId"
      :loading="isLoading"
      :disabled="isLoadingError"
      return-object
      ></v-select>
  </v-flex>
  <v-flex slot="extension" xs3 sm3 md3>
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
          label="Start"
          readonly
        ></v-text-field>
        <v-date-picker v-model="startDate" @input="$refs.startMenu.save(startDate)"></v-date-picker>
    </v-menu>
  </v-flex>
  <v-flex slot="extension" xs3 sm3 md3>
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
          label="End"
          readonly
        ></v-text-field>
        <v-date-picker v-model="endDate" @input="$refs.endMenu.save(endDate)"></v-date-picker>
    </v-menu>
  </v-flex>
  <v-menu slot="extension" bottom left>
    <v-btn icon slot="activator">
      <v-icon>subject</v-icon>
    </v-btn>
    <v-card class="pa-1">
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex>
            <v-card color="blue-grey darken-2 pa-2" class="white--text">
              <v-card-title primary-title>
                <div class="headline">Holidays</div>
              </v-card-title>
              <v-date-picker
                v-model="holidays"
                multiple
              ></v-date-picker>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-menu>
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
      return this.$store.getters['graph/boardList'];
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
        return this.$store.getters['graph/holidaysArr'];
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
