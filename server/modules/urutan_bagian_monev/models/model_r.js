const { Urutan_bagian_monev } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getJenisMonevList() {
    try {
      const allMonev = await Urutan_bagian_monev.findAll({
        attributes: ['jenis_monev'],
        order: [['jenis_monev', 'ASC']],
      });
      return allMonev.map(item => item.jenis_monev);
    } catch (error) {
      console.error("Error fetching jenis monev list:", error);
      throw new Error("Gagal mengambil daftar jenis monev.");
    }
  }

  async getUrutanByJenis() {
    try {
      const { jenis_monev } = this.req.body;
      const result = await Urutan_bagian_monev.findOne({
        where: { jenis_monev },
        attributes: ['urutan_bagian', 'updatedAt'],
      });

      if (!result) {
        return {
          urutan: [],
          updatedAt: null
        };
      }
      
      return {
        urutan: JSON.parse(result.urutan_bagian),
        updatedAt: moment(result.updatedAt).format("YYYY-MM-DD HH:mm:ss")
      };
    } catch (error) {
      console.error(`Error fetching order for ${this.req.body.jenis_monev}:`, error);
      throw new Error("Gagal mengambil data urutan.");
    }
  }
}

module.exports = Model_r;

