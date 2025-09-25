const { sequelize, Program_donasi, Riwayat_donasi, Member } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
    this.t = null;
  }

  async list() {
    try {
      const data = await Riwayat_donasi.findAll({
        include: [
          {
            model: Program_donasi,
            attributes: ["id", "name", "slug", "banner", "tahun", "deskripsi", "target_donasi_terkumpul", "status", "waktu_donasi", "createdAt", "updatedAt"],
          },
          {
            model: Member,
            attributes: ["id","kode","tipe", "fullname", "nomor_ktp", "nomor_kk", "whatsapp_number","birth_date","alamat","username","password","createdAt","updatedAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      this.state = true;
      this.message = "Berhasil mengambil data riwayat donasi";
      return data;
    } catch (err) {
      console.error("List error:", err);
      this.message = err.message || "Gagal mengambil data riwayat donasi";
      this.state = false;
      return [];
    }
  }

  // Hapus data riwayat donasi
  async delete() {
    const { id } = this.req.body;
    this.t = await sequelize.transaction();

    try {
      if (!id) throw new Error("ID wajib diisi");

      const riwayat = await Riwayat_donasi.findByPk(id, { transaction: this.t });
      if (!riwayat) throw new Error("Data tidak ditemukan");

      await riwayat.destroy({ transaction: this.t });

      this.state = true;
      this.message = `Riwayat donasi ID ${id} berhasil dihapus`;
    } catch (err) {
      console.error("Delete error:", err);
      this.message = err.message || "Terjadi kesalahan saat menghapus data";
      this.state = false;
    }
  }

  // Response konsisten
  async response(data = null) {
    if (this.state) {
      if (this.t) {
        await writeLog(this.req, this.t, { msg: this.message });
        await this.t.commit();
      }
      return { success: true, message: this.message, data };
    } else {
      if (this.t) await this.t.rollback();
      return { success: false, message: this.message };
    }
  }
}

module.exports = Model_cud;
