const {
  sequelize,
  Program_donasi,
  Riwayat_donasi,
  Member,
  Permohonan,
} = require("../../../models");
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

  async initialize() {
    this.t = await sequelize.transaction();
  }

  async delete() {
    const body = this.req.body;
    console.log("==================");
    console.log("body", body);
    console.log("==================");

    await this.initialize();

    try {
      const permohonan = await Permohonan.findByPk(body.id, {
        transaction: this.t,
      });
      if (!permohonan) throw new Error("Data tidak ditemukan");

      await Permohonan.destroy({
        where: { id: body.id },
        transaction: this.t,
      });

      this.state = true;
      this.message = `Riwayat permohonan ID ${body.id} berhasil dihapus`;
    } catch (err) {
      console.error("Delete error:", err);
      this.message = err.message || "Terjadi kesalahan saat menghapus data";
      this.state = false;
    }
  }

  async response() {
    if (this.state) {
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
