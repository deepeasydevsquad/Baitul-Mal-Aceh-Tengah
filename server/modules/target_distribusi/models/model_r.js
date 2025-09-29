const { Asnaf, Target_distribusi, sequelize } = require("../../../models");
const { Op } = require("sequelize");

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

    try {
      const q = await Target_distribusi.findAll({
        attributes: [
          "id",
          "tahun",
          "target_orang",
          "target_rupiah",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Asnaf,
            attributes: ["id", "name"],
          },
        ],
        where,
        order: [["asnaf_id", "ASC"]],
      });

      const data = q.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          tahun: row.tahun,
          asnaf_id: row.Asnaf.id,
          asnaf_name: row.Asnaf.name,
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
    console.log("_____________Ddddddddddddddddddddd____________");
    console.log(body);
    console.log("_____________Ddddddddddddddddddddd____________");

    try {
      if (!body.tahun) {
        return {
          state: false,
          message: "Tahun harus dikirim",
          data: [],
        };
      }

      const data = await Target_distribusi.findAll({
        attributes: [
          "id",
          "tahun",
          "target_orang",
          "target_rupiah",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Asnaf,
            attributes: ["id", "name"],
          },
        ],
        where: {
          tahun: body.tahun,
        },
        order: [["asnaf_id", "ASC"]],
      });

      if (!data || data.length === 0) {
        return {
          state: false,
          message: `Data target distribusi tahun ${body.tahun} tidak ditemukan`,
          data: [],
        };
      }

      const result = data.map((row) => ({
        id: row.id,
        tahun: row.tahun,
        asnaf_id: row.Asnaf.id,
        asnaf_name: row.Asnaf.name,
        target_orang: parseInt(row.target_orang) || 0,
        target_rupiah: parseInt(row.target_rupiah) || 0,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return {
        state: true,
        message: `Berhasil ambil detail target distribusi tahun ${body.tahun}`,
        data: result,
      };
    } catch (error) {
      console.error("ERROR in detail_target_distribusi:", error);
      return {
        state: false,
        message: "Gagal ambil detail target distribusi",
        data: [],
      };
    }
  }
}

module.exports = Model_r;
