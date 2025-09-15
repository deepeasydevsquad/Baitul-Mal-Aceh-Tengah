const { sequelize, Grup } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async add() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;
    try {
      const insert = await Grup.create(
        {
          name: body.name,
          group_access: body.group_access,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Grup Baru dengan Nama Grup: ${body.name} dan ID Grup: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  async edit() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const update = await Grup.update(
        {
          name: body.name,
          group_access: body.group_access,
          updatedAt: myDate,
        },
        {
          where: { id: body.id }, // id dikirim dari frontend
          transaction: this.t,
        }
      );

      if (update[0] === 0) {
        // artinya ga ada row yg ke-update
        this.state = false;
        this.message = `Grup dengan ID: ${body.id} tidak ditemukan`;
      } else {
        this.state = true;
        this.message = `Update Grup dengan ID: ${body.id} berhasil`;
      }
    } catch (error) {
      console.error("Error update grup:", error);
      this.state = false;
      this.message = "Gagal update grup";
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const deleted = await Grup.destroy({
        where: { id: body.id }, // id dikirim dari frontend
        transaction: this.t,
      });

      if (deleted === 0) {
        // artinya tidak ada row yang kehapus
        this.state = false;
        this.message = `Grup dengan ID: ${body.id} tidak ditemukan`;
      } else {
        this.state = true;
        this.message = `Grup dengan ID: ${body.id} berhasil dihapus`;
      }
    } catch (error) {
      console.error("Error delete grup:", error);
      this.state = false;
      this.message = "Gagal delete grup";
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
