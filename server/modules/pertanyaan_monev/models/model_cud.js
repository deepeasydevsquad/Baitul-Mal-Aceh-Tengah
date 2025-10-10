"use strict";

const { Pertanyaan_monev, sequelize } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async createPertanyaan() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const { body } = this.req;
    const {
      jenis_monev,
      tipe,
      bagian,
      pertanyaan,
      bentuk_pertanyaan,
      parent_id,
    } = body;

    try {
      const newPertanyaan = await Pertanyaan_monev.create(
        {
          jenis_monev,
          tipe,
          bagian,
          pertanyaan,
          bentuk_pertanyaan,
          parent_id: parent_id || null,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.data = newPertanyaan;
      this.message = `Menambahkan Pertanyaan Monev Baru dengan ID: ${newPertanyaan.id}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async updatePertanyaan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const { id, jenis_monev, tipe, bagian, pertanyaan, bentuk_pertanyaan } =
      this.req.body;

    try {
      const pertanyaanToUpdate = await Pertanyaan_monev.findByPk(id, {
        transaction: this.t,
      });

      if (!pertanyaanToUpdate) {
        this.state = false;
        this.message = `Pertanyaan dengan ID ${id} tidak ditemukan.`;
        return;
      }

      await pertanyaanToUpdate.update(
        {
          jenis_monev,
          tipe,
          bagian,
          pertanyaan,
          bentuk_pertanyaan,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.data = pertanyaanToUpdate;
      this.message = `Memperbarui Pertanyaan Monev dengan ID: ${id}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async deletePertanyaan() {
    await this.initialize();
    const { id } = this.req.body;

    try {
      const pertanyaanToDelete = await Pertanyaan_monev.findByPk(id, {
        transaction: this.t,
      });

      if (!pertanyaanToDelete) {
        this.state = false;
        this.message = `Pertanyaan dengan ID ${id} tidak ditemukan.`;
        return;
      }

      // Hapus semua pertanyaan anak (sub-pertanyaan) terlebih dahulu
      await Pertanyaan_monev.destroy({
        where: {
          parent_id: id,
        },
        transaction: this.t,
      });

      // Hapus pertanyaan induknya
      await pertanyaanToDelete.destroy({ transaction: this.t });

      this.message = `Menghapus Pertanyaan Monev dengan ID: ${id} beserta semua sub-pertanyaannya`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      await this.t.commit();
      return {
        success: true,
        message: this.getSuccessMessage(),
        data: this.data || null,
      };
    } else {
      await this.t.rollback();
      return {
        success: false,
        message: this.message || "Terjadi kesalahan",
        data: null,
      };
    }
  }

  getSuccessMessage() {
    if (this.message.includes("Menambahkan")) {
      return "Pertanyaan berhasil dibuat";
    } else if (this.message.includes("Memperbarui")) {
      return "Pertanyaan berhasil diperbarui";
    } else if (this.message.includes("Menghapus")) {
      return "Pertanyaan dan semua sub-pertanyaannya berhasil dihapus";
    }
    return "Operasi berhasil";
  }
}

module.exports = Model_cud;
