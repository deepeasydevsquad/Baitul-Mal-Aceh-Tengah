const { Program_donasi, Riwayat_donasi, Member, sequelize } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
  }

  async list_riwayat_donasi() {
    const body = this.req.body;
    const limit = parseInt(body.perpage) || 10;
    const page = body.pageNumber && body.pageNumber !== "0" ? parseInt(body.pageNumber) : 1;
    console.log("List Riwayat Donasi - Page:", body);
    
    let where = {};
    if (body.status && body.status !== "") {
      where.status = body.status;
    }
    if (body.konfirmasi_pembayaran && body.konfirmasi_pembayaran !== "") {
      where.konfirmasi_pembayaran = body.konfirmasi_pembayaran;
    }
    if (body.search && body.search !== "") {
      where["$Member.username$"] = { [Op.like]: `%${body.search}%` }
    }


    try {
      const q = await Riwayat_donasi.findAndCountAll({
        where,
        include: [
          {
            model: Program_donasi,
            attributes: [
              "id",
              "name",
              "tahun",
              "target_donasi_terkumpul",
              "status",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            model: Member,
            attributes: [
              "id",
              "username",
              "nomor_ktp",
              "createdAt",
              "updatedAt",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
        subQuery: false,
      });

      // total data
      const total = q.count || 0;

      // extract data tetap sama
      const data = q.rows.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          nominal: row.nominal,
          status: row.status,
          status_konfirmasi: row.konfirmasi_pembayaran,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          Member: row.Member,
          Program_donasi: row.Program_donasi,
        };
      });

      this.state = true;
      this.message = "Berhasil mengambil data riwayat donasi";

      return { data, total };
    } catch (err) {
      console.error("List riwayat donasi error:", err);
      this.state = false;
      this.message = err.message || "Gagal mengambil data riwayat donasi";
      return { data: [], total: 0 };
    }
  }

  async detail_riwayat_donasi() {
    const { id } = this.req.params;
    try {
      const data = await Riwayat_donasi.findByPk(id, {
        include: [
          {
            model: Program_donasi,
            attributes: [
              "id",
              "name",
              "tahun",
              "target_donasi_terkumpul",
              "status",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            model: Member,
            attributes: [
              "id",
              "username",
              "nomor_ktp",
              "createdAt",
              "updatedAt",
            ],
          },
        ],
      });

      if (!data) throw new Error("Data riwayat donasi tidak ditemukan");

      this.state = true;
      this.message = "Berhasil mengambil detail riwayat donasi";
      return data;
    } catch (err) {
      console.error("Detail riwayat donasi error:", err);
      this.state = false;
      this.message = err.message || "Gagal mengambil detail riwayat donasi";
      return null;
    }
  }

  response(data = null) {
    if (this.state) {
      return { success: true, message: this.message, data };
    } else {
      return { success: false, message: this.message };
    }
  }
}

module.exports = Model_r;
