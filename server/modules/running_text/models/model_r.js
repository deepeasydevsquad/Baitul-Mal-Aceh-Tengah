const { Running_text } = require("../../../models");
const { Op } = require("sequelize");

class model_r {
  constructor(req) {
    this.req = req;
  }

  async content_text() {
    try {
      const { search, perpage, pageNumber, activeOnly } = this.req.body;
      const page = parseInt(pageNumber, 10) || 1;
      const limit = parseInt(perpage, 10) || 100;
      const offset = (page - 1) * limit;

      const whereCondition = {};

      // Filter pencarian
      if (search) {
        whereCondition.content = {
          [Op.like]: `%${search}%`,
        };
      }

      // Filter hanya yang aktif
      if (activeOnly) {
        whereCondition.is_active = true;
      }

      // urutkan berdasarkan ID terbaru untuk konsistensi tampilan tabel
      const order = activeOnly
        ? [
            ["order", "ASC"],
            ["id", "ASC"],
          ]
        : [["id", "DESC"]];

      const { count, rows } = await Running_text.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: order,
      });

      return { data: rows, total: count };
    } catch (error) {
      console.error("Error in model_r.content_text:", error);
      throw error;
    }
  }

  async info_runningtext (id) {
    try {
      const info_runningtext = await Running_text.findByPk(id);
      return info_runningtext;
    } catch (error) {
      console.error("Error in model_r.info_runningtext:", error);
      throw error;
    }
  }

  async get_speed_setting() {
    try {
      // Ambil speed dari record pertama (atau record mana saja, karena speed seharusnya sama untuk semua)
      const runningText = await Running_text.findOne();
      
      if (!runningText) {
        return { speed: 80 }; // default speed
      }
      
      return { speed: runningText.speed };
    } catch (error) {
      console.error("Error in model_r.get_speed_setting:", error);
      throw error;
    }
  }
}

module.exports = model_r;