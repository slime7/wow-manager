<template>
  <div class="searching-addons">
    <addon-card
      v-for="addon in searchResultFormated"
      :key="addon.id"
      :addon="addon"
      :addonStatus="getAddonStatus(addon, addons)"
    />
  </div>
</template>

<script>
import { parseAddon } from '@/utils';
import mixins from '@/utils/mixins';
import AddonCard from '@/components/ManagerPanel/AddonCard.vue';

export default {
  name: 'searchingAddons',

  components: {
    AddonCard,
  },

  mixins: [mixins],

  props: {
    searchResult: {
      type: Array,
      required: true,
    },
    addons: {
      type: Array,
      required: true,
    },
    gameVersion: {
      type: String,
      required: true,
    },
  },

  computed: {
    searchResultFormated() {
      const addons = [];
      this.searchResult.forEach((result) => {
        const addon = parseAddon(result, this.gameVersion);
        addons.push(addon);
      });

      return addons;
    },
  },
};
</script>
