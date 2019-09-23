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
      v-for="addon in installedAndUpdated"
      :key="addon.id"
      :addon="addon"
      :addonStatus="getAddonStatus(addon, addons)"
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
          <v-list-item-title>{{menu.show ? addons.find(a => a.id === menu.addonId).name : ''}}
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

  props: {
    addons: {
      type: Array,
      required: true,
    },
    gameVersion: {
      type: String,
      required: true,
    },
  },

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
    installedAndUpdated() {
      const addons = JSON.parse(JSON.stringify(this.addons));
      this.checkUpdateResult.forEach((addon) => {
        const ind = addons.findIndex(a => a.id === addon.id);
        if (ind !== -1) {
          addons[ind] = addon;
        }
      });
      return addons;
    },
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
      const allUpdatePromise = this.addons.map(addon => new Promise((resolve, reject) => {
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
          const updateResult = [];
          results.forEach((addon) => {
            updateResult.push(parseAddon(addon, this.gameVersion));
          });
          this.checkUpdateResult = updateResult;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.checking = false;
        });
    },
    openAddonWebsite() {
      const url = this.addons.find(a => a.id === this.menu.addonId).web;
      shell.openExternal(url);
    },
  },
};
</script>
