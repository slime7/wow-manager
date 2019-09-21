<template>
  <v-layout align-center justify-center fill-height class="add-game">
    <v-flex xs12 sm9 md8>
      <v-stepper v-model="addGameStep">
        <v-stepper-header>
          <v-stepper-step
            :complete="addGameStep > 1"
            step="1"
          >
            定位游戏位置
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="addGameStep > 2"
            step="2"
          >
            选择游戏版本
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            step="3"
          >
            确认内容
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <div>
              <v-text-field
                label="游戏路径"
                filled
                readonly
                :error="!!gamePathSelectorError"
                :error-messages="gamePathSelectorError || ''"
                :value="showGamePath()"
                @click="selectGamePath"
              ></v-text-field>
            </div>

            <div class="mb-1">
              <v-btn color="primary" @click="submitGamePath">继续</v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div>
              <v-select
                :items="gameTypeItems"
                filled
                label="游戏类型"
                v-model="gameType"
              ></v-select>
            </div>

            <div class="mb-1">
              <v-btn color="primary" @click="submitGameType">继续</v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div v-if="gameType">
              <div>{{gameBase}}</div>
              <div>{{gameTypes[gameType]}}</div>

              <v-text-field
                label="起名"
                filled
                v-model="gameInstanceName"
              ></v-text-field>
            </div>

            <div class="mb-1">
              <v-btn color="primary" @click="submitAddGame">完成</v-btn>
              <v-btn class="ml-2" @click="reset">重新选择</v-btn>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-flex>
  </v-layout>
</template>

<script>
import Store from 'electron-store';
import { gameTypes, storeSetting } from '@/utils/constants';

export default {
  name: 'AddGame',

  props: {
    selectedGamePath: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
  },

  data: () => ({
    gameTypes,
    gameTypeItems: [
      { text: gameTypes.classic, value: 'classic' },
      { text: gameTypes.retail, value: 'retail' },
    ],
    gamesStoreOld: null,
    addGameStep: 1,
    gameType: null,
    gameBase: '',
    gamePathSelectorError: false,
    gameInstanceName: '',
  }),

  methods: {
    selectGamePath() {
      this.gameType = null;
      this.gameBase = '';
      this.$ipcRenderer.send('select-game-path');
    },
    showGamePath() {
      if (!this.selectedGamePath) {
        return '';
      }
      if (this.selectedGamePath.root !== '/') {
        return `${this.selectedGamePath.dir}\\${this.selectedGamePath.base}`;
      }
      return `${this.selectedGamePath.dir}/${this.selectedGamePath.base}`;
    },
    reset() {
      this.gameType = null;
      this.gameBase = '';
      this.addGameStep = 1;
    },
    submitGamePath() {
      this.gamePathSelectorError = false;

      if (this.selectedGamePath.base === '_classic_') {
        this.gameType = 'classic';
        this.gameBase = this.selectedGamePath.dir;
        this.addGameStep = 3;
        return;
      }
      if (this.selectedGamePath.base === '_retail_') {
        this.gameType = 'retail';
        this.gameBase = this.selectedGamePath.dir;
        this.addGameStep = 3;
        return;
      }

      if (this.selectedGamePath.sub.classic || this.selectedGamePath.sub.retail) {
        this.gameBase = this.showGamePath();
        this.addGameStep = 2;
      } else {
        this.gamePathSelectorError = '似乎不是 wow 游戏目录';
      }
    },
    submitGameType() {
      if (this.gameType) {
        this.addGameStep = 3;
        this.gameInstanceNameGenerator();
      }
    },
    submitAddGame() {
      const store = new Store(storeSetting);
      const newGames = Object.assign({}, this.gamesStoreOld);
      newGames.games.push({
        name: this.gameInstanceName,
        path: this.gameBase,
        type: this.gameType,
        addons: [],
      });
      newGames.current = newGames.games.length - 1;
      store.set('gameInstances', newGames);
      this.$parent.readGameSetting();
    },
    gameInstanceNameGenerator() {
      const name = `wow ${this.gameTypes[this.gameType]}`;
      if (this.gamesStoreOld.games.length) {
        const dup = this.gamesStoreOld.games.find(g => g.name === `${name} 1`);
        if (dup) {
          const num = +dup.name.match(/ (\d+)$/)[1];
          this.gameInstanceName = `${name} ${num + 1}`;
        }
      }
      this.gameInstanceName = `${name} 1`;
    },
  },
  mounted() {
    const store = new Store(storeSetting);
    this.gamesStoreOld = store.get('gameInstances', { current: null, games: [] });
  },
};
</script>
