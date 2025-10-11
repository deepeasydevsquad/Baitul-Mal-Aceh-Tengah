const { Target_pengumpulan } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {}

  async target_pengumpulan() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    let where = {};

    if (body.search && body.search !== "") {
      const searchYear = parseInt(body.search, 10);

      if (!isNaN(searchYear)) {
        where = {
          tahun: searchYear,
        };
      }
    }

    try {
      const result = await Target_pengumpulan.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["tahun", "DESC"]],
        attributes: ["id", "tahun", "zakat", "infaq", "donasi"],
        where,
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          tahun: e.tahun,
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

  async get_info_edit_target_pengumpulan() {
    const body = this.req.body;
    try {
      const result = await Target_pengumpulan.findByPk(body.id);
      return {
        id: result.id,
        tahun: result.tahun,
        zakat: result.zakat,
        infaq: result.infaq,
        donasi: result.donasi,
      };
    } catch (error) {
      console.error("Error fetching target pengumpulan data:", error);
      return { data: [] };
    }
  }

  async get_available_years() {
    try {
      const years = await Target_pengumpulan.findAll({
        attributes: ["tahun"],
        group: ["tahun"],
        order: [["tahun", "DESC"]],
        raw: true,
      });

      return { data: years.map((item) => item.tahun) };
    } catch (error) {
      console.error("Error fetching available years:", error);
      return { data: [] };
    }
  }
}

module.exports = Model_r;
