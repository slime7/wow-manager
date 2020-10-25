<template>
  <v-app>
    <v-system-bar fixed app class="system-bar pa-0">
      <v-spacer></v-spacer>
      <window-controls :is-maximize="isMaximize"></window-controls>
    </v-system-bar>

    <side-bar-left :attrs="navigationAttrs" />

    <v-main>
      <div
        class="d-flex flex-column fill-height"
        id="app-main-container"
      >
        <div class="scroll-content flex">
          <router-view />
        </div>
      </div>
    </v-main>

    <div class="components">
      <toast />
      <simple-dialog />
    </div>
  </v-app>
</template>

<script>
import WindowControls from '@/components/WindowControls.vue';
import { APP_VERSIONS } from '@/utils/ipcConstant';
import Toast from '@/components/Toast.vue';
import SimpleDialog from '@/components/SimpleDialog.vue';
import SideBarLeft from '@/components/SideBarLeft.vue';

export default {
  name: 'Layout',

  components: {
    SideBarLeft,
    SimpleDialog,
    Toast,
    WindowControls,
  },

  data: () => ({
    isMaximize: false,
    // navigation
    navigation: {
      show: true,
      position: 'left',
      clipped: false,
    },
  }),

  computed: {
    navigationAttrs() {
      const config = {
        permanent: true,
        app: true,
        stateless: true,
      };
      config.value = this.navigation.show && this.$route.meta.navigationVisible;
      config.clipped = this.navigation.clipped;
      config[this.navigation.position] = true;
      return config;
    },
    systemBarHeight() {
      return this.$vuetify.application.bar;
    },
  },

  methods: {
    onMaximizeStatusChange() {
      this.$ipcRenderer.on('set-maximize-status', (maximize) => {
        this.isMaximize = maximize;
      });
    },
    onGetVersion() {
      this.$ipcRenderer.on(APP_VERSIONS, (versions) => {
        this.$store.commit('setVersions', versions);
      });
    },
    onInstallAddonReply() {
      this.$ipcRenderer.on('install-addon', (reply) => {
        this.$store.dispatch('installingAddonStateChange', reply);
      });
    },
    unInstallAddonReply() {
      this.$ipcRenderer.detach('install-addon');
    },
    onDeleteAddonReply() {
      this.$ipcRenderer.on('delete-addon', (reply) => {
        this.$store.dispatch('deleteAddon', reply);
      });
    },
    unDeleteAddonReply() {
      this.$ipcRenderer.detach('delete-addon');
    },
    readGamesSetting() {
      this.$store.dispatch('readGamesSetting');
    },
    onMounted() {
      this.onMaximizeStatusChange();
      this.onGetVersion();
      this.onInstallAddonReply();
      this.onDeleteAddonReply();
      this.readGamesSetting();
    },
    onUnmounted() {
      this.$ipcRenderer.detach('set-maximize-status');
      this.$ipcRenderer.detach(APP_VERSIONS);
      this.unInstallAddonReply();
      this.unDeleteAddonReply();
    },
  },

  mounted() {
    this.onMounted();
  },

  destroyed() {
    this.onUnmounted();
  },
};
</script>

<style scoped lang="scss">
.system-bar {
  z-index: 300;
}

.v-main {
  height: 100vh;
}

#app-main-container {
  & > .scroll-content {
    min-height: 0;
    overflow-y: auto;

    & > * {
      height: 100%;
    }
  }
}
</style>
