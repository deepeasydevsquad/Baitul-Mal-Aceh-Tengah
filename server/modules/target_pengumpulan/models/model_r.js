const { Target_pengumpulan } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
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
    return namaBulan[parseInt(bulan, 10) - 1] || "Unknown";
  }

  async list() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    let where = {};

    if (body.tahun && body.tahun !== "") {
      where.tahun = body.tahun;
    }
    if (body.bulan && body.bulan !== "") {
      where.bulan = body.bulan;
    }

    try {
      const result = await Target_pengumpulan.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [
          ["tahun", "ASC"],
          ["bulan", "ASC"],
        ],
        attributes: ["id", "tahun", "bulan", "zakat", "infaq", "donasi"],
        where,
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          tahun: e.tahun,
          bulan: e.bulan,
          bulan_name: this.getBulanName(e.bulan),
          zakat: e.zakat,
          infaq: e.infaq,
          donasi: e.donasi,
        })),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching target pengumpulan data:", error);
      return { data: [], total: 0 };
    }
  }

  async detail() {
    const body = this.req.body;
    try {
      const result = await Target_pengumpulan.findOne({
        where: { tahun: body.tahun, bulan: body.bulan },
      });
      return {
        id: result.id,
        tahun: result.tahun,
        bulan: result.bulan,
        zakat: result.zakat,
        infaq: result.infaq,
        donasi: result.donasi,
      };
    } catch (error) {
      console.error("Error fetching target pengumpulan data:", error);
      return { data: [] };
    }
  }
}

module.exports = Model_r;
