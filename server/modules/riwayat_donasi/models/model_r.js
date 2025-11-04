const {
  Program_donasi,
  Riwayat_donasi,
  Member,
  sequelize,
} = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
  }

  async list_riwayat_donasi() {
    const body = this.req.body;
    const limit = parseInt(body.perpage) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber)
        : 1;
    console.log("List Riwayat Donasi - Page:", body);

    let where = {};
    if (body.status && body.status !== "") {
      where.status = body.status;
    }

    // filter tipe pembayaran
    if (body.tipe_pembayaran && body.tipe_pembayaran !== "") {
      where.tipe_pembayaran = body.tipe_pembayaran;
    }

    if (body.konfirmasi_pembayaran && body.konfirmasi_pembayaran !== "") {
      where.konfirmasi_pembayaran = body.konfirmasi_pembayaran;
    }
    if (body.search && body.search !== "") {
      where["$Member.username$"] = { [Op.like]: `%${body.search}%` };
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
              "fullname",
              "nomor_ktp",
              "kode",
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
      const list = q.rows.map((item) => {
        const row = item.toJSON();
        return {
          id: row.id,
          Program_donasi: row.Program_donasi,
          member_id: row.Member.id,
          member_name: row.Member.fullname,
          member_nik: row.Member.nomor_ktp,
          invoice: row.invoice,
          nominal: row.nominal,
          kode: row.kode,
          status: row.status,
          alasan_penolakan: row.alasan_penolakan,
          konfirmasi_pembayaran: row.konfirmasi_pembayaran,
          tipe_pembayaran: row.tipe_pembayaran,
          nominal_transfer: row.nominal_transfer,
          bukti_transfer: row.bukti_transfer,
          nominal_setoran: row.nominal_setoran,
          bukti_setoran: row.bukti_setoran,
          posisi_uang: row.posisi_uang,
          nama_petugas: row.nama_petugas,
          jabatan_petugas: row.jabatan_petugas,
          datetimes: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        };
      });

      let total_saldo_dikantor = 0;
      let pembayaran_online_dikirim = 0;
      await Riwayat_donasi.findAll({}).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            if (e.posisi_uang === "kantor_baitulmal") {
              total_saldo_dikantor =
                total_saldo_dikantor + (parseInt(e.nominal) + parseInt(e.kode));
            }
            if (
              e.status === "process" &&
              e.tipe_pembayaran === "online" &&
              e.konfirmasi_pembayaran === "sudah_dikirim"
            ) {
              pembayaran_online_dikirim = pembayaran_online_dikirim + 1;
            }
          })
        );
      });

      return {
        data: {
          list: list,
          total_saldo_dikantor: total_saldo_dikantor,
          pembayaran_online_dikirim: pembayaran_online_dikirim,
        },
        total,
      };
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

  async info_riwayat_donasi(id) {
    try {
      const result = await Riwayat_donasi.findByPk(id, {
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
        tipe_pembayaran: result.tipe_pembayaran,
        bukti_transfer: result.bukti_transfer,
        bukti_setoran: result.bukti_setoran,
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

  response(data = null) {
    if (this.state) {
      return { success: true, message: this.message, data };
    } else {
      return { success: false, message: this.message };
    }
  }
}

module.exports = Model_r;
