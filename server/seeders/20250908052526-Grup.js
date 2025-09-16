"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Grups",
      [
        {
          name: "Administrator",
          group_access: JSON.stringify([
            {
              id: 1,
              name: "Beranda",
              path: "beranda",
              icon: "fas fa-home",
              Submenus: [],
            },
            {
              id: 2,
              name: "Layanan",
              path: "#",
              icon: "fas fa-exchange",
              Submenus: [
                { id: 1, menu_id: 2, name: "Pengumpulan", path: "pengumpulan" },
                { id: 2, menu_id: 2, name: "Perencanaan", path: "perencanaan" },
                {
                  id: 3,
                  menu_id: 2,
                  name: "Pendistribusian",
                  path: "pendistribusian",
                },
                {
                  id: 4,
                  menu_id: 2,
                  name: "Kesekretariatan",
                  path: "kesekretariatan",
                },
              ],
            },
            {
              id: 3,
              name: "Keanggotaan",
              path: "#",
              icon: "fas fa-users",
              Submenus: [
                { id: 5, menu_id: 3, name: "Keanggotaan", path: "keanggotaan" },
              ],
            },
            {
              id: 4,
              name: "Master Data",
              path: "#",
              icon: "fas fa-database",
              Submenus: [
                { id: 6, menu_id: 4, name: "Asnaf", path: "asnaf" },
                { id: 7, menu_id: 4, name: "Program", path: "program" },
                {
                  id: 8,
                  menu_id: 4,
                  name: "Kecamatan & Desa",
                  path: "kecamatan_desa",
                },
                { id: 9, menu_id: 4, name: "Bank", path: "bank" },
              ],
            },
            {
              id: 5,
              name: "Laporan",
              path: "#",
              icon: "fas fa-chart-area",
              Submenus: [
                {
                  id: 10,
                  menu_id: 5,
                  name: "Laporan Umum",
                  path: "laporan_umum",
                },
                {
                  id: 11,
                  menu_id: 5,
                  name: "Laporan Pengumpulan",
                  path: "laporan_pengumpulan",
                },
                {
                  id: 12,
                  menu_id: 5,
                  name: "Laporan Perencanaan",
                  path: "laporan_perencanaan",
                },
                {
                  id: 13,
                  menu_id: 5,
                  name: "Laporan Pendistribusian",
                  path: "laporan_pendistribusian",
                },
                {
                  id: 14,
                  menu_id: 5,
                  name: "Laporan Kesekretariatan",
                  path: "laporan_kesekretariatan",
                },
              ],
            },
            {
              id: 6,
              name: "Pengaturan",
              path: "#",
              icon: "fas fa-cogs",
              Submenus: [
                {
                  id: 15,
                  menu_id: 6,
                  name: "Pengaturan Umum",
                  path: "pengaturan_umum",
                },
                { id: 16, menu_id: 6, name: "Grup Akses", path: "grup_akses" },
                {
                  id: 17,
                  menu_id: 6,
                  name: "Daftar Pengguna",
                  path: "daftar_pengguna",
                },
                {
                  id: 18,
                  menu_id: 6,
                  name: "Konten Publik",
                  path: "konten_publik",
                },
                { id: 19, menu_id: 6, name: "Whatsapp", path: "whatsapp" },
                { id: 20, menu_id: 6, name: "System Log", path: "system_log" },
              ],
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Operator",
          group_access: JSON.stringify([
            {
              id: 1,
              name: "Beranda",
              path: "beranda",
              icon: "fas fa-home",
              Submenus: [],
            },
            {
              id: 2,
              name: "Layanan",
              path: "#",
              icon: "fas fa-exchange",
              Submenus: [
                { id: 1, menu_id: 2, name: "Pengumpulan", path: "pengumpulan" },
                { id: 2, menu_id: 2, name: "Perencanaan", path: "perencanaan" },
                {
                  id: 3,
                  menu_id: 2,
                  name: "Pendistribusian",
                  path: "pendistribusian",
                },
                {
                  id: 4,
                  menu_id: 2,
                  name: "Kesekretariatan",
                  path: "kesekretariatan",
                },
              ],
            },
            {
              id: 3,
              name: "Keanggotaan",
              path: "#",
              icon: "fas fa-users",
              Submenus: [
                { id: 5, menu_id: 3, name: "Keanggotaan", path: "keanggotaan" },
              ],
            },
            {
              id: 5,
              name: "Laporan",
              path: "#",
              icon: "fas fa-chart-area",
              Submenus: [
                {
                  id: 10,
                  menu_id: 5,
                  name: "Laporan Umum",
                  path: "laporan_umum",
                },
                {
                  id: 11,
                  menu_id: 5,
                  name: "Laporan Pengumpulan",
                  path: "laporan_pengumpulan",
                },
                {
                  id: 12,
                  menu_id: 5,
                  name: "Laporan Perencanaan",
                  path: "laporan_perencanaan",
                },
                {
                  id: 13,
                  menu_id: 5,
                  name: "Laporan Pendistribusian",
                  path: "laporan_pendistribusian",
                },
                {
                  id: 14,
                  menu_id: 5,
                  name: "Laporan Kesekretariatan",
                  path: "laporan_kesekretariatan",
                },
              ],
            },
            {
              id: 6,
              name: "Pengaturan",
              path: "#",
              icon: "fas fa-cogs",
              Submenus: [
                {
                  id: 15,
                  menu_id: 6,
                  name: "Pengaturan Umum",
                  path: "pengaturan_umum",
                },
              ],
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Grups", null, {});
  },
};
