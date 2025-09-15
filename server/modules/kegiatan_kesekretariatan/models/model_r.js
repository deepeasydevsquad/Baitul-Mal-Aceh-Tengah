"use strict";

const {
  Kegiatan_keseketariatan,
  sequelize,
  Desa,
  Kecamatan,
  Op,
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false; // default gagal
    this.message = null; // pesan default
    this.t = null; // simpan transaction
  }

  async daftar_kegiatan() {
    const body = this.req.body;
    const limit = parseInt(body.perpage) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber)
        : 1;

    let where = {};

    // filter search kalau dikirim
    if (body.search && body.search !== "") {
      where.nama_kegiatan = { [Op.like]: `%${body.search}%` };
      // NOTE: lu tadi pake `where.name`, padahal di attributes ga ada field `name`
      // harusnya `fullname` atau field lain yg sesuai model lu
    }

    const include = [
      {
        model: Desa,
        attributes: ["id", "name"],
      },
    ];

    const sql = {
      limit,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "kode",
        "nama_kegiatan",
        "penerima",
        "jenis_penerima",
        "nominal_kegiatan",
        "area_penyaluran",
        "desa_id",
        "tanggal_penyaluran",
      ],
      where,
      include,
    };

    try {
      const q = await Kegiatan_keseketariatan.findAndCountAll(sql);
      const total = q.count;
      const data = q.rows.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          kode: row.kode,
          nama_kegiatan: row.nama_kegiatan,
          penerima: row.penerima,
          jenis_penerima: row.jenis_penerima,
          nominal_kegiatan: row.nominal_kegiatan,
          area_penyaluran: row.area_penyaluran,
          nama_desa: row.Desa ? row.Desa.name : "-",
          tanggal_penyaluran: moment(row.tanggal_penyaluran).format(
            "YYYY-MM-DD"
          ),
        };
      });
      return {
        data,
        total,
      };
    } catch (error) {
      console.error("🔥 ERROR in daftar request member:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  async daftar_desa() {
    const body = this.req.body;
    console.log("_____________Ddddddddddddddddddddd____________");
    console.log(body);
    console.log("_____________Ddddddddddddddddddddd____________");

    try {
      const sql = await Desa.findAll({
        where: {
          kecamatan_id: body.kecamatan_id,
        },
      });

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
      }));
      return data;
    } catch (error) {
      console.error("Gagal ambil daftar kostumer:", error);
      return [];
    }
  }

  async daftar_kecamatan() {
    try {
      const sql = await Kecamatan.findAll({});

      const data = sql.map((d) => ({
        id: d.id,
        name: d.name,
      }));
      return data;
    } catch (error) {
      console.error("Gagal ambil daftar kostumer:", error);
      return [];
    }
  }
}

module.exports = Model_r;
