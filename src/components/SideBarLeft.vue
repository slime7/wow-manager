<template>
  <v-navigation-drawer
    width="250"
    style="min-width: 250px"
    v-bind="attrs"
    v-if="attrs.value"
  >
    <v-list
      dense
      nav
    >
      <v-list-item
        link
        color="primary"
        :to="{ name: 'Dashboard' }"
        exact
      >
        <v-list-item-icon>
          <v-icon>dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-title>首页</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="(game, index) in gamesSetting.games"
        :key="`${index}-${game.base}-${game.type}`"
        link
        two-line
        color="primary"
        @click="switchGameNav(index)"
        :class="{'v-list-item--active': index === gamesSetting.current && $route.name !== 'Dashboard'}"
      >
        <v-list-item-avatar>
          <v-icon>videogame_asset</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ game.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ game.path }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SideBarLeft',

  props: {
    attrs: Object,
  },

  data: () => ({
    dashboardView: false,
  }),

  computed: {
    ...mapState([
      'gamesSetting',
    ]),
  },

  methods: {
    switchGameNav(nav) {
      this.$store.dispatch('switchGame', { gameIndex: nav });
      this.$router.push({
        name: 'ManagerPanel',
        query: {
          gameIndex: nav,
        },
      });
    },
  },
};
</script>
