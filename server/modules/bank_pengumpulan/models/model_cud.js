"use strict";

const { Bank_pengumpulan, sequelize } = require("../../../models");

class Model_cud {
  constructor() {}

  async add_bank_pengumpulan_baru(req) {
    const body = req.body;
    const t = await sequelize.transaction();
    try {
      const newData = await Bank_pengumpulan.create(
        {
          bank_id: body.bank_id,
          tipe: body.tipe,
          nomor_akun_bank: body.nomor_akun_bank,
          nama_akun_bank: body.nama_akun_bank,
        },
        { transaction: t }
      );
      await t.commit();
      return { success: true, message: "Penambahan Berhasil", data: newData };
    } catch (error) {
      await t.rollback();
      console.error("Error saat add_bank_pengumpulan_baru:", error);
      return {
        success: false,
        message: "Terjadi kesalahan: " + error.message,
        data: null,
      };
    }
  }

  async edit_bank_pengumpulan(req) {
    const { id } = req.body;
    const body = req.body;
    const t = await sequelize.transaction();
    try {
      const dataToUpdate = await Bank_pengumpulan.findByPk(id, {
        transaction: t,
      });
      if (!dataToUpdate) {
        await t.rollback();
        return {
          success: false,
          message: `Data dengan ID ${id} tidak ditemukan.`,
          data: null,
        };
      }
      await dataToUpdate.update(
        {
          bank_id: body.bank_id,
          tipe: body.tipe,
          nomor_akun_bank: body.nomor_akun_bank,
          nama_akun_bank: body.nama_akun_bank,
        },
        { transaction: t }
      );
      await t.commit();
      return {
        success: true,
        message: "Perubahan berhasil disimpan",
        data: dataToUpdate,
      };
    } catch (error) {
      await t.rollback();
      console.error(`Error saat edit_bank_pengumpulan (ID: ${id}):`, error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menyimpan perubahan: " + error.message,
        data: null,
      };
    }
  }

  async delete_bank_pengumpulan(req) {
    const { id } = req.body;
    const t = await sequelize.transaction();
    try {
      const dataToDelete = await Bank_pengumpulan.findByPk(id, {
        transaction: t,
      });

      if (!dataToDelete) {
        await t.rollback();
        return {
          success: false,
          message: `Data dengan ID ${id} tidak ditemukan.`,
        };
      }

      await dataToDelete.destroy({ transaction: t });

      await t.commit();

      return { success: true, message: "Data berhasil dihapus." };
    } catch (error) {
      await t.rollback();
      console.error(`Error saat delete_bank_pengumpulan (ID: ${id}):`, error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menghapus data: " + error.message,
      };
    }
  }
}

module.exports = Model_cud;
