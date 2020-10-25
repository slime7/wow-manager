<template>
  <router-view/>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  @font-face {
    font-family: 'Source Code Pro2';
    src: url('./assets/SourceCodePro-Regular.ttf');
  }

  html {
    overflow-y: auto !important;
  }

  .system-bar {
    -webkit-app-region: drag;
  }

  #app {
    font-family: "Roboto", "Noto Sans CJK SC", "Microsoft YaHei", "微软雅黑", sans-serif;
  }

  #app pre {
    font-family: "Source Code Pro";
    margin: 0;
    user-select: text;
  }

  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    background-color: #6e6e6e;
    outline: 1px solid #333;
  }

  textarea::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }

  textarea::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #6e6e6e;
    outline: 1px solid #708090;
  }

  #app .flex-scroll-y {
    overflow-y: auto;
    min-height: 0;
  }
</style>
