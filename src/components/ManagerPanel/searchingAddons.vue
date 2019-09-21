<template>
  <div class="searching-addons">
    <v-card
      v-for="addon in searchResultFormated"
      :key="addon.id"
      class="my-2"
    >
      <v-list-item three-line>
        <v-list-item-avatar tile>
          <v-img :src="addon.avatar" contain></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{addon.name}}</v-list-item-title>
          <v-list-item-subtitle>{{addon.authors.join(', ')}}</v-list-item-subtitle>
          <div>
            <div class="text--primary">{{addon.summary}}</div>
          </div>
        </v-list-item-content>

        <v-list-item-action>
          <v-layout>
            <v-btn
              small
              outlined
              color="primary"
              @click="installAddon(addon)"
              v-show="addon.file && addonStatus(addon) === addonStatusStruct.NOT_INSTALLED"
            >
              安装
            </v-btn>

            <v-btn
              small
              outlined
              color="primary"
              @click="installAddon(addon)"
              v-show="addon.file && addonStatus(addon) === addonStatusStruct.CAN_BE_UPDATE"
            >
              更新
            </v-btn>

            <v-btn
              small
              outlined
              disabled
              color="primary"
              v-show="addon.file && addonStatus(addon) === addonStatusStruct.INSTALLED"
            >
              已安装
            </v-btn>
          </v-layout>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import { addonAvatar, addonLatestFile } from '@/utils';
import { gameVersions } from '@/utils/constants';

export default {
  name: 'searchingAddons',

  props: {
    searchResult: {
      type: Array,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    searchResultFormated() {
      const addons = [];
      this.searchResult.forEach((result) => {
        const latestFile = addonLatestFile(result.latestFiles, gameVersions[this.game.type]);
        const addon = {
          id: result.id,
          name: result.name,
          summary: result.summary,
          authors: result.authors.map(author => author.name),
          avatar: addonAvatar(result.attachments),
          attachments: result.attachments,
          web: result.websiteUrl,
          file: null,
        };
        if (latestFile) {
          addon.file = {
            version: latestFile.displayName,
            downloadUrl: latestFile.downloadUrl,
            fileName: latestFile.fileName,
            modules: latestFile.modules,
          };
        }
        addons.push(addon);
      });

      return addons;
    },
  },

  data: () => ({
    addonStatusStruct: {
      NOT_INSTALLED: 0,
      INSTALLED: 1,
      CAN_BE_UPDATE: 2,
    },
  }),

  methods: {
    installAddon(addon) {
      this.$ipcRenderer.send('install-addon', { addon });
    },
    addonStatus(addon) {
      const { id, version } = addon;
      const hasInstalled = this.game.addons.find(a => a.id === id);
      if (hasInstalled) {
        return hasInstalled.version === version ? this.addonStatusStruct.INSTALLED : this.addonStatusStruct.CAN_BE_UPDATE;
      }
      return this.addonStatusStruct.NOT_INSTALLED;
    },
  },
};
</script>
