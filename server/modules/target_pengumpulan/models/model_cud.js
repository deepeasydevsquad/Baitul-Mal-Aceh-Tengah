const { sequelize, Target_pengumpulan } = require("../../../models");
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

  getBulanName(bulan) {
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return namaBulan[parseInt(bulan, 10) - 1] || "Unknown";
  }

  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const insert = await Target_pengumpulan.create(
        {
          tahun: body.tahun,
          bulan: body.bulan,
          zakat: body.zakat,
          infaq: body.infaq,
          donasi: body.donasi,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Target Pengumpulan untuk ${this.getBulanName(
        body.bulan
      )} ${body.tahun}.`;
    } catch (error) {
      this.state = false;
      this.message =
        "Terjadi kesalahan saat menambahkan data: " + error.message;
    }
  }

  async edit() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      await Target_pengumpulan.update(
        {
          zakat: body.zakat,
          infaq: body.infaq,
          donasi: body.donasi,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Memperbarui Target Pengumpulan untuk ${this.getBulanName(
        body.bulan
      )} ${body.tahun}.`;
    } catch (error) {
      this.state = false;
      this.message =
        "Terjadi kesalahan saat memperbarui data: " + error.message;
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const result = await Target_pengumpulan.destroy({
        where: { tahun: body.tahun, bulan: body.bulan },
        transaction: this.t,
      });

      if (result === 0) {
        this.state = false;
        this.message = "Data tidak ditemukan atau sudah dihapus";
      } else {
        this.message = `Menghapus Target Pengumpulan untuk ${this.getBulanName(
          body.bulan
        )} ${body.tahun}.`;
      }
    } catch (error) {
      this.state = false;
      this.message = "Terjadi kesalahan saat menghapus data: " + error.message;
    }
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
