<template>
  <div class="app-main">
    <div class="d-flex flex-column fill-height">
      <div class="flex content">
        <add-game v-if="!gamesSetting.games.length" :selectedGamePath="selectedGamePath"/>

        <div v-else class="d-flex flex-row fill-height">
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
                v-for="(game, index) in gamesSetting.games"
                :key="`${index}-${game.base}-${game.type}`"
                link
                two-line
                color="primary"
                :class="{'v-list-item--active': index === gamesSetting.current}"
              >
                <v-list-item-avatar>
                  <v-icon>videogame_asset</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{game.name}}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{game.path}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <div class="flex">
            <manager-panel v-if="gamesSetting.current !== null"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AddGame from '@/components/AddGame.vue';
import ManagerPanel from '@/components/ManagerPanel.vue';

export default {
  name: 'AppMain',

  components: {
    AddGame,
    ManagerPanel,
  },

  data: () => ({
    selectedGamePath: null,
  }),

  computed: {
    ...mapState([
      'gamesSetting',
    ]),
  },

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
        this.readGamesSetting();
      });
    },
    readGamesSetting() {
      this.$store.dispatch('readGamesSetting');
    },
    openDevtools() {
      this.$ipcRenderer.send('devtools');
    },
    onMounted() {
      this.onSelectGamePath();
      this.onInstallAddonDone();
      this.readGamesSetting();
    },
    onUnmounted() {
      //
    },
  },

  mounted() {
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
