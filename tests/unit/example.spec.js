import Vuetify from 'vuetify';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import WindowControls from '@/components/WindowControls.vue';

describe('WindowControls.vue', () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = shallowMount(WindowControls, {
      localVue,
      vuetify,
    });
  });

  it('renders a vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
