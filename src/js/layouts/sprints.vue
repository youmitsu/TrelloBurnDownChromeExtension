<template>
<div>
  <v-toolbar
    color="transparent"
    scroll-off-screen
    scroll-target="#scrolling-target"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Sprints</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-container id="scrolling-target">
    <v-expansion-panel>
      <v-expansion-panel-content
        v-for="(item,i) in 5"
        :key="i"
      >
        <div slot="header">Item</div>
        <v-card>
          <v-list two-line>
            <template v-for="(itemm,i) in 5">
              <v-list-tile
                  :key="i"
                  avatar
                  @click=""
                >
                <v-list-tile-content>
                  <v-list-tile-title></v-list-tile-title>
                  <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</div>
</template>
<script>
</script>
