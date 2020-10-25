<template>
  <div class="d-flex flex-column manager-panel">
    <div>
      <v-tabs v-model="tab">
        <v-tab>信息</v-tab>
        <v-tab>插件</v-tab>
        <v-tab>工具</v-tab>
      </v-tabs>
    </div>

    <v-divider></v-divider>

    <div class="flex flex-scroll-y">
      <v-tabs-items v-model="tab" class="fill-height">
        <v-tab-item>
          <v-card
            flat
            tile
          >
            <v-card-title>
              <span
                @click="startEditName"
                v-show="!editingName"
              >{{currentGame.name}}</span>
              <v-text-field
                hide-details
                autofocus
                solo
                v-model="gameName"
                @keydown="submitEditName"
                @blur="submitEditName"
                v-show="editingName"
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <div>
                <span>游戏位置: </span>
                <a @click="openGameFolder">{{currentGame.path}}</a>
              </div>
              <div>游戏模式: {{gameTypes[currentGame.type]}}</div>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <addon-manager/>
        </v-tab-item>

        <v-tab-item>
          <game-tools/>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron';
import { mapGetters } from 'vuex';
import { gameTypes } from '@/utils/constants';
import AddonManager from '@/components/ManagerPanel/AddonManager.vue';
import GameTools from '@/components/ManagerPanel/GameTools.vue';

export default {
  name: 'ManagerPanel',

  components: {
    GameTools,
    AddonManager,
  },

  data: () => ({
    tab: 0,
    gameTypes,
    editingName: false,
    gameName: '',
  }),

  computed: {
    ...mapGetters([
      'currentGame',
    ]),
  },

  methods: {
    startEditName() {
      this.gameName = this.currentGame.name;
      this.editingName = true;
    },
    submitEditName(ev) {
      if (ev.type === 'keydown' && ev.keyCode === 13) {
        this.editingName = false;
        if (this.gameName !== this.currentGame.name) {
          this.$store.dispatch('renameGameName', { name: this.gameName });
        }
      }
      if (ev.type === 'keydown' && ev.keyCode === 27) {
        this.editingName = false;
      }
      if (ev.type === 'blur') {
        this.editingName = false;
      }
    },
    openGameFolder() {
      shell.openExternal(this.currentGame.path);
    },
  },
};
</script>
