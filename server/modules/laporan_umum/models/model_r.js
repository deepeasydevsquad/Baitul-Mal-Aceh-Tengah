"use strict";

const { Member, Asnaf, Program, sequelize, Op } = require("../../../models");
const { Kegiatan } = require("../../../models");
const { Realisasi_permohonan } = require("../../../models");
const { Riwayat_donasi } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
  }

  async list_laporan_umum() {
    try {
      // Ambil parameter filter dari request (jika ada)
      const { tahun, bulan } = this.req.query || {};

      // Hitung total data
      const totalMember = await Member.count();
      const totalAsnaf = await Asnaf.count();
      const totalProgram = await Program.count();

      const totalProgramPenyaluran = await Kegiatan.count();
      const totalPenerimaBantuan = await Realisasi_permohonan.count();
      const totalPenyaluranBantuan = await Realisasi_permohonan.sum("nominal_realisasi", {
        where: { status_realisasi: "sudah_direalisasi" }
      });

      // ========== RANGE TANGGAL ==========
      // Awal & akhir hari ini
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      // Awal & akhir bulan ini (atau bulan yang dipilih)
      let startOfMonth, endOfMonth;
      if (tahun && bulan) {
        startOfMonth = moment(`${tahun}-${bulan}-01`).startOf("month").toDate();
        endOfMonth = moment(`${tahun}-${bulan}-01`).endOf("month").toDate();
      } else {
        startOfMonth = moment().startOf("month").toDate();
        endOfMonth = moment().endOf("month").toDate();
      }

      // Awal & akhir tahun ini (atau tahun yang dipilih)
      let startOfYear, endOfYear;
      if (tahun) {
        startOfYear = moment(`${tahun}-01-01`).startOf("year").toDate();
        endOfYear = moment(`${tahun}-12-31`).endOf("year").toDate();
      } else {
        startOfYear = moment().startOf("year").toDate();
        endOfYear = moment().endOf("year").toDate();
      }

      // ========== PENERIMAAN ZAKAT ==========
      const totalPenerimaanZakatHariIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "zakat",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });

      const totalPenerimaanZakatBulanIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "zakat",
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      const totalPenerimaanZakatTahunIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "zakat",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      });

      const totalPenerimaanZakat = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "zakat"
        }
      });

      // ========== PENERIMAAN INFAQ ==========
      const totalPenerimaanInfaqHariIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "infaq",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });

      const totalPenerimaanInfaqBulanIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "infaq",
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      const totalPenerimaanInfaqTahunIni = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "infaq",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      });

      const totalPenerimaanInfaq = await Kegiatan.sum("jumlah_dana", {
        where: {
          sumber_dana: "infaq"
        }
      });

      // ========== PENERIMAAN DONASI ==========
      const totalPenerimaanDonasiHariIni = await Riwayat_donasi.sum("nominal", {
        where: {
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });

      const totalPenerimaanDonasiBulanIni = await Riwayat_donasi.sum("nominal", {
        where: {
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      const totalPenerimaanDonasiTahunIni = await Riwayat_donasi.sum("nominal", {
        where: {
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      });

      const totalPenerimaanDonasi = await Riwayat_donasi.sum("nominal", {
        where: {
          konfirmasi_pembayaran: "sudah_dikirim"
        }
      });

      // RESPONSE
      return {
        status: true,
        message: "Sukses ambil laporan umum",
        data: {
          info_umum: {
            totalMember,
            totalAsnaf,
            totalProgram
          },
          info_program_bantuan: {
            totalProgramPenyaluran,
            totalPenerimaBantuan,
            totalPenyaluranBantuan
          },
          total_penerimaan_zakat: {
            totalPenerimaanZakatHariIni: totalPenerimaanZakatHariIni || 0,
            totalPenerimaanZakatBulanIni: totalPenerimaanZakatBulanIni || 0,
            totalPenerimaanZakatTahunIni: totalPenerimaanZakatTahunIni || 0,
            totalPenerimaanZakat: totalPenerimaanZakat || 0
          },
          total_penerimaan_infaq: {
            totalPenerimaanInfaqHariIni: totalPenerimaanInfaqHariIni || 0,
            totalPenerimaanInfaqBulanIni: totalPenerimaanInfaqBulanIni || 0,
            totalPenerimaanInfaqTahunIni: totalPenerimaanInfaqTahunIni || 0,
            totalPenerimaanInfaq: totalPenerimaanInfaq || 0
          },
          total_penerimaan_donasi: {
            totalPenerimaanDonasiHariIni: totalPenerimaanDonasiHariIni || 0,
            totalPenerimaanDonasiBulanIni: totalPenerimaanDonasiBulanIni || 0,
            totalPenerimaanDonasiTahunIni: totalPenerimaanDonasiTahunIni || 0,
            totalPenerimaanDonasi: totalPenerimaanDonasi || 0
          },
          filter: {
            tahun: tahun || moment().year(),
            bulan: bulan || moment().month() + 1
          }
        },
      };
    } catch (error) {
      console.error("Error laporan umum:", error);
      return { 
        status: false, 
        message: "Gagal ambil laporan umum", 
        error: error.message 
      };
    }
  }
}

module.exports = Model_r;