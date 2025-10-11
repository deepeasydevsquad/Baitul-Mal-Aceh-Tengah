const { Op, Sequelize, Riwayat_donasi, Riwayat_pengumpulan } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async daftar_tipe() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    // filter search kalau ada
    const where = body.search
      ? {
          tipe: { [Op.like]: `%${body.search}%` }
        }
      : {};

    try {
      // ambil distinct tipe dari riwayat_pengumpulan
      const q = await Riwayat_pengumpulan.findAndCountAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("tipe")), "tipe"]
        ],
        where,
        limit,
        offset: (page - 1) * limit,
        order: [[Sequelize.col("tipe"), "ASC"]],
        raw: true
      });

      let data = q.rows.map(r => ({ tipe_pengumpulan: r.tipe }));
      let total = Array.isArray(q.count) ? q.count.length : q.count;

      // === CEK DONASI ===
      const donasiCount = await Riwayat_donasi.count();
      if (donasiCount > 0) {
        // kalau ada data donasi, tambahkan satu tipe 'donasi'
        data.push({ tipe_pengumpulan: "donasi" });
        total += 1;
      }

      return { data, total };
    } catch (error) {
      console.error("🔥 ERROR in daftar_tipe:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
