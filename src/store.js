import Vue from 'vue';
import Vuex from 'vuex';
import Store from 'electron-store';
import { storeSetting, gameVersions } from '@/utils/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gamesSetting: { current: null, games: [] },
  },

  getters: {
    currentGame: state => state.gamesSetting.games[state.gamesSetting.current],
    currentGameVersion: (state, getters) => gameVersions[getters.currentGame.type],
  },

  mutations: {
    updateGamesSetting(state, { current, games }) {
      if (typeof current !== 'undefined') {
        state.gamesSetting.current = current;
      }
      if (games) {
        state.gamesSetting.games = games;
      }
    },
    pushGame(state, { game }) {
      state.gamesSetting.games.push(game);
    },
    updateCurrentGame(state, {
      name,
      path,
      type,
      addons,
    }) {
      if (name) {
        state.gamesSetting.games[state.gamesSetting.current].name = name;
      }
      if (path) {
        state.gamesSetting.games[state.gamesSetting.current].path = path;
      }
      if (type) {
        state.gamesSetting.games[state.gamesSetting.current].type = type;
      }
      if (addons) {
        state.gamesSetting.games[state.gamesSetting.current].addons = addons;
      }
    },
    pushAddon(state, { addon }) {
      state.gamesSetting.games[state.gamesSetting.current].addons.push(addon);
    },
    updateAddon(state, { addonIndex, newAddon }) {
      state.gamesSetting.games[state.gamesSetting.current].addons[addonIndex] = newAddon;
    },
  },
  actions: {
    readGamesSetting({ commit }) {
      const store = new Store(storeSetting);
      const gameInstances = store.get('gameInstances', { current: null, games: [] });
      commit('updateGamesSetting', gameInstances);
    },
    mergeAddonUpdateResult({ state, getters, commit }, { updateResult }) {
      let updateCount = 0;
      updateResult.forEach((addon) => {
        const ind = getters.currentGame.addons.findIndex(a => a.id === addon.id);
        const newAddon = Object.assign({}, getters.currentGame.addons[ind]);
        if (ind !== -1 && addon.file.version !== newAddon.file.version) {
          newAddon.new = addon.file;
          commit('updateAddon', { addonIndex: ind, newAddon });
          updateCount += 1;
        }

        if (updateCount) {
          const store = new Store(storeSetting);
          store.set('gameInstances.games', state.gamesSetting.games);
        }
      });
    },
    renameGameName({ state, commit }, { name }) {
      if (typeof name === 'string' && name !== '') {
        commit('updateCurrentGame', { name });
        const store = new Store(storeSetting);
        store.set('gameInstances.games', state.gamesSetting.games);
      }
    },
  },
});
