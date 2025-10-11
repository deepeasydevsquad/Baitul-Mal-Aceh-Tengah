"use strict";

const { Urutan_bagian_monev, sequelize } = require("../../../models");
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

  async updateUrutan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const { jenis_monev, urutan_bagian } = this.req.body;

    try {
      const urutan_bagian_string = JSON.stringify(urutan_bagian);

      const [affectedRows] = await Urutan_bagian_monev.update(
        {
          urutan_bagian: urutan_bagian_string,
          updatedAt: myDate,
        },
        {
          where: { jenis_monev },
          transaction: this.t,
        }
      );

      if (affectedRows === 0) {
        this.state = false;
        this.message = `Jenis monev '${jenis_monev}' tidak ditemukan.`;
        return;
      }

      this.message = `Memperbarui urutan bagian untuk jenis monev: ${jenis_monev}`;
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
        message: "Urutan berhasil diperbarui.",
        data: this.data || null,
      };
    } else {
      await this.t.rollback();
      return {
        success: false,
        message: this.message || "Gagal memperbarui urutan.",
        data: null,
      };
    }
  }
}

module.exports = Model_cud;
