"use strict";

const { where } = require("sequelize");
const {
  Monev,
  sequelize,
  Member,
  Op,
  Kegiatan,
  Permohonan,
  Realisasi_permohonan,
  Pertanyaan_monev,
  Jawaban_monev,
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async gabung_status_monev() {
    try {
      // Ambil semua data Monev
      const monevData = await Monev.findAll({
        attributes: ["id", "jenis_monev", "tipe"],
      });

      // Ambil semua jawaban (hanya id monev)
      const jawabanData = await Jawaban_monev.findAll({
        attributes: ["monev_id"],
      });

      // Buat set untuk percepatan pencarian
      const sudahDijawab = new Set(jawabanData.map((j) => j.monev_id));

      const hasilGabungan = [];

      // Loop tiap record monev, langsung cek statusnya per tipe
      for (const m of monevData) {
        const baseJenis = m.jenis_monev
          .replace("monitoring_", "")
          .replace("evaluasi_", "");

        // Cek status dari tipe monitoring & evaluasi
        let entry = hasilGabungan.find((e) => e.jenis_monev === baseJenis);
        if (!entry) {
          entry = {
            jenis_monev: baseJenis,
            status_monitoring: "belum selesai",
            status_evaluasi: "belum selesai",
          };
          hasilGabungan.push(entry);
        }

        if (m.tipe === "monitoring" && sudahDijawab.has(m.id)) {
          entry.status_monitoring = "selesai";
        }
        if (m.tipe === "evaluasi" && sudahDijawab.has(m.id)) {
          entry.status_evaluasi = "selesai";
        }
      }
      console.log("_____DDDDDDDDD______:");
      console.log(hasilGabungan);
      console.log("_____DDDDDDDDD______:");

      return hasilGabungan;
    } catch (error) {
      console.error("Error gabung_status_monev:", error);
      return [];
    }
  }
  //  Daftar Monev (status ditentukan per record Monev)
  async daftar_monev() {
    try {
      let { page = 1, limit = 10 } = this.req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const totalData = await Permohonan.count();

      const data = await Permohonan.findAll({
        limit,
        offset,
        order: [["id", "ASC"]],
        include: [
          { model: Member, attributes: ["id", "fullname", "nomor_ktp"] },
          { model: Kegiatan, attributes: ["id", "nama_kegiatan"] },
          {
            model: Realisasi_permohonan,
            attributes: [
              "id",
              "biaya_disetujui",
              "status_realisasi",
              "tanggal_realisasi",
            ],
          },
          {
            model: Monev,
            attributes: ["id", "jenis_monev", "tipe", "nama_petugas_monev"],
            include: [
              {
                model: Jawaban_monev,
                attributes: ["id", "jawaban", "pertanyaan_id"],
                required: false, // biar tetap muncul walau belum ada jawaban
              },
            ],
          },
        ],
      });

      const result = data.map((item) => ({
        id: item.id,
        fullname: item.Member?.fullname || null,
        nomor_akun_bank: item.nomor_akun_bank || null,
        nomor_ktp: item.Member?.nomor_ktp || null,
        kegiatan: item.Kegiatan?.nama_kegiatan || null,
        realisasi:
          item.Realisasi_permohonans?.map((r) => ({
            id: r.id,
            biaya_disetujui: r.biaya_disetujui,
            status_realisasi: r.status_realisasi,
            tanggal_realisasi: moment(r.tanggal_realisasi).format("YYYY-MM-DD"),
          })) || [],
        monev:
          item.Monevs?.map((m) => {
            const adaJawaban =
              Array.isArray(m.Jawaban_monevs) && m.Jawaban_monevs.length > 0;

            // Tentukan status per record monev
            const status_monitoring =
              m.tipe === "monitoring"
                ? adaJawaban
                  ? "selesai"
                  : "belum selesai"
                : "tidak berlaku";

            const status_evaluasi =
              m.tipe === "evaluasi"
                ? adaJawaban
                  ? "selesai"
                  : "belum selesai"
                : "tidak berlaku";

            return {
              id: m.id,
              jenis_monev: m.jenis_monev,
              tipe: m.tipe,
              petugas: m.nama_petugas_monev,
              status_monitoring,
              status_evaluasi,
            };
          }) || [],
      }));

      const totalPages = Math.ceil(totalData / limit);

      return {
        success: true,
        message: "Daftar monev berhasil diambil",
        pagination: {
          total_data: totalData,
          total_pages: totalPages,
          current_page: page,
          per_page: limit,
        },
        data: result,
      };
    } catch (error) {
      console.error("Terjadi error saat mengambil daftar monev:", error);
      return {
        success: false,
        message: "Terjadi error saat mengambil daftar monev",
        error: error.message,
      };
    }
  }

  //  Pertanyaan Evaluasi
  async pertanyaan_evaluasi() {
    const pertanyaan_evaluasi = await Pertanyaan_monev.findAll({
      where: { tipe: "evaluasi" },
    });
    return pertanyaan_evaluasi.map((item) => ({
      id: item.id,
      pertanyaan: item.pertanyaan,
    }));
  }

  //  Pertanyaan Monitoring
  async pertanyaan_monitoring() {
    const pertanyaan_monitoring = await Pertanyaan_monev.findAll({
      where: { tipe: "monitoring" },
    });
    return pertanyaan_monitoring.map((item) => ({
      id: item.id,
      pertanyaan: item.pertanyaan,
    }));
  }
}

module.exports = Model_r;
