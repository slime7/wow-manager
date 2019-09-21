<template>
  <div class="installed-addons">
    <v-list two-line>
      <v-list-item
        v-for="addon in addons"
        :key="addon.id"
        @click.right.exact="showAddonMenu($event, addon.name)"
      >
        <v-list-item-avatar tile>
          <v-img :src="addon.avatar" contain></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{addon.name}}</v-list-item-title>
          <div>{{addon.summary}}</div>
        </v-list-item-content>

        <v-list-item-action>
          <v-layout>
            <v-btn
              small
              outlined
              color="primary"
            >
              更新
            </v-btn>
          </v-layout>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-menu
      v-model="showMenu"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item disabled>
          <v-list-item-title>{{addonName}}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          link
        >
          <v-list-item-title>在浏览器中查看</v-list-item-title>
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
export default {
  name: 'installedAddons',

  props: {
    addons: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    showMenu: false,
    menuX: null,
    menuY: null,
    addonName: '',
  }),

  methods: {
    showAddonMenu(ev, addonName) {
      ev.preventDefault();
      this.menuX = ev.clientX;
      this.menuY = ev.clientY;
      this.addonName = addonName;
      this.showMenu = true;
    },
  },
};
</script>
