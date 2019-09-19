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

            <div>
              <v-btn color="primary" @click="submitGamePath">继续</v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div>
              <v-select
                :items="gameTypes"
                filled
                label="游戏类型"
                v-model="gameType"
              ></v-select>
            </div>

            <div>
              <v-btn color="primary" @click="submitGameType">继续</v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div v-if="gameType">
              <p>{{gameBase}}</p>
              <p>{{gameTypes.find(t => t.value === gameType).text}}</p>
            </div>

            <div>
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

export default {
  name: 'AddGame',

  props: {
    selectedGamePath: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
  },

  data: () => ({
    gameTypes: [
      { text: '怀旧服', value: 'classic' },
      { text: '正式服', value: 'retail' },
    ],
    addGameStep: 1,
    gameType: null,
    gameBase: '',
    gamePathSelectorError: false,
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
      }
    },
    submitAddGame() {
      const store = new Store();
      const oldGames = store.get('gameInstances', { current: null, games: [] });
      const newGames = Object.assign({}, oldGames);
      newGames.games.push({
        path: this.gameBase,
        type: this.gameType,
        addOns: [],
      });
      newGames.current = newGames.games.length - 1;
      store.set('gameInstances', newGames);
      this.$parent.readGameSetting();
    },
  },
};
</script>
