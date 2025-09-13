const { Op, Bank, Desa, Kecamatan } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async bank() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    const where = body.search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${body.search}%` } }],
        }
      : {};

    try {
      const result = await Bank.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: ["id", "img", "name"],
        where,
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          img: e.img,
          name: e.name,
        })),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching bank data:", error);
      return { data: [], total: 0 };
    }
  }

  async get_info_edit_bank() {
    const body = this.req.body;
    try {
      const result = await Bank.findByPk(body.id);
      return {
        id: result.id,
        img: result.img,
        name: result.name,
      };
    } catch (error) {
      console.error("Error fetching bank data:", error);
      return {};
    }
  }

  async info_bank(id) {
    try {
      const result = await Bank.findByPk(id);
      return {
        id: result.id,
        img: result.img,
        name: result.name,
      };
    } catch (error) {
      console.error("Error fetching bank data:", error);
      return {};
    }
  }
}

module.exports = Model_r;
