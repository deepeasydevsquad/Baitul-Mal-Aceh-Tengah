"use strict";

const { Riwayat_pengumpulan, Member } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async list_riwayat_zakat() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    let where = {
      tipe: { [Op.not]: "infaq" }, // ❌ exclude infaq
    };

    // filter status
    if (body.status && body.status !== "") {
      where.status = body.status;
    }

    // filter konfirmasi
    if (body.konfirmasi && body.konfirmasi !== "") {
      where.konfirmasi_pembayaran = body.konfirmasi;
    }

    // filter search (di relasi Member)
    let memberWhere = {};
    if (body.search && body.search !== "") {
      memberWhere = {
        [Op.or]: [
          { fullname: { [Op.like]: `%${body.search}%` } },
          { nomor_ktp: { [Op.like]: `%${body.search}%` } }, // ✅ typo diperbaiki
          { kode: { [Op.like]: `%${body.search}%` } },
        ],
      };
    }

    const sql = {
      limit,
      offset: (page - 1) * limit,
      order: [["id", "ASC"]],
      attributes: [
        "id",
        "invoice",
        "status",
        "nominal",
        "kode",
        "konfirmasi_pembayaran",
        "tipe",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Member,
          attributes: ["id", "fullname", "nomor_ktp"],
          where: memberWhere,
        },
      ],
      where,
    };

    try {
      const q = await Riwayat_pengumpulan.findAndCountAll(sql);
      const total = q.count;

      const data = q.rows.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          invoice: row.invoice,
          status: row.status,
          nominal: row.nominal,
          kode: row.kode,
          konfirmasi_pembayaran: row.konfirmasi_pembayaran,
          tipe: row.tipe,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          member: {
            id: row.Member?.id,
            fullname: row.Member?.fullname,
            nomor_ktp: row.Member?.nomor_ktp,
          },
        };
      });

      return {
        data,
        total,
      };
    } catch (error) {
      console.error("ERROR in daftar riwayat zakat:", error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  async gen_invoice() {
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

      exists = await Riwayat_pengumpulan.findOne({ where: { kode } });
    } while (exists);

    return kode; // ✅ perbaikan return
  }
}

module.exports = Model_r;
