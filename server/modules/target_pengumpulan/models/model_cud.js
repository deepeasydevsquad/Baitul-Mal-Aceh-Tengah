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

  async add_target_pengumpulan() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const insert = await Target_pengumpulan.create(
        {
          tahun: body.tahun,
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

      this.message = `Menambahkan Target Pengumpulan Baru dengan ID Target Pengumpulan: ${insert.id}`;
    } catch (error) {
      this.state = false;
      if (error.name === 'SequelizeValidationError') {
        this.message = error.errors[0].message;
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        this.message = 'Target pengumpulan untuk tahun ini sudah ada';
      } else if (error.original && error.original.code === 'ER_DUP_ENTRY') {
        this.message = 'Target pengumpulan untuk tahun ini sudah ada';
      } else if (error.message) {
        this.message = error.message;
      } else {
        this.message = 'Terjadi kesalahan saat menambahkan data';
      }
      console.error('Error in add_target_pengumpulan:', error);
    }
  }

  async edit_target_pengumpulan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      await Target_pengumpulan.update(
        {
          tahun: body.tahun,
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

      this.message = `Memperbarui Target Pengumpulan dengan ID: ${body.id}`;
    } catch (error) {
      this.state = false;
      if (error.name === 'SequelizeValidationError') {
        this.message = error.errors[0].message;
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        this.message = 'Target pengumpulan untuk tahun ini sudah ada';
      } else if (error.original && error.original.code === 'ER_DUP_ENTRY') {
        this.message = 'Target pengumpulan untuk tahun ini sudah ada';
      } else if (error.message) {
        this.message = error.message;
      } else {
        this.message = 'Terjadi kesalahan saat memperbarui data';
      }
      console.error('Error in edit_target_pengumpulan:', error);
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const result = await Target_pengumpulan.destroy({
        where: { id: body.id },
        transaction: this.t,
      });

      if (result === 0) {
        this.state = false;
        this.message = 'Data tidak ditemukan atau sudah dihapus';
      } else {
        this.message = `Menghapus Target Pengumpulan dengan ID: ${body.id}`;
      }
    } catch (error) {
      this.state = false;
      if (error.message) {
        this.message = error.message;
      } else {
        this.message = 'Terjadi kesalahan saat menghapus data';
      }
      console.error('Error in delete:', error);
    }
  }

  // response
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