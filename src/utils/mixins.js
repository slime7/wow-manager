import { addonStatusStruct } from '@/utils/constants';

const mixin = {
  data: () => ({
    addonStatusStruct,
  }),

  methods: {
    getAddonStatus(addon, addons) {
      const { id } = addon;
      if (!addon.file) {
        return this.addonStatusStruct.NO_FILE;
      }
      if (addon.new) {
        return this.addonStatusStruct.CAN_BE_UPDATE;
      }

      if (addons) {
        const { version } = addon.file;
        const hasInstalled = addons.find((a) => a.id === id);
        if (hasInstalled) {
          return hasInstalled.file.version === version ? this.addonStatusStruct.INSTALLED : this.addonStatusStruct.CAN_BE_UPDATE;
        }
        return this.addonStatusStruct.NOT_INSTALLED;
      }
      return this.addonStatusStruct.NO_UPDATE;
    },
    wait(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
  },
};

export default mixin;
