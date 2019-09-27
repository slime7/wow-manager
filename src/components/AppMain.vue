<template>
  <div class="app-main">
    <div class="d-flex flex-column fill-height">
      <div class="flex content">
        <add-game
          v-if="!gamesSetting.games.length || addingGame"
          :selectedGamePath="selectedGamePath"
          :first="!gamesSetting.games.length"
        />

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
                @click="switchNav(-1)"
                :class="{'v-list-item--active': dashboardView}"
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
                @click="switchNav(index)"
                :class="{'v-list-item--active': index === gamesSetting.current && !dashboardView}"
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
            <dashboard v-if="dashboardView"/>
            <manager-panel v-if="!dashboardView && gamesSetting.current !== null"/>
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
import Dashboard from '@/components/dashboard.vue';

export default {
  name: 'AppMain',

  components: {
    Dashboard,
    AddGame,
    ManagerPanel,
  },

  data: () => ({
    selectedGamePath: null,
    dashboardView: false,
    addingGame: false,
  }),

  computed: {
    ...mapState([
      'gamesSetting',
    ]),
  },

  methods: {
    switchNav(nav) {
      if (nav < 0) {
        this.dashboardView = true;
      } else {
        this.dashboardView = false;
        if (this.gamesSetting.current !== nav) {
          this.$store.dispatch('switchGame', { gameIndex: nav });
        }
      }
    },
    addNewGame(on) {
      this.addingGame = !!on;
    },
    onSelectGamePath() {
      this.$ipcRenderer.on('select-game-path', (gamePath) => {
        if (gamePath) {
          this.selectedGamePath = gamePath;
        }
      });
    },
    unSelectGamePath() {
      this.$ipcRenderer.detach('select-game-path');
    },
    onInstallAddonReply() {
      this.$ipcRenderer.on('install-addon', (reply) => {
        this.$store.dispatch('installingAddonStateChange', reply);
      });
    },
    unInstallAddonReply() {
      this.$ipcRenderer.detach('install-addon');
    },
    onDeleteAddonReply() {
      this.$ipcRenderer.on('delete-addon', (reply) => {
        this.$store.dispatch('deleteAddon', reply);
      });
    },
    unDeleteAddonReply() {
      this.$ipcRenderer.detach('delete-addon');
    },
    readGamesSetting() {
      this.$store.dispatch('readGamesSetting');
    },
    onMounted() {
      this.onSelectGamePath();
      this.onInstallAddonReply();
      this.onDeleteAddonReply();
      this.readGamesSetting();
    },
    onUnmounted() {
      this.unSelectGamePath();
      this.unInstallAddonReply();
      this.unDeleteAddonReply();
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
