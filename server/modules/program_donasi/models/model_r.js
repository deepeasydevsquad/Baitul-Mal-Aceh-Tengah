const {
  Program_donasi,
  Riwayat_donasi,
  Member,
  sequelize,
} = require("../../../models");
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
    const limit = parseInt(body.perpage) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber)
        : 1;

    let where = {};

    if (body.status && body.status !== "") {
      where.status = body.status;
    }

    if (body.search && body.search !== "") {
      where.id = { [Op.like]: `%${body.search}%` };
    }

    try {
      const q = await Program_donasi.findAndCountAll({
        attributes: [
          "id",
          "banner",
          "name",
          "tahun",
          "target_donasi_terkumpul",
          "status",
          "createdAt",
          "updatedAt",
          // hitung jumlah orang unik yang donasi
          [
            sequelize.fn(
              "COUNT",
              sequelize.fn(
                "DISTINCT",
                sequelize.col("Riwayat_donasis.member_id")
              )
            ),
            "total_orang",
          ],
          // hitung total nominal donasi yang sukses
          [
            sequelize.fn(
              "SUM",
              sequelize.literal(
                `CASE WHEN Riwayat_donasis.status = 'success' THEN Riwayat_donasis.nominal ELSE 0 END`
              )
            ),
            "total_nominal",
          ],
        ],
        include: [
          {
            model: Riwayat_donasi,
            attributes: [],
          },
        ],
        where,
        group: ["Program_donasi.id"],
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
        subQuery: false,
      });

      // karena ada group, count harus manual
      const total = q.count.length || 0;
      const data = q.rows.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          banner: row.banner,
          name: row.name,
          tahun: row.tahun,
          target_donasi_terkumpul: row.target_donasi_terkumpul,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          total_orang: parseInt(row.total_orang) || 0,
          total_nominal: parseInt(row.total_nominal) || 0,
        };
      });

      return {
        data,
        total,
      };
    } catch (error) {
      console.error("ERROR in daftar riwayat donasi:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  async list_member() {
    try {
      const member = await Member.findAll({
        attributes: ["id", "fullname"],
        order: [["id", "ASC"]],
      });

      const data = member.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          name: row.fullname,
        };
      });

      return data;
    } catch (error) {
      console.error("Error fetching member:", error);
      throw new Error("Failed to fetch member");
    }
  }

  async detail() {
    const body = this.req.body;

    try {
      const program = await Program_donasi.findOne({
        attributes: [
          "id",
          "name",
          "slug",
          "tahun",
          "deskripsi",
          "target_donasi_terkumpul",
          "waktu_donasi",
        ],
        where: { id: body.id },
      });

      if (!program) {
        throw new Error("Program donasi tidak ditemukan");
      }

      return program;
    } catch (error) {
      console.error("ERROR in detail program donasi:", error);
      return null;
    }
  }
}

module.exports = Model_r;
