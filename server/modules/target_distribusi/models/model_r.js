const { Asnaf, Target_distribusi, sequelize } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
    this.t = null;
  }

  async list() {
    const body = this.req.body;
    let where = {};

    if (body.tahun && body.tahun !== "") {
      where.tahun = body.tahun;
    }

    if (body.bulan && body.bulan !== "") {
      where.bulan = body.bulan;
    }

    try {
      // ambil semua target distribusi (zakat per asnaf + infaq + donasi)
      const q = await Target_distribusi.findAll({
        attributes: [
          "id",
          "tahun",
          "bulan",
          "tipe",
          "asnaf_id",
          "target_orang",
          "target_rupiah",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Asnaf,
            attributes: ["id", "name"],
            required: false, // biar infaq & donasi tetap bisa (asnaf_id null)
          },
        ],
        where,
        order: [
          ["tahun", "DESC"],
          ["bulan", "DESC"],
          ["tipe", "ASC"],
          ["asnaf_id", "ASC"],
        ],
      });

      const data = q.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          tahun: row.tahun,
          bulan: row.bulan,
          bulan_name: this.getBulanName(row.bulan),
          tipe: row.tipe, // zakat / infaq / donasi
          asnaf_id: row.asnaf_id || null,
          asnaf_name: row.Asnaf ? row.Asnaf.name : null,
          target_orang: parseInt(row.target_orang) || 0,
          target_rupiah: parseInt(row.target_rupiah) || 0,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };
      });

      return {
        state: true,
        message: "Berhasil ambil daftar target distribusi",
        data,
        total: data.length,
      };
    } catch (error) {
      console.error("ERROR in daftar target distribusi:", error);
      return {
        state: false,
        message: "Gagal ambil daftar target distribusi",
        data: [],
        total: 0,
      };
    }
  }

  async list_asnaf() {
    try {
      const asnaf = await Asnaf.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });

      const data = asnaf.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          name: row.name,
        };
      });

      return data;
    } catch (error) {
      console.error("Error fetching asnaf:", error);
      throw new Error("Failed to fetch asnaf");
    }
  }

  async detail_target_distribusi() {
    const body = this.req.body;

    try {
      if (!body.tahun) {
        return {
          state: false,
          message: "Tahun harus dikirim",
          data: { infaq: null, donasi: null, zakat: [] },
        };
      }

      if (!body.bulan) {
        return {
          state: false,
          message: "Bulan harus dikirim",
          data: { infaq: null, donasi: null, zakat: [] },
        };
      }

      const data = await Target_distribusi.findAll({
        attributes: [
          "id",
          "tahun",
          "bulan",
          "tipe",
          "asnaf_id",
          "target_orang",
          "target_rupiah",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Asnaf,
            attributes: ["id", "name"],
            required: false,
          },
        ],
        where: { tahun: body.tahun, bulan: body.bulan },
        order: [
          ["tipe", "ASC"],
          ["asnaf_id", "ASC"],
        ],
      });

      if (!data || data.length === 0) {
        return {
          state: false,
          message: `Data target distribusi ${this.getBulanName(body.bulan)} ${
            body.tahun
          } tidak ditemukan`,
          data: { infaq: null, donasi: null, zakat: [] },
        };
      }

      // === Split per kategori ===
      let infaq = null;
      let donasi = null;
      let zakat = [];

      data.forEach((row) => {
        const r = row.toJSON();
        const base = {
          id: r.id,
          tahun: r.tahun,
          bulan: r.bulan,
          bulan_name: this.getBulanName(r.bulan),
          tipe: r.tipe,
          asnaf_id: r.asnaf_id || null,
          asnaf_name: r.Asnaf ? r.Asnaf.name : null,
          target_orang: parseInt(r.target_orang) || 0,
          target_rupiah: parseInt(r.target_rupiah) || 0,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };

        if (r.tipe === "infaq") infaq = base;
        else if (r.tipe === "donasi") donasi = base;
        else if (r.tipe === "zakat") zakat.push(base);
      });

      return {
        state: true,
        message: `Berhasil ambil detail target distribusi ${this.getBulanName(
          body.bulan
        )} ${body.tahun}`,
        data: { infaq, donasi, zakat },
      };
    } catch (error) {
      console.error("ERROR in detail_target_distribusi:", error);
      return {
        state: false,
        message: "Gagal ambil detail target distribusi",
        data: { infaq: null, donasi: null, zakat: [] },
      };
    }
  }

  getBulanName(bulan) {
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return namaBulan[parseInt(bulan) - 1] || bulan;
  }
}

module.exports = Model_r;
