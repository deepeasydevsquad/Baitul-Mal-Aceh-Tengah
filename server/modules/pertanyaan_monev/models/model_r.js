const { Pertanyaan_monev, Urutan_bagian_monev } = require("../../../models");
const { Op } = require("sequelize");
const { Pertanyaan_monev: PertanyaanMonevModel } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getInfoEdit() {
    const { id } = this.req.body;
    try {
      const pertanyaan = await Pertanyaan_monev.findByPk(id);
      if (!pertanyaan) {
        throw new Error("Pertanyaan tidak ditemukan.");
      }
      return pertanyaan;
    } catch (error) {
      console.error("Error fetching getInfoEdit:", error);
      throw new Error("Gagal mengambil detail pertanyaan.");
    }
  }

  async getJenisMonevList() {
    try {
      const allMonev = await Urutan_bagian_monev.findAll({
        attributes: ["jenis_monev"],
        order: [["id", "ASC"]],
      });
      return allMonev.map((item) => item.jenis_monev);
    } catch (error) {
      console.error("Error fetching jenis monev list:", error);
      throw new Error("Gagal mengambil daftar jenis monev.");
    }
  }

  async getUrutanBagian() {
    const { jenis_monev } = this.req.query;
    if (!jenis_monev) {
      throw new Error("Jenis monev is required");
    }

    if (jenis_monev === "all") {
      try {
        const bagianEnumValues =
          PertanyaanMonevModel.getAttributes().bagian.values;
        return bagianEnumValues;
      } catch (error) {
        console.error("Error fetching all bagian values from ENUM:", error);
        throw new Error("Gagal mengambil semua daftar bagian.");
      }
    }

    try {
      const urutan = await Urutan_bagian_monev.findOne({
        where: { jenis_monev },
        attributes: ["urutan_bagian"],
      });

      if (urutan && urutan.urutan_bagian) {
        return JSON.parse(urutan.urutan_bagian);
      }
      return [];
    } catch (error) {
      console.error("Error fetching urutan bagian:", error);
      throw new Error("Gagal mengambil urutan bagian.");
    }
  }

  async pertanyaan_monev_list() {
    const { body } = this.req;
    const limit = parseInt(body.perpage, 10) || 100;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    const where = {};
    if (body.jenis_monev) {
      where.jenis_monev = body.jenis_monev;
    }

    try {
      const result = await Pertanyaan_monev.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "jenis_monev",
          "tipe",
          "bagian",
          "pertanyaan",
          "parent_id",
          "bentuk_pertanyaan",
        ],
        where,
      });

      return {
        data: result.rows,
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching pertanyaan_monev data:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
