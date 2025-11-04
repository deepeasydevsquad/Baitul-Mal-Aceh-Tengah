// src/plugins/terbilangPlugin.js
import { terbilangUang } from '../libs/terbilangUang';

export default {
  install(app) {
    app.config.globalProperties.$terbilangUang = terbilangUang;
  },
};
