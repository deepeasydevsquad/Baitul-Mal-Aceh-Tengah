import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const RefreshValidasi = defineStore('RefreshValidasi', {
  state: () => ({
    sharedBool: false as boolean,
  }),
  actions: {
    setBool(value: boolean) {
      this.sharedBool = value;
    },
    clearBool() {
      this.sharedBool = false;
    },
  },
  getters: {
    getBool: (state) => state.sharedBool,
  },
});

export const RefreshBakal = defineStore('RefreshBakal', {
  state: () => ({
    sharedBool: false as boolean,
  }),
  actions: {
    setBool(value: boolean) {
      this.sharedBool = value;
    },
    clearBool() {
      this.sharedBool = false;
    },
  },
  getters: {
    getBool: (state) => state.sharedBool,
  },
});
