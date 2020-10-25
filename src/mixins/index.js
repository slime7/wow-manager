import store from '@/store/store';

const mixins = {
  methods: {
    toast(msg, timeout = 6000) {
      store.dispatch('toast/show', { msg, timeout });
    },
    netFail() {
      this.toast('无法连接网络');
    },
    dialog(content, title, attr = {}, hideClose = false) {
      store.dispatch('dialog/append', {
        content,
        title,
        hideClose,
        attr,
      });
    },
    showLoader() {
      store.dispatch('dialog/showLoader');
    },
    hideLoader() {
      store.dispatch('dialog/hideLoader');
    },
  },
};

export default mixins;
