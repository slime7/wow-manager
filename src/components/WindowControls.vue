<template>
  <div class="window-controls">
    <div class="d-flex flex-row fill-height">
      <div class="window-control-btn" @click="appMinimize">
        <div class="d-flex flex-column justify-center align-center fill-height">
          <svg width='11' height='11' viewBox='0 0 11 11' fill='none'
               xmlns='http://www.w3.org/2000/svg'>
            <path
              :d='icon.minimize'
              fill='#000'/>
          </svg>
        </div>
      </div>

      <div class="window-control-btn" v-show="isMaximize" @click="appUnmaximize">
        <div class="d-flex flex-column justify-center align-center fill-height">
          <svg width='11' height='11' viewBox='0 0 11 11' fill='none'
               xmlns='http://www.w3.org/2000/svg'>
            <path
              :d='icon.unmaximize'
              fill='#000'/>
          </svg>
        </div>
      </div>

      <div class="window-control-btn" v-show="!isMaximize" @click="appMaximize">
        <div class="d-flex flex-column justify-center align-center fill-height">
          <svg width='11' height='11' viewBox='0 0 11 11' fill='none'
               xmlns='http://www.w3.org/2000/svg'>
            <path
              :d='icon.maximize'
              fill='#000'/>
          </svg>
        </div>
      </div>

      <div class="window-control-btn close" @click="appClose">
        <div class="d-flex flex-column justify-center align-center fill-height">
          <svg width='11' height='11' viewBox='0 0 11 11' fill='none'
               xmlns='http://www.w3.org/2000/svg'>
            <path
              :d='icon.close'
              fill='#000'/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';

export default {
  name: 'WindowControls',

  props: {
    isMaximize: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    icon: {
      minimize: 'M11 4.399V5.5H0V4.399h11z',
      unmaximize: 'M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z',
      maximize: 'M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z',
      close: 'M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z',
    },
  }),

  methods: {
    appMinimize() {
      remote.getCurrentWindow().minimize();
    },
    appUnmaximize() {
      remote.getCurrentWindow().unmaximize();
    },
    appMaximize() {
      remote.getCurrentWindow().maximize();
    },
    appClose() {
      remote.getCurrentWindow().close();
    },
  },
};
</script>

<style scoped>
  .window-control-btn {
    width: 40px;
    height: 24px;
    cursor: default;
    -webkit-app-region: no-drag;
  }

  .window-control-btn:hover {
    background-color: #eee;
  }

  .window-control-btn.close:hover {
    background-color: rgba(232, 17, 35, 0.9);
  }

  .window-control-btn.close:hover path {
    fill: #fff;
  }
</style>
