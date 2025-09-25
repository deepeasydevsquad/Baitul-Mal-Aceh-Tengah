const { Urutan_bagian_monev } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async updateUrutan() {
    try {
      const { jenis_monev, urutan_bagian } = this.req.body;
      const urutan_bagian_string = JSON.stringify(urutan_bagian);

      const [affectedRows] = await Urutan_bagian_monev.update(
        { urutan_bagian: urutan_bagian_string },
        { where: { jenis_monev } }
      );

      if (affectedRows === 0) {
        throw new Error(`Jenis monev '${jenis_monev}' tidak ditemukan.`);
      }

      return { message: "Urutan berhasil diperbarui." };
    } catch (error) {
      console.error(`Error updating order for ${this.req.body.jenis_monev}:`, error);
      throw new Error("Gagal memperbarui urutan.");
    }
  }
}

module.exports = Model_cud;

