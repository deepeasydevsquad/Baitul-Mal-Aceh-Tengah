const { sequelize, Desa } = require("../../../models");
const Model_r = require("./model_r");
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

  async add() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const insert = await Desa.create(
        {
          name: body.name,
          kecamatan_id: body.kecamatan_id,
          createdAt: myDate,
          updatedAt: myDate,
        },
        { transaction: this.t }
      );

      this.message = `Menambahkan Desa Baru dengan Nama Desa: ${body.name} dan ID Desa: ${insert.id}`;
    } catch (error) {
      console.error("Error in add method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async update() {
    await this.initialize();
    const body = this.req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("--- IGNORE ---");
    console.log("Update body:", body);
    console.log("--- IGNORE ---");
    try {
      const data = await Desa.findByPk(body.id, { transaction: this.t });
      if (!data) throw new Error("Data tidak ditemukan");


      await data.update(
        {
          name: body.name,
          kecamatan_id: body.kecamatan_id,
          updatedAt: date,
        },
        { transaction: this.t , where: { id: body.id }}
        
      );

      this.message = `Memperbarui Desa dengan ID: ${body.id}`;
    } catch (err) {
      console.error("Error in update method:", err);
      this.state = false;
      this.message = err.message;
    }
  }

  async delete() {
    await this.initialize();
    const { id } = this.req.body;

    try {
      console.log("Attempting to delete kecamatan with ID:", id);
      
      // Cek apakah data ada
      const existingData = await Desa.findByPk(id, { transaction: this.t });
      if (!existingData) {
        throw new Error("Data kecamatan tidak ditemukan");
      }

      // Ambil info sebelum dihapus
      const model_r = new Model_r(this.req);
      const info_Desa = await model_r.info_desa(id);
      
      if (!info_Desa) {
        throw new Error("Tidak dapat mengambil informasi kecamatan");
      }

      // Hapus data
      const deleted = await Desa.destroy({
        where: { id },
        transaction: this.t,
      });

      if (!deleted) {
        throw new Error("Gagal menghapus data kecamatan");
      }

      this.message = `Menghapus Desa dengan Nama: ${info_Desa.name} dan ID: ${info_Desa.id}`;
      console.log("Delete successful:", this.message);
      
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