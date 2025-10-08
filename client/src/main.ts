// Import Global Styles
import './assets/css/satoshi.css';
import './assets/css/style.css';
import './assets/css_home_pages/baitulmal.css';
import './assets/css_home_pages/input-login.css';
import './assets/css_home_pages/input.css';
import './assets/css_home_pages/login.css';

import 'flowbite';

// Vue Core
import { createApp } from 'vue';
import App from './App.vue';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/default.min.css'; // atau theme lain seperti semantic.min.css
import router from './router';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import rupiahPlugin from '@/plugins/rupiahPlugin';

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

// Chart
import VueApexCharts from 'vue3-apexcharts';

// FontAwesome Setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// import Confirm from 'confirmjs'
import rupiahPlugin from '@/plugins/rupiahPlugin';

// <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
// FontAwesome Icons - Solid
import {
  faPlaneArrival,
  faBuilding,
  faPlane,
  faMoneyBillWave,
  faTicketSimple,
  faUser,
  faUserCheck,
  faHome,
  faHouseCrack,
  faCaretRight,
  faExchange,
  faBoxOpen,
  faUsers,
  faGlobe,
  faDatabase,
  faChartArea,
  faCogs,
  faBackward,
  faForward,
  faBook,
  faArrowRight,
  faPlus,
  faMoneyBill,
  faPencil,
  faTimes,
  faBox,
  faMoneyBillAlt,
  faUndoAlt,
  faListAlt,
  faImage,
  faTicket,
  faCircleArrowRight,
  faQrcode,
  faCalendar,
  faArrowLeft,
  faHandHoldingDollar,
  faMoneyCheckAlt,
  faCity,
  faCar,
  faHotel,
  faPassport,
  faSubway,
  faClipboardList,
  faPiggyBank,
  faUserCog,
  faUserTie,
  faCalculator,
  faList,
  faBalanceScale,
  faBalanceScaleLeft,
  faCommentDollar,
  faShieldAlt,
  faEnvelope,
  faClipboardCheck,
  faLayerGroup,
  faPeopleCarry,
  faEyeSlash,
  faCloudArrowUp,
  faCodeBranch,
  faLock,
  faLockOpen,
  faPlaneCircleCheck,
  faHandshake,
  faGear,
  faRightFromBracket,
  faPeopleGroup,
  faHandHoldingHeart,
  faClockRotateLeft,
  faCoins,
  faChartLine,
  faQuestionCircle,
  faListOl,
  faFileSignature,
  faFileContract,
  faListCheck,
  faBriefcase,
  faMap,
  faMapLocationDot,
  faBuildingColumns,
  faFileLines,
  faHandHoldingMedical,
  faHandHoldingHand,
  faHandsHoldingCircle,
  faRoute,
  faHandHoldingDroplet,
  faHandshakeAngle,
  faUserShield,
  faScroll,
  faMessage,
  faClipboardUser,
  faUserPlus,
  faUserClock,
  faClipboardQuestion,
  faCloudArrowDown,
  faBan,
  faToggleOn,
  faToggleOff,
  faDownload,
  faGripVertical,
  faFileExport,
  faFilePen,
  faTableList,
  faFileImport,
  faCalendarCheck,
  faTableCellsLarge,
  faMosque,
  faGift,
} from '@fortawesome/free-solid-svg-icons';

// FontAwesome Icons - Regular
import { faCircle, faClock, faUser as farUser, faEye } from '@fortawesome/free-regular-svg-icons';

// FontAwesome Icons - Brands
import { faCcVisa, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Tambahkan semua icon ke library FontAwesome
library.add(
  // Solid Icons
  faUser,
  faUserCheck,
  faHome,
  faHouseCrack,
  faCaretRight,
  faExchange,
  faBoxOpen,
  faUsers,
  faGlobe,
  faDatabase,
  faChartArea,
  faCogs,
  faBackward,
  faForward,
  faBook,
  faArrowRight,
  faPlus,
  faMoneyBill,
  faPencil,
  faTimes,
  faBox,
  faMoneyBillAlt,
  faUndoAlt,
  faListAlt,
  faImage,
  faTicket,
  faCircleArrowRight,
  faQrcode,
  faCalendar,
  faArrowLeft,
  faHandHoldingDollar,
  faMoneyCheckAlt,
  faCity,
  faCar,
  faHotel,
  faPassport,
  faSubway,
  faClipboardList,
  faPiggyBank,
  faUserCog,
  faUserTie,
  faCalculator,
  faList,
  faBalanceScale,
  faBalanceScaleLeft,
  faCommentDollar,
  faShieldAlt,
  faEnvelope,
  faClipboardCheck,
  faLayerGroup,
  faPeopleCarry,
  faTicketSimple,
  faMoneyBillWave,
  faPlane,
  faBuilding,
  faPlaneArrival,
  faCircle,
  faClock,
  farUser,
  faCcVisa,
  faWhatsapp,
  faEye,
  faEyeSlash,
  faCloudArrowUp,
  faCodeBranch,
  faLock,
  faLockOpen,
  faPlaneCircleCheck,
  faHandshake,
  faGear,
  faRightFromBracket,
  faPeopleGroup,
  faHandHoldingHeart,
  faClockRotateLeft,
  faCoins,
  faChartLine,
  faQuestionCircle,
  faListOl,
  faFileSignature,
  faClipboardCheck,
  faFileContract,
  faListCheck,
  faBriefcase,
  faMap,
  faMapLocationDot,
  faBuildingColumns,
  faFileLines,
  faHandHoldingMedical,
  faHandHoldingHand,
  faHandsHoldingCircle,
  faRoute,
  faHandHoldingDroplet,
  faHandshakeAngle,
  faUserShield,
  faScroll,
  faMessage,
  faClipboardUser,
  faUserPlus,
  faUserClock,
  faClipboardQuestion,
  faCloudArrowDown,
  faBan,
  faToggleOn,
  faToggleOff,
  faDownload,
  faGripVertical,
  faFileExport,
  faFilePen,
  faTableList,
  faFileImport,
  faCalendarCheck,
  faTableCellsLarge,
  faMosque,
  faCoins,
  faGift,
);

// Buat App Vue
const app = createApp(App);
const head = createHead();

// Gunakan Plugin dan Komponen
app.use(router);
app.use(createPinia());
app.use(VueApexCharts);
app.use(head);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(rupiahPlugin);

router.beforeEach((to, from, next) => {
  const defaultTitle = 'Aplikasi Muzakki dan Mustahik';
  document.title = to.meta.title || defaultTitle;
  next();
});

// Register FontAwesome Component
app.component('font-awesome-icon', FontAwesomeIcon);
app.config.globalProperties.$alertify = alertify;
// Mount ke DOM
app.mount('#app');
