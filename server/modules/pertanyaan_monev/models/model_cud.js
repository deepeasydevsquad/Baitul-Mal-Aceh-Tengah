const { Pertanyaan_monev } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async createPertanyaan() {
    const { body } = this.req;
    const {
      jenis_monev,
      tipe,
      bagian,
      pertanyaan,
      bentuk_pertanyaan,
      parent_id,
    } = body;

    try {
      const newPertanyaan = await Pertanyaan_monev.create({
        jenis_monev,
        tipe,
        bagian,
        pertanyaan,
        bentuk_pertanyaan,
        parent_id: parent_id || null,
      });
      return newPertanyaan;
    } catch (error) {
      console.error("Gagal membuat pertanyaan:", error);
      throw new Error("Terjadi kesalahan saat menyimpan data.");
    }
  }

  async updatePertanyaan() {
    const { id, jenis_monev, tipe, bagian, pertanyaan, bentuk_pertanyaan } = this.req.body;

    try {
      const pertanyaanToUpdate = await Pertanyaan_monev.findByPk(id);
      if (!pertanyaanToUpdate) {
        throw new Error("Pertanyaan tidak ditemukan");
      }

      await pertanyaanToUpdate.update({
        jenis_monev,
        tipe,
        bagian,
        pertanyaan,
        bentuk_pertanyaan,
      });

      return pertanyaanToUpdate;
    } catch (error) {
      console.error("Gagal memperbarui pertanyaan:", error);
      throw new Error("Terjadi kesalahan saat memperbarui data.");
    }
  }

  async deletePertanyaan() {
    const { id } = this.req.body;
    try {
      // Hapus semua pertanyaan anak (sub-pertanyaan) terlebih dahulu
      await Pertanyaan_monev.destroy({
        where: {
          parent_id: id,
        },
      });

      // hapus pertanyaan induknya
      const pertanyaanToDelete = await Pertanyaan_monev.findByPk(id);
      if (!pertanyaanToDelete) {
        throw new Error("Pertanyaan tidak ditemukan");
      }
      await pertanyaanToDelete.destroy();
      
      return { message: "Pertanyaan dan semua sub-pertanyaannya berhasil dihapus" };
    } catch (error) {
      console.error("Gagal menghapus pertanyaan:", error);
      throw new Error("Terjadi kesalahan saat menghapus data.");
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
