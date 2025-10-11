const { sequelize, Kriteria } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");
const { where } = require("sequelize");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.t = null;
    this.state = true;
    this.message = "";
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async delete() {
    await this.initialize();
    const { id } = this.req.body;

    try {
      // Cek apakah data ada
      const existingData = await Kriteria.findByPk(id, {
        transaction: this.t,
      });
      if (!existingData) {
        throw new Error("Data kriteria tidak ditemukan");
      }

      // Hapus data
      await Kriteria.destroy({
        where: { id },
        transaction: this.t,
      });

      this.message = `Menghapus Kriteria dengan Nama: ${existingData.name}`;
    } catch (error) {
      console.error("Error in delete method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  // response
  async response() {
    try {
      if (this.state) {
        await writeLog(this.req, this.t, { msg: this.message });
        await this.t.commit();
        return { success: true, message: this.message };
      } else {
        await this.t.rollback();
        return { success: false, message: this.message };
      }
    } catch (error) {
      console.error("Error in response method:", error);
      if (this.t) {
        await this.t.rollback();
      }
      return { success: false, message: error.message };
    }
  }
}

module.exports = Model_cud;
