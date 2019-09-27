<template>
  <div class="dashboard pa-4">
    <h1>WoW 管理器</h1>

    <div class="d-flex flex-row flex-wrap">
      <v-card
        outlined
        v-for="(game, index) in gamesSetting.games"
        :key="`${index}-${game.base}-${game.type}`"
        class="game-card flex ma-2"
        @click="gameDetail(index)"
      >
        <v-card-title>{{game.name}}</v-card-title>

        <v-card-text>
          <div>已安装插件: {{game.addons.length}} 个</div>
        </v-card-text>
      </v-card>

      <v-card
        outlined
        class="game-card flex ma-2"
        @click="addNewGame"
      >
        <v-card-title>添加游戏</v-card-title>

        <v-card-text>
          新增并管理一个游戏
        </v-card-text>
      </v-card>
    </div>

    <div class="open-devtools">
      <v-btn icon elevation="4" @click="openDevtools">
        <v-icon>code</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'dashboard',

  computed: {
    ...mapState([
      'gamesSetting',
    ]),
  },

  methods: {
    openDevtools() {
      this.$ipcRenderer.send('devtools');
    },
    gameDetail(gameIndex) {
      this.$parent.switchNav(gameIndex);
    },
    addNewGame() {
      this.$parent.addNewGame(true);
    },
  },
};
</script>

<style scoped>
  .open-devtools {
    position: fixed;
    right: 8px;
    bottom: 8px;
  }
</style>
