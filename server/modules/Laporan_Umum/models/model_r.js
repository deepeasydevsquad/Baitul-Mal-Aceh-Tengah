"use strict";

const { Member, Asnaf, Program, sequelize, Op } = require("../../../models");
const { Kegiatan } = require("../../../models");
const { Realisasi_permohonan } = require("../../../models");
const { Riwayat_donasi } = require("../../../models");
const moment = require("moment");
const riwayat_donasi = require("../../../models/riwayat_donasi");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
  }

  async list_laporan_umum() {
  try {
    // Hitung total data
    const totalMember = await Member.count();
    const totalAsnaf = await Asnaf.count();
    const totalProgram = await Program.count();

    const totalProgramPenyaluran = await Kegiatan.count();
    const totalPenerimaBantuan = await Realisasi_permohonan.count();
    const totalPenyaluranBantuan = await Realisasi_permohonan.sum("nominal_realisasi", {
  where: { status_realisasi: "sudah_direalisasi" }
});

    // ambil awal & akhir hari ini
const startOfDay = moment().startOf("day").toDate();
const endOfDay = moment().endOf("day").toDate();

const totalPenerimaanZakatHariIni = await Kegiatan.sum("jumlah_dana", {
  where: {
    sumber_dana: "zakat",
    createdAt: {
      [Op.between]: [startOfDay, endOfDay]
    }
  }
});
    // awal & akhir tahun ini
const startOfYear = moment().startOf("year").toDate();
const endOfYear = moment().endOf("year").toDate();

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


    const totalPenerimaanInfaqHariIni = await Kegiatan.sum("jumlah_dana", {
  where: {
    sumber_dana: "infaq",
    createdAt: {
      [Op.between]: [startOfDay, endOfDay]
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


    const totalPenerimaanDonasiHariIni = await Riwayat_donasi.sum("nominal", {
  where: {
    konfirmasi_pembayaran: "sudah_dikirim",
    createdAt: {
      [Op.between]: [startOfDay, endOfDay]
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
        total_penerima_zakat: {
          totalPenerimaanZakatHariIni,
          totalPenerimaanZakatTahunIni,
          totalPenerimaanZakat
        },
        total_penerimaan_infaq: {
          totalPenerimaanInfaqHariIni,
          totalPenerimaanInfaqTahunIni,
          totalPenerimaanInfaq
        },
        total_penerimaan_donasi: {
          totalPenerimaanDonasiHariIni,
          totalPenerimaanDonasiTahunIni,
          totalPenerimaanDonasi
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

