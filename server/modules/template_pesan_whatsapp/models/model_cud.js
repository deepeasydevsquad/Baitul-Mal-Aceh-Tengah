const moment = require("moment");
const db = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");

const { sequelize } = db;
const Whatsapp_template = db.Whatsapp_template;

class Model_cud {
  constructor(req) {
    this.req = req;
    this.state = false; // default gagal
    this.message = null; // pesan default
    this.t = null; // transaction
  }

  // create data baru
  async create() {
    const body = this.req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.t = await sequelize.transaction();

    try {
      await Whatsapp_template.create(
        {
          name: body.name,
          type: body.type,
          message: body.message,
          variable: JSON.stringify(body.variable),
          createdAt: date,
          updatedAt: date,
        },
        { transaction: this.t }
      );

      this.state = true;
      this.message = "Data berhasil disimpan";
    } catch (err) {
      this.message = err.message;
    }
  }

  // update data
  async update() {
    const body = this.req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.t = await sequelize.transaction();

    try {
      const template = await Whatsapp_template.findByPk(body.id, {
        transaction: this.t,
      });
      if (!template) {
        throw new Error("Data tidak ditemukan");
      }

      await template.update(
        {
          name: body.name,
          type: body.type,
          message: body.message,
          variable: JSON.stringify(body.variable),
          updatedAt: date,
        },
        { transaction: this.t }
      );

      this.state = true;
      this.message = "Data berhasil diperbarui";
    } catch (err) {
      this.message = err.message;
    }
  }

  // hapus data
  async delete() {
    const { id } = this.req.body;
    this.t = await sequelize.transaction();

    try {
      const template = await Whatsapp_template.findByPk(id, {
        transaction: this.t,
      });
      if (!template) {
        throw new Error("Data tidak ditemukan");
      }

      await template.destroy({ transaction: this.t });

      this.state = true;
      this.message = "Data berhasil dihapus";
    } catch (err) {
      this.message = err.message;
    }
  }

  // response setelah query
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
