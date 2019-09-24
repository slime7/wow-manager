<template>
  <div class="installed-addons">
    <div class="mt-2">
      <v-btn
        @click="checkUpdate"
        :loading="checking"
      >
        检查更新
      </v-btn>
    </div>

    <addon-card
      v-for="addon in sortedAddons"
      :key="addon.id"
      :addon="addon"
      :addonStatus="getAddonStatus(addon)"
      @contextmenu.native="showAddonMenu($event, addon.id)"
    />

    <v-menu
      v-model="menu.show"
      :position-x="menu.x"
      :position-y="menu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item disabled>
          <v-list-item-title>
            {{menu.show ? currentGame.addons.find(a => a.id === menu.addonId).name : ''}}
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          link
          @click="openAddonWebsite"
        >
          <v-list-item-title>打开插件网页</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
        >
          <v-list-item-title>删除</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { shell } from 'electron';
import { mapGetters } from 'vuex';
import { curseBaseUrl } from '@/utils/constants';
import { parseAddon } from '@/utils';
import mixins from '@/utils/mixins';
import AddonCard from '@/components/ManagerPanel/AddonCard.vue';

export default {
  name: 'installedAddons',

  components: {
    AddonCard,
  },

  mixins: [mixins],

  data: () => ({
    menu: {
      show: false,
      x: 0,
      y: 0,
      addonId: null,
    },
    checkUpdateResult: [],
    checking: false,
  }),

  computed: {
    sortedAddons() {
      const addons = JSON.parse(JSON.stringify(this.currentGame.addons));
      return addons.sort((a, b) => {
        if (a.new && !b.new) {
          return -1;
        }
        if (!a.new && b.new) {
          return 1;
        }
        return 0;
      });
    },
    ...mapGetters([
      'currentGame',
      'currentGameVersion',
    ]),
  },

  methods: {
    showAddonMenu(ev, addonId) {
      this.menu.x = ev.clientX;
      this.menu.y = ev.clientY;
      this.menu.addonId = addonId;
      this.menu.show = true;
    },
    checkUpdate() {
      this.checking = true;
      const allUpdatePromise = this.currentGame.addons.map(addon => new Promise((
        resolve,
        reject,
      ) => {
        fetch(`${curseBaseUrl}${addon.id}`)
          .then(res => res.json())
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }));

      Promise.all(allUpdatePromise)
        .then((results) => {
          const updateResult = results.map(addon => parseAddon(addon, this.currentGameVersion));
          this.$store.dispatch('mergeAddonUpdateResult', { updateResult });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.checking = false;
        });
    },
    openAddonWebsite() {
      const url = this.currentGame.addons.find(a => a.id === this.menu.addonId).web;
      shell.openExternal(url);
    },
  },
};
</script>
