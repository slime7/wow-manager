<template>
  <v-card
    class="addon-card my-2"
  >
    <v-list-item three-line>
      <v-list-item-avatar tile v-if="progress < 0">
        <v-img :src="addon.avatar" contain v-if="addon.avatar"></v-img>
        <v-icon v-else>extension</v-icon>
      </v-list-item-avatar>

      <v-list-item-avatar tile v-else>
        <v-progress-circular
          :rotate="-90"
          :size="40"
          :value="Math.round(progress * 100)"
          :indeterminate="progress === 1"
          :width="2"
          color="primary"
        >
          <v-img :src="addon.avatar" contain v-if="addon.avatar" width="24" height="24"></v-img>
          <v-icon v-else>extension</v-icon>
        </v-progress-circular>
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
            @click.stop="installAddon"
            v-show="progress < 0 && addon.file && status === 'not-installed'"
          >
            安装
          </v-btn>

          <v-btn
            small
            outlined
            color="primary"
            @click.stop="installAddon"
            v-show="progress < 0 && addon.file && status === 'can-be-updated'"
          >
            更新
          </v-btn>

          <v-btn
            small
            outlined
            disabled
            color="primary"
            v-show="progress >= 0"
          >
            <span v-if="progress < 1">
              {{Math.round(progress * 100)}}%
            </span>
            <span v-else>
              安装中
            </span>
          </v-btn>

          <v-btn
            small
            outlined
            disabled
            color="primary"
            v-show="addon.file && status === 'no-update'"
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
export default {
  name: 'AddonCard',

  props: {
    addon: {
      type: Object,
      required: true,
    },
    gamePath: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
  },

  computed: {
    progress() {
      return this.$store.getters.addonDownloadProgress(this.addon.id);
    },
    status() {
      return this.$store.getters.addonStatus(this.addon);
    },
  },

  methods: {
    installAddon() {
      const { addon } = this;
      this.$store.dispatch('installAddon', addon);
      this.$ipcRenderer.send('install-addon', {
        addon,
        gamePath: this.gamePath,
        gameType: this.gameType,
      });
    },
  },
};
</script>

<style scoped>
  .addon-title {
    max-width: 0;
  }
</style>
