const moment = require("moment");
const { User, sequelize } = require("../../../models");
const bcryptjs = require("bcryptjs");
const { writeLog } = require("../../../helper/writeLogHelper");

class Model_cud {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
    this.t = null;
  }

  async generate_kode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async create() {
    const body = this.req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.t = await sequelize.transaction();
    const hashedPassword = await bcryptjs.hash(body.password, 10);
    try {
      await User.create(
        {
          name: body.name,
          jabatan: body.jabatan,
          grup_id: body.grup_id,
          kode: await this.generate_kode(),
          username: body.username,
          password: hashedPassword,
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

  async update() {
    const body = this.req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.t = await sequelize.transaction();

    try {
      const user = await User.findByPk(body.id, { transaction: this.t });
      if (!user) throw new Error("Data tidak ditemukan");

      // siapkan data update dasar
      const updateData = {
        name: body.name,
        jabatan: body.jabatan,
        grup_id: body.grup_id,
        username: body.username,
        updatedAt: date,
      };

      // kalau password ada & ga kosong, baru hash
      if (body.password && body.password.trim() !== "") {
        const hashedPassword = await bcryptjs.hash(body.password, 10);
        updateData.password = hashedPassword;
      }

      await user.update(updateData, { transaction: this.t });

      this.state = true;
      this.message = "Data berhasil diperbarui";
    } catch (err) {
      this.message = err.message;
    }
  }

  async delete() {
    const { id } = this.req.body;
    this.t = await sequelize.transaction();
    try {
      const user = await User.findByPk(id, { transaction: this.t });
      if (!user) throw new Error("Data tidak ditemukan");

      await user.destroy({ transaction: this.t });

      this.state = true;
      this.message = "Data berhasil dihapus";
    } catch (err) {
      this.message = err.message;
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
