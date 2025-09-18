const { Op, Member, Desa, Kecamatan } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async gen_kode() {
    let kode;
    let exists = true;

    do {
      // 4 huruf random (A-Z)
      const letters = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      // 6 angka random
      const numbers = Math.floor(100000 + Math.random() * 900000);

      kode = `${letters}${numbers}`;

      exists = await Member.findOne({ where: { kode } });
    } while (exists);

    return kode;
  }

  async daftar_keanggotaan() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page = parseInt(body.pageNumber, 10) || 1;

    const where = body.search
      ? {
          [Op.or]: [
            { fullname: { [Op.like]: `%${body.search}%` } },
            { kode: { [Op.like]: `%${body.search}%` } },
            { whatsapp_number: { [Op.like]: `%${body.search}%` } },
          ],
        }
      : {};

    const typeFilter = body.type
      ? body.type === "perorangan" || body.type === "instansi"
        ? { tipe: body.type }
        : {}
      : {};

    try {
      const result = await Member.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "kode",
          "fullname",
          "tipe",
          "nomor_ktp",
          "nomor_kk",
          "whatsapp_number",
          "birth_date",
          "alamat",
          "updatedAt",
        ],
        where: { ...where, ...typeFilter },
        include: [
          {
            model: Desa,
            attributes: ["id", "name"],
            include: [
              {
                model: Kecamatan,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          kode: e.kode,
          fullname: e.fullname,
          tipe: e.tipe,
          nomor_ktp: e.nomor_ktp,
          nomor_kk: e.nomor_kk,
          whatsapp_number: e.whatsapp_number,
          birth_date: e.birth_date,
          alamat: e.alamat,
          datetime: moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          desa_name: e.Desa.name,
          kecamatan_name: e.Desa.Kecamatan.name,
        })),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching daftar_keanggotaan data:", error);
      return { data: [], total: 0 };
    }
  }

  async daftar_desa() {
    const body = this.req.body;

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
      console.error("Gagal ambil daftar desa:", error);
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
      console.error("Gagal ambil daftar kecamatan:", error);
      return [];
    }
  }

  async get_info_edit_daftar_keanggotaan() {
    const body = this.req.body;

    try {
      const result = await Member.findByPk(body.id, {
        include: [
          {
            model: Desa,
            include: [
              {
                model: Kecamatan,
              attributes: ["id", "name"],
              },
            ],
            attributes: ["id", "name"],
          },
        ],
      });
      return {
        id: result.id,
        kode: result.kode,
        fullname: result.fullname,
        desa_id: result.Desa.id,
        kecamatan_id: result.Desa.Kecamatan.id,
        tipe: result.tipe,
        nomor_ktp: result.nomor_ktp,
        nomor_kk: result.nomor_kk,
        username: result.username,
        whatsapp_number: result.whatsapp_number,
        birth_date: result.birth_date,
        alamat: result.alamat,
      };
    } catch (error) {
      console.error("Error fetching daftar_keanggotaan data:", error);
      return { data: [] };
    }
  }

  async info_daftar_keanggotaan(id) {
    try {
      const result = await Member.findByPk(id)
      return {
        id: result.id,
        kode: result.kode,
        fullname: result.fullname,
        tipe: result.tipe,
        nomor_ktp: result.nomor_ktp,
        nomor_kk: result.nomor_kk,
        whatsapp_number: result.whatsapp_number,
        birth_date: result.birth_date,
        alamat: result.alamat,
        datetime: moment(result.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    } catch (error) {
      console.error("Error fetching daftar_keanggotaan data:", error);
      return {};
    }
  }
}

module.exports = Model_r;
