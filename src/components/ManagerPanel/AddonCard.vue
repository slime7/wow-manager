<template>
  <v-card
    class="addon-card my-2"
  >
    <v-list-item three-line>
      <v-list-item-avatar tile>
        <v-img :src="addon.avatar" contain v-if="addon.avatar"></v-img>
        <v-icon v-else>extension</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <div class="addon-title">{{addon.name}}</div>
        </v-list-item-title>
        <v-list-item-subtitle>{{addon.authors.join(', ')}}</v-list-item-subtitle>
        <div class="text--primary">{{addon.summary}}</div>
      </v-list-item-content>

      <v-list-item-action>
        <div class="d-flex flex-row">
          <v-btn
            small
            outlined
            color="primary"
            @click.stop="installAddon(addon)"
            v-show="addon.file && addonStatus === addonStatusStruct.NOT_INSTALLED"
          >
            安装
          </v-btn>

          <v-btn
            small
            outlined
            color="primary"
            @click.stop="installAddon(addon)"
            v-show="addon.file && addonStatus === addonStatusStruct.CAN_BE_UPDATE"
          >
            更新
          </v-btn>

          <v-btn
            small
            outlined
            disabled
            color="primary"
            v-show="addon.file && addonStatus === addonStatusStruct.INSTALLED"
          >
            已安装
          </v-btn>

          <v-btn
            small
            outlined
            disabled
            color="primary"
            v-show="addon.file && addonStatus === addonStatusStruct.NO_UPDATE"
          >
            最新版
          </v-btn>

          <v-btn
            small
            outlined
            disabled
            color="primary"
            v-show="!addon.file"
          >
            无正式版
          </v-btn>
        </div>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import mixins from '@/utils/mixins';

export default {
  name: 'AddonCard',

  mixins: [mixins],

  props: {
    addon: {
      type: Object,
      required: true,
    },
    addonStatus: {
      type: Number,
      required: true,
    },
  },

  methods: {
    installAddon(addon) {
      this.$ipcRenderer.send('install-addon', { addon });
    },
  },
};
</script>

<style scoped>
  .addon-title {
    max-width: 0;
  }
</style>
