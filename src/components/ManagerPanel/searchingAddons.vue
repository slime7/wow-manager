<template>
  <div class="searching-addons">
    <addon-card
      v-for="addon in searchResultFormated"
      :key="addon.id"
      :addon="addon"
      :addonStatus="getAddonStatus(addon, currentGame.addons)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
  },

  computed: {
    searchResultFormated() {
      const addons = [];
      this.searchResult.forEach((result) => {
        const addon = parseAddon(result, this.currentGameVersion);
        addons.push(addon);
      });

      return addons;
    },
    ...mapGetters([
      'currentGame',
      'currentGameVersion',
    ]),
  },
};
</script>
