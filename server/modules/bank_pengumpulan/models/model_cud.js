"use strict";

const { Bank_pengumpulan, sequelize } = require("../../../models");
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

  async add_bank_pengumpulan_baru() {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const newData = await Bank_pengumpulan.create(
        {
          bank_id: body.bank_id,
          tipe: body.tipe,
          nomor_akun_bank: body.nomor_akun_bank,
          nama_akun_bank: body.nama_akun_bank,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.data = newData;
      this.message = `Menambahkan Bank Pengumpulan Baru dengan ID: ${newData.id}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async edit_bank_pengumpulan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const { id } = this.req.body;
    const body = this.req.body;

    try {
      const dataToUpdate = await Bank_pengumpulan.findByPk(id, {
        transaction: this.t,
      });

      if (!dataToUpdate) {
        this.state = false;
        this.message = `Data dengan ID ${id} tidak ditemukan.`;
        return;
      }

      await dataToUpdate.update(
        {
          bank_id: body.bank_id,
          tipe: body.tipe,
          nomor_akun_bank: body.nomor_akun_bank,
          nama_akun_bank: body.nama_akun_bank,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.data = dataToUpdate;
      this.message = `Memperbarui Bank Pengumpulan dengan ID: ${id}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async delete_bank_pengumpulan() {
    await this.initialize();
    const { id } = this.req.body;

    try {
      const dataToDelete = await Bank_pengumpulan.findByPk(id, {
        transaction: this.t,
      });

      if (!dataToDelete) {
        this.state = false;
        this.message = `Data dengan ID ${id} tidak ditemukan.`;
        return;
      }

      await dataToDelete.destroy({ transaction: this.t });
      this.message = `Menghapus Bank Pengumpulan dengan ID: ${id}`;
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
        message: this.state ? "Operasi berhasil" : this.message,
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
}

module.exports = Model_cud;
