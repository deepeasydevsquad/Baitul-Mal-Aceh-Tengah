"use strict";

const { Pertanyaan_monev, Jawaban_monev, Monev } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  // KIRIM JAWABAN EVALUASI
  async kirim_jawaban_evaluasi() {
    try {
      const { monev_id, jawaban } = this.req.body;

      if (!monev_id || !Array.isArray(jawaban) || jawaban.length === 0) {
        return { success: false, message: "Data tidak valid." };
      }

      // Ambil data monev
      const monev = await Monev.findByPk(monev_id);
      if (!monev) {
        return { success: false, message: "Data monev tidak ditemukan." };
      }

      // Pastikan tipe monev adalah evaluasi
      if (monev.tipe !== "evaluasi") {
        return { success: false, message: "Tipe monev bukan evaluasi." };
      }

      // Simpan setiap jawaban ke tabel jawaban_monev
      for (const item of jawaban) {
        const { pertanyaan_id, jawaban: isi_jawaban } = item;
        if (
          !pertanyaan_id ||
          isi_jawaban === undefined ||
          isi_jawaban === null ||
          isi_jawaban === ""
        )
          continue;

        await Jawaban_monev.create({
          monev_id,
          pertanyaan_id,
          jawaban: isi_jawaban,
        });
      }

      //  Hitung total pertanyaan dan total jawaban
      const totalPertanyaan = await Pertanyaan_monev.count({
        where: { tipe: "evaluasi" },
      });

      const totalJawaban = await Jawaban_monev.count({
        where: { monev_id },
      });

      // Jika semua pertanyaan sudah dijawab → status selesai
      const status_evaluasi =
        totalJawaban >= totalPertanyaan ? "selesai" : "belum selesai";

      //  Update status evaluasi
      await Monev.update({ status_evaluasi }, { where: { id: monev_id } });

      return {
        success: true,
        message: `Jawaban evaluasi berhasil disimpan dan status diperbarui menjadi "${status_evaluasi}".`,
      };
    } catch (error) {
      console.error("Error kirim_jawaban_evaluasi:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menyimpan jawaban evaluasi.",
        error: error.message,
      };
    }
  }

  // KIRIM JAWABAN MONITORING
  async kirim_jawaban_monitoring() {
    try {
      const { monev_id, jawaban } = this.req.body;

      if (!monev_id || !Array.isArray(jawaban) || jawaban.length === 0) {
        return { success: false, message: "Data tidak valid." };
      }

      // Ambil data monev
      const monev = await Monev.findByPk(monev_id);
      if (!monev) {
        return { success: false, message: "Data monev tidak ditemukan." };
      }

      // Pastikan tipe monev adalah monitoring
      if (monev.tipe !== "monitoring") {
        return { success: false, message: "Tipe monev bukan monitoring." };
      }

      // Simpan setiap jawaban ke tabel jawaban_monev
      for (const item of jawaban) {
        const { pertanyaan_id, jawaban: isi_jawaban } = item;
        if (
          !pertanyaan_id ||
          isi_jawaban === undefined ||
          isi_jawaban === null ||
          isi_jawaban === ""
        )
          continue;

        await Jawaban_monev.create({
          monev_id,
          pertanyaan_id,
          jawaban: isi_jawaban,
        });
      }

      //  Hitung total pertanyaan dan total jawaban
      const totalPertanyaan = await Pertanyaan_monev.count({
        where: { tipe: "monitoring" },
      });

      const totalJawaban = await Jawaban_monev.count({
        where: { monev_id },
      });

      // Jika semua pertanyaan sudah dijawab → status selesai
      const status_monitoring =
        totalJawaban >= totalPertanyaan ? "selesai" : "belum selesai";

      //  Update status monitoring
      await Monev.update({ status_monitoring }, { where: { id: monev_id } });

      return {
        success: true,
        message: `Jawaban monitoring berhasil disimpan dan status diperbarui menjadi "${status_monitoring}".`,
      };
    } catch (error) {
      console.error("Error kirim_jawaban_monitoring:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menyimpan jawaban monitoring.",
        error: error.message,
      };
    }
  }
}

module.exports = Model_cud;
