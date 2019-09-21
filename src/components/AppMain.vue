<template>
  <div class="app-main">
    <v-layout column fill-height>
      <v-flex class="content">
        <add-game v-if="!games.games.length" :selectedGamePath="selectedGamePath"/>

        <v-layout v-else fill-height>
          <v-navigation-drawer
            permanent
            stateless
            width="250"
            style="min-width: 250px"
          >
            <v-list
              dense
              nav
            >
              <v-list-item
                link
                color="primary"
                @click="openDevtools"
              >
                <v-list-item-icon>
                  <v-icon>dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-title>首页</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-for="(game, index) in games.games"
                :key="`${index}-${game.base}-${game.type}`"
                link
                two-line
                color="primary"
                :class="{'v-list-item--active': index === games.current}"
              >
                <v-list-item-avatar>
                  <v-icon>videogame_asset</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{index + 1}}.{{gameTypes[game.type]}}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{game.path}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-flex>
            <manager-panel :game="games.games[games.current]" v-if="games.current !== null"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Store from 'electron-store';
import { gameTypes } from '@/utils/constants';
import AddGame from '@/components/AddGame.vue';
import ManagerPanel from '@/components/ManagerPanel.vue';

export default {
  name: 'AppMain',

  components: {
    AddGame,
    ManagerPanel,
  },

  data: () => ({
    gameTypes,
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
    onInstallAddonDone() {
      this.$ipcRenderer.on('install-addon-done', () => {
        console.log('addon installed.');
        this.readGameSetting();
      });
    },
    readGameSetting() {
      const store = new Store();
      this.games = store.get('gameInstances', { current: null, games: [] });
    },
    openDevtools() {
      this.$ipcRenderer.send('devtools');
    },
    onMounted() {
      this.onSelectGamePath();
      this.onInstallAddonDone();
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

  .games-list {
    width: 180px;
  }
</style>
