import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// menampul string tab yang aktif
export const MessageTabZakat = defineStore('messageTabZakat', {
  state: () => ({ sharedString: '' }),
  actions: {
    setString(item: string) {
      this.sharedString = item;
    },
    clearString() {
      this.sharedString = '';
    },
  },
  getters: {
    getString: (state) => state.sharedString,
  },
});

export const MessageTabDonasi = defineStore('messageTabDonasi', {
  state: () => ({ sharedString: '' }),
  actions: {
    setString(item: string) {
      this.sharedString = item;
    },
    clearString() {
      this.sharedString = '';
    },
  },
  getters: {
    getString: (state) => state.sharedString,
  },
});

export const MessageTabInfaq = defineStore('messageTabInfaq', {
  state: () => ({ sharedString: '' }),
  actions: {
    setString(item: string) {
      this.sharedString = item;
    },
    clearString() {
      this.sharedString = '';
    },
  },
  getters: {
    getString: (state) => state.sharedString,
  },
});

export const RefreshRiwayatDonasi = defineStore('RefreshRiwayatDonasi', {
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

// export const Name = defineStore('nameGlobal', {
//   state: () => ({ sharedString: '' }),
//   actions: {
//     setString(item: string) {
//       this.sharedString = item;
//     },
//     clearString() {
//       this.sharedString = '';
//     },
//   },
//   getters: {
//     getString: (state) => state.sharedString,
//   },
// });

// export const Jabatan = defineStore('jabatanGlobal', {
//   state: () => ({ sharedString: '' }),
//   actions: {
//     setString(item: string) {
//       this.sharedString = item
//     },
//     clearString() {
//       this.sharedString = ''
//     },
//   },
//   getters: {
//     getString: (state) => state.sharedString,
//   },
// })

// // menampung seluruh tab secara global
// export const ProfileStore = defineStore('ProfileGlob', {
//   state: () => ({ sharedObject: {} as Record<string, any> }),
//   actions: {
//     addItem(key: string, value: any) {
//       this.sharedObject[key] = value
//     },
//     removeItem(key: string) {
//       delete this.sharedObject[key]
//     },
//     clearObject() {
//       this.sharedObject = {}
//     },
//   },
//   getters: {
//     getObject: (state) => state.sharedObject,
//   },
// })
