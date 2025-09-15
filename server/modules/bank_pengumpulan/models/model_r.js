const { Bank_pengumpulan, Bank } = require("../../../models");
const { Op } = require("sequelize");

class model_r {
  constructor(req) {
    this.req = req;
  }

  async daftar_bank_pengumpulan(search, perpage = 10, pageNumber = 1) {
    try {
      const offset = (pageNumber - 1) * perpage;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { nama_akun_bank: { [Op.like]: `%${search}%` } },
          { nomor_akun_bank: { [Op.like]: `%${search}%` } },
          { tipe: { [Op.like]: `%${search}%` } },
          { "$Bank.name$": { [Op.like]: `%${search}%` } },
        ];
      }

      // findAndCountAll untuk mendapatkan data dan totalnya sekaligus
      const { count, rows } = await Bank_pengumpulan.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Bank,
            attributes: ["id", "name"],
            required: true,
          },
        ],
        limit: perpage,
        offset: offset,
        order: [["createdAt", "DESC"]],
        distinct: true,
      });

      return {
        success: true,
        data: rows,
        total: count,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      console.error("Error di daftar_bank_pengumpulan:", error);
      return {
        success: false,
        data: null,
        total: 0,
        message: error.message,
      };
    }
  }

  async daftar_bank() {
    try {
      const data = await Bank.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });
      return {
        success: true,
        data: data,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }
}

module.exports = model_r;
