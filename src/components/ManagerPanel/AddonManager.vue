<template>
  <v-card
    flat
    tile
  >
    <v-card-text>
      <v-text-field
        v-model="search"
        :prepend-icon="search !== '' ? 'arrow_back' : ''"
        @click:prepend="clearSearch"
        solo
        clearable
        hide-details
        :loading="loading"
        label="搜索插件"
        type="text"
      ></v-text-field>

      <installed-addons
        :addons="game.addons"
        :gameVersion="gameVersion"
        v-if="!searchMode"
      />

      <searching-addons
        :searchResult="searchResult"
        :addons="game.addons"
        :gameVersion="gameVersion"
        v-else
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { gameVersions, curseBaseUrl } from '@/utils/constants';
import InstalledAddons from '@/components/ManagerPanel/installedAddons.vue';
import SearchingAddons from '@/components/ManagerPanel/searchingAddons.vue';

export default {
  name: 'AddonManager',

  components: {
    SearchingAddons,
    InstalledAddons,
  },

  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    search: '',
    searchTimeId: null,
    loading: false,
    searchResult: [],
    searchMode: false,
  }),

  computed: {
    gameVersion() {
      return gameVersions[this.game.type];
    },
  },

  watch: {
    search() {
      this.debouncedAddonSearch();
    },
  },

  methods: {
    addonSearch() {
      if (this.search === '') return;

      if (this.loading) return;

      this.loading = true;
      this.searchMode = true;

      fetch(`${curseBaseUrl}search?gameId=1&gameVersion=${this.gameVersion}&searchFilter=${this.search}`)
        .then(res => res.json())
        .then((res) => {
          this.searchResult = res;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    debouncedAddonSearch() {
      if (this.searchTimeId) {
        clearTimeout(this.searchTimeId);

        this.searchTimeId = null;
      }
      this.searchTimeId = setTimeout(() => {
        this.addonSearch();
      }, 700);
    },
    clearSearch() {
      this.search = '';
      this.searchResult = [];
      this.searchMode = false;
    },
  },
};
</script>
