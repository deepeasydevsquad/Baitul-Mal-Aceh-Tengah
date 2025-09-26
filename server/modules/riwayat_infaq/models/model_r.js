const { Op, Riwayat_pengumpulan, Member } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async gen_invoie() {
    let invoice;
    let exists = true;

    do {
      // 4 huruf random (A-Z)
      const letters = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      // 6 angka random
      const numbers = Math.floor(100000 + Math.random() * 900000);

      invoice = `${letters}${numbers}`;

      exists = await Riwayat_pengumpulan.findOne({ where: { invoice } });
    } while (exists);

    return invoice;
  }

  async member() {
    const result = await Member.findAndCountAll();

    const data = result.rows.map((e) => ({
      id: e.id,
      name: e.fullname,
    }));

    return { data, total: result.count };
  }

  async riwayat_infaq() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    const where = body.search
      ? {
          [Op.or]: [
            { fullname: { [Op.like]: `%${body.search}%` } },
            { nomor_ktp: { [Op.like]: `%${body.search}%` } },
            { kode: { [Op.like]: `%${body.search}%` } },
          ],
        }
      : {};

    const typeFilter = {};
    if (body.status) {
      typeFilter.status = body.status;
    }
    if (body.konfirmasi_pembayaran) {
      typeFilter.konfirmasi_pembayaran = body.konfirmasi_pembayaran;
    }

    try {
      const result = await Riwayat_pengumpulan.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "member_id",
          "invoice",
          "tipe",
          "nominal",
          "kode",
          "status",
          "konfirmasi_pembayaran",
          "updatedAt",
        ],
        where: { ...typeFilter, tipe: "infaq" },
        include: [
          {
            model: Member,
            attributes: ["fullname", "nomor_ktp", "kode"],
            where: where,
            required: true,
          },
        ],
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          invoice: e.invoice,
          tipe: e.tipe,
          nominal: e.nominal,
          kode: e.kode,
          status: e.status,
          konfirmasi_pembayaran: e.konfirmasi_pembayaran,
          member_id: e.member_id,
          member_name: e.Member?.fullname,
          member_nik: e.Member?.nomor_ktp,
          datetimes: moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        })),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching riwayat data infaq:", error);
      return { data: [], total: 0 };
    }
  }

  async info_riwayat_infaq(id) {
    try {
      const result = await Riwayat_pengumpulan.findByPk(id, {
        include: [
          {
            model: Member,
            attributes: ["fullname", "nomor_ktp", "kode"],
          },
        ],
      });
      return {
        id: result.id,
        invoice: result.invoice,
        tipe: result.tipe,
        nominal: result.nominal,
        kode: result.kode,
        status: result.status,
        konfirmasi_pembayaran: result.konfirmasi_pembayaran,
        member_id: result.member_id,
        member_name: result.Member?.fullname,
        member_nik: result.Member?.nomor_ktp,
        datetime: moment(result.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    } catch (error) {
      console.error("Error fetching bank data:", error);
      return {};
    }
  }
}

module.exports = Model_r;
