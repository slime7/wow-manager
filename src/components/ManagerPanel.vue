<template>
  <div class="d-flex flex-column fill-height manager-panel">
    <div>
      <v-tabs v-model="tab">
        <v-tab>信息</v-tab>
        <v-tab>插件</v-tab>
      </v-tabs>
    </div>

    <v-divider></v-divider>

    <div class="flex flex-scroll-y">
      <v-tabs-items v-model="tab" class="fill-height">
        <v-tab-item>
          <v-card
            flat
            tile
          >
            <v-card-title>{{game.name}}</v-card-title>
            <v-card-text>
              <div>游戏位置: {{game.path}}</div>
              <div>游戏模式: {{gameTypes[game.type]}}</div>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <addon-manager :game="game"/>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { gameTypes } from '@/utils/constants';
import AddonManager from '@/components/ManagerPanel/AddonManager.vue';

export default {
  name: 'ManagerPanel',

  components: {
    AddonManager,
  },

  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    tab: 0,
    gameTypes,
  }),
};
</script>
