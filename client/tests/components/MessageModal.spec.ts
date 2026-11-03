// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MessageModal from '../../src/components/MessageModal.vue';

describe('MessageModal', () => {
  it('отображает счётчик символов и дизейблит кнопку', async () => {
    const wrapper = mount(MessageModal, {
      props: { isOpen: true },
      global: {
        stubs: { Teleport: true, Transition: true },
      },
    });

    expect(wrapper.find('.modal-counter').text()).toBe('0/200');
    expect(wrapper.find('.modal-counter').classes()).not.toContain('counter-exceeded');
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBe('');

    const textarea = wrapper.find('textarea#description');
    await textarea.setValue('x'.repeat(200));
    expect(wrapper.find('.modal-counter').text()).toBe('200/200');
    expect(wrapper.find('.modal-counter').classes()).not.toContain('counter-exceeded');
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeUndefined();

    await textarea.setValue('x'.repeat(201));
    expect(wrapper.find('.modal-counter').text()).toBe('201/200');
    expect(wrapper.find('.modal-counter').classes()).toContain('counter-exceeded');
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBe('');
    expect(wrapper.emitted('submit')).toBeUndefined();

    await textarea.setValue('x'.repeat(199) + ' ');
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeUndefined();

    await wrapper.find('.submit-btn').trigger('click');
    expect(wrapper.emitted('submit')).toEqual([['x'.repeat(199)]]);
  });
});