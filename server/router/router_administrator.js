const jwt = require("jsonwebtoken");
const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/administrator/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");
// const validation = require("../validation/administrator");

// Simpan refresh token dalam database sementara (bisa diganti dengan DB asli)
let refreshTokens = [];

// ROUTER
const router = express.Router();

router.get('/administrator', authenticateTokenAdministrator, controllers.administrator);

// // Endpoint login untuk mendapatkan akses token dan refresh token
// router.post('/auth/login', 
//   body("type").notEmpty().withMessage("Tipe Akun Tidak Boleh Kosong").trim().isIn(["administrator","staff"]),
//   body("company_code").custom(validation.company_code_login_process),
//   body("username").trim().custom(validation.username_login_process),
//   body("nomor_whatsapp").trim().custom(validation.nomor_whatsapp_login_process),
//   body("password").notEmpty().withMessage("Password Tidak Boleh Kosong").trim(),
//   controllers.login_process
// );

// router.post('/auth/refresh', 
//    controllers.refreshToken
// );

// // Endpoint logout untuk menghapus refresh token
// router.post('/auth/logout', (req, res) => {
//   try {
//     const { refresh_token } = req.body;
    
//     if (!refresh_token) {
//       return res.status(400).json({
//         error: true,
//         error_msg: "Refresh token diperlukan"
//       });
//     }

//     // Hapus refresh token dari array (dalam implementasi nyata, hapus dari database)
//     refreshTokens = refreshTokens.filter(token => token !== refresh_token);
    
//     // Optional: Jika ingin memvalidasi token sebelum menghapus
//     /*
//     jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, user) => {
//       if (err) {
//         return res.status(200).json({
//           error: false,
//           error_msg: "Logout berhasil (token sudah tidak valid)"
//         });
//       }
      
//       // Token valid, hapus dari storage
//       refreshTokens = refreshTokens.filter(token => token !== refresh_token);
//     });
//     */

//     return res.status(200).json({
//       error: false,
//       error_msg: "Logout berhasil"
//     });
//   } catch (error) {
//     console.error('Error during logout:', error);
    
//     // Meskipun ada error, tetap anggap logout berhasil
//     return res.status(200).json({
//       error: false,
//       error_msg: "Logout berhasil"
//     });
//   }
// });


// router.get("/Menu", authenticateToken, (req, res) => {
//     res.status(200).json([{
//       name: 'MENU',
//       menuItems: [
//         {
//           icon: ['fas', 'house'],
//           label: 'Beranda',
//           route: '/beranda',
//         },
//         {
//           icon: ['fas', 'fa-exchange'],
//           label: 'Transaksi',
//           route: '#',
//           children: [
//             { label: 'Transaksi Tiket', route: '/pages/settings' },
//             { label: 'Transaksi Paket', route: '/pages/settings' },
//             { label: 'Transaksi Umum', route: '/pages/settings' },
//             { label: 'Transaksi Rekapitulasi', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'fa-box-open'],
//           label: 'Paket & Paket LA',
//           route: '#',
//           children: [
//             { label: 'Daftar Paket', route: '/pages/settings' },
//             { label: 'Daftar Paket LA', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'fa-users'],
//           label: 'Keagenan & Jamaah',
//           route: '#',
//           children: [
//             { label: 'Daftar Member', route: '/pages/settings' },
//             { label: 'Deposit & Tabungan', route: '/pages/settings' },
//             { label: 'Daftar Jamaah', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'house-crack'],
//           label: 'Publish',
//           route: '#',
//           children: [
//             { label: 'Pengaturan', route: '/pages/settings' },
//             { label: 'Cabang', route: '/pages/settings' },
//             { label: 'Pengguna', route: '/pages/settings' },
//             { label: 'Grup Pengguna', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'house-crack'],
//           label: 'Master Data',
//           route: '#',
//           children: [
//             { label: 'Pengaturan', route: '/pages/settings' },
//             { label: 'Cabang', route: '/pages/settings' },
//             { label: 'Pengguna', route: '/pages/settings' },
//             { label: 'Grup Pengguna', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'house-crack'],
//           label: 'Laporan',
//           route: '#',
//           children: [
//             { label: 'Pengaturan', route: '/pages/settings' },
//             { label: 'Cabang', route: '/pages/settings' },
//             { label: 'Pengguna', route: '/pages/settings' },
//             { label: 'Grup Pengguna', route: '/pages/settings' },
//           ],
//         },
//         {
//           icon: ['fas', 'house-crack'],
//           label: 'Pengaturan Umum',
//           route: '#',
//           children: [
//             { label: 'Pengaturan', route: '/pages/settings' },
//             { label: 'Cabang', route: '/pages/settings' },
//             { label: 'Pengguna', route: '/pages/settings' },
//             { label: 'Grup Pengguna', route: '/pages/settings' },
//           ],
//         },
//       ],
//     }]);
//     }
//   );

module.exports = router;