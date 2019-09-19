<template>
  <div class="app-main">
    <v-layout column fill-height>
      <v-flex class="content">
        <add-game v-if="!games.games.length" :selectedGamePath="selectedGamePath"/>

        <div v-else>
          <pre>{{JSON.stringify(games, null, '  ')}}</pre>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Store from 'electron-store';
import AddGame from '@/components/AddGame.vue';

export default {
  name: 'AppMain',

  components: {
    AddGame,
  },

  data: () => ({
    selectedGamePath: null,
    games: { current: null, games: [] },
  }),

  methods: {
    onSelectGamePath() {
      this.$ipcRenderer.on('select-game-path', (gamePath) => {
        if (gamePath) {
          this.selectedGamePath = gamePath;
        }
      });
    },
    readGameSetting() {
      const store = new Store();
      this.games = store.get('gameInstances', { current: null, games: [] });
    },
    onMounted() {
      this.onSelectGamePath();
    },
    onUnmounted() {
      //
    },
  },

  mounted() {
    this.readGameSetting();
    this.onMounted();
  },

  destroyed() {
    this.onUnmounted();
  },
};
</script>

<style scoped>
  .app-main {
    height: 100%;
  }

  pre {
    overflow: auto;
  }

  .content {
    min-height: 0;
    overflow-y: auto;
  }
</style>
