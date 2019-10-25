<template>
  <v-card
    flat
    tile
    class="game-tools">
    <v-list-item link v-show="false">
      <v-list-item-content>
        <v-list-item-title>替换字体</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      @click="overrideArchive('0')"
    >
      <v-list-item-content>
        <v-list-item-title>反和谐</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">info</v-icon>
          </template>
          <span>需要重启游戏</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>

    <v-list-item
      @click="profanityFilter('0')"
    >
      <v-list-item-content>
        <v-list-item-title>关闭语言过滤</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">info</v-icon>
          </template>
          <span>需要重启游戏</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'GameTools',

  computed: {
    ...mapGetters([
      'currentGame',
    ]),
  },

  methods: {
    setGameConfig(config) {
      this.$ipcRenderer.send('edit-game-config', {
        gameConfig: config,
        gamePath: this.currentGame.path,
        gameType: this.currentGame.type,
      });
    },
    overrideArchive(value) {
      this.setGameConfig({
        key: 'overrideArchive',
        value,
      });
    },
    profanityFilter(value) {
      this.setGameConfig({
        key: 'profanityFilter',
        value,
      });
    },
  },
};
</script>
