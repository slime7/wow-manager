import Vue from 'vue';
import Vuex from 'vuex';
import Store from 'electron-store';
import { storeSetting, gameVersions } from '@/utils/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gamesSetting: { current: null, games: [] },
    installingAddons: [],
  },

  getters: {
    currentGame: state => state.gamesSetting.games[state.gamesSetting.current],
    currentGameVersion: (state, getters) => gameVersions[getters.currentGame.type],
    addonDownloadProgress: state => (id) => {
      const downloadingAddon = state.installingAddons.find(a => a.id === id);
      if (!downloadingAddon) {
        return -1;
      }
      return downloadingAddon.received / downloadingAddon.total;
    },
    addonStatus: state => (addon) => {
      if (!addon.file) {
        return 'no-file';
      }
      if (addon.new) {
        return 'can-be-updated';
      }

      const current = state.gamesSetting.games[state.gamesSetting.current];
      const installedAddon = current.addons.find(a => a.id === addon.id);
      if (installedAddon) {
        return installedAddon.file.version === addon.file.version ? 'no-update' : 'can-be-updated';
      }
      return 'not-installed';
    },
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
    updateAddon(state, { newAddon }) {
      state.gamesSetting.games[state.gamesSetting.current].addons = [
        ...state.gamesSetting.games[state.gamesSetting.current].addons
          .filter(a => a.id !== newAddon.id),
        newAddon,
      ];
    },
    removeAddon(state, { addonId }) {
      state.gamesSetting.games[state.gamesSetting.current].addons = [
        ...state.gamesSetting.games[state.gamesSetting.current].addons
          .filter(a => a.id !== addonId),
      ];
    },
    pushInstallingAddon(state, { addonId }) {
      state.installingAddons.push({
        id: addonId,
        state: 'start',
        reason: null,
        received: 0,
        total: 1,
      });
    },
    updateInstallingAddon(state, addonState) {
      const ind = state.installingAddons.findIndex(a => a.id === addonState.addonId);
      state.installingAddons[ind].state = addonState.state;
      if (addonState.reason) {
        state.installingAddons[ind].reason = addonState.reason;
      }
      if (addonState.received) {
        state.installingAddons[ind].received = addonState.received;
      }
      if (addonState.total) {
        state.installingAddons[ind].total = addonState.total;
      }
    },
    removeInstallingAddon(state, { addonId }) {
      const ind = state.installingAddons.findIndex(a => a.id === addonId);
      if (ind >= 0) {
        state.installingAddons.splice(ind, 1);
      }
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
          commit('updateAddon', { newAddon });
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
    installAddon({ state, commit }, { id }) {
      const isExists = state.installingAddons.findIndex(a => a.id === id);
      if (isExists >= 0) {
        commit('removeInstallingAddon', { addonId: id });
      }
      commit('pushInstallingAddon', { addonId: id });
    },
    installingAddonStateChange({ state, commit }, addonState) {
      if (addonState.state !== 'installed') {
        commit('updateInstallingAddon', addonState);
      } else {
        commit('removeInstallingAddon', addonState);
        const newAddon = addonState.addon;
        if (newAddon.new) {
          newAddon.file = newAddon.new;
          delete newAddon.new;
        }
        commit('updateAddon', { newAddon });
        const store = new Store(storeSetting);
        store.set('gameInstances.games', state.gamesSetting.games);
      }
    },
    deleteAddon({ commit }, { addonId }) {
      commit('removeAddon', { addonId });
    },
  },
});
