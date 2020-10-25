<template>
  <v-app-bar app v-bind="attrs" v-if="attrs.value">
    <div class="headline">App</div>
    <v-spacer></v-spacer>
    <v-btn class="mr-2" @click="testToast">toast</v-btn>
    <v-btn class="mr-2" @click="testDialog">dialog</v-btn>
    <v-btn @click="testLoader">loader</v-btn>
  </v-app-bar>
</template>

<script>
import mixins from '@/mixins';

export default {
  name: 'AppBar',

  mixins: [mixins],

  props: {
    attrs: Object,
  },

  methods: {
    testToast() {
      this.toast('toast');
    },
    testDialog() {
      this.dialog('dialog');
    },
    testLoader() {
      this.showLoader();
      setTimeout(this.hideLoader, 3000);
    },
  },
};
</script>
