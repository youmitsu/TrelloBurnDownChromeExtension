<template>
<div>
  <v-toolbar
    color="transparent"
    scroll-off-screen
    scroll-target="#scrolling-target"
  >
    <v-btn icon @click="back">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title>New Sprint</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="save">
      <v-icon>done</v-icon>
    </v-btn>
  </v-toolbar>
  <v-container
    id="scrolling-target"
    fluid
  >
    <v-form>
      <v-flex xs12 sm12 d-flex>
        <v-select
          :items="boardList"
          label="Board"
          item-text="boardName"
          item-value="boardId"
          v-model="selectedBoard"
          return-object
        ></v-select>
      </v-flex>
      <v-text-field
        v-model="name"
        :counter="30"
        label="Name"
        required
      ></v-text-field>
      <v-flex>
        <v-menu
          ref="startDateMenu"
          :close-on-content-click="false"
          v-model="startDateMenu"
          :nudge-right="40"
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
            label="StartDate"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="startDate" @input="$refs.startDateMenu.save(startDate)"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="endDateMenu"
          :close-on-content-click="false"
          v-model="endDateMenu"
          :nudge-right="40"
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
            label="EndDate"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="endDate" @input="$refs.endDateMenu.save(endDate)"></v-date-picker>
        </v-menu>
      </v-flex>
    <v-flex>
      <v-menu
        ref="holidayMenu"
        :close-on-content-click="false"
        v-model="holidayMenu"
        :nudge-right="40"
        :return-value.sync="holidays"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <v-combobox
          slot="activator"
          v-model="holidays"
          multiple
          chips
          small-chips
          label="Holidays"
          prepend-icon="event"
          readonly
        ></v-combobox>
        <v-date-picker v-model="holidays" multiple no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="holidayMenu = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.holidayMenu.save(holidays)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-form>
  </v-container>
</div>
</template>
<script>
export default {
  data() {
    return {
      selectedBoard: null,
      name: null,
      startDateMenu: false,
      endDateMenu: false,
      holidayMenu: false,
      startDate: null,
      endDate: null,
      holidays: []
    }
  },
  mounted() {
    this.$store.dispatch('graph/loadBoardList')
      .then(() => {
      });
  },
  computed: {
    boardList() {
      return this.$store.getters['graph/boardList'];
    }
  },
  methods: {
    back() {
      this.$store.commit('SET_CURRENT_VIEW', {
        isHome: true,
        view: 'graph'
      });
    },
    selectBoard() {

    },
    save() {
      this.$store.dispatch('graph/saveSprint', {
        board: this.selectedBoard,
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        holidays: this.holidays,
        isSelected: false
      });
    }
  }
}
</script>
