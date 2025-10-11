const {
  Monev,
  sequelize,
  Member,
  Op,
  Kegiatan,
  Permohonan,
  Realisasi_permohonan,
  Pertanyaan_monev,
  Jawaban_monev,
  Urutan_bagian_monev,
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async generateYears(start) {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = start; y <= current; y++) {
      years.push({ value: y.toString(), label: `Tahun ${y}` });
    }
    return years;
  }

  async get_filter_type() {
    try {
      const [dataKegiatan, tahunList] = await Promise.all([
        Kegiatan.findAll({
          attributes: ["id", "nama_kegiatan"],
        }),
        this.generateYears(2024),
      ]);

      return {
        type_kegiatan: dataKegiatan.map((item) => ({
          value: item.id.toString(),
          label: item.nama_kegiatan,
        })),
        type_year: tahunList,
      };
    } catch (error) {
      console.error("Error get_filter_type:", error);
      return [];
    }
  }

  async status_monev(permohonan_id) {
    try {
      const dataMonev = await Monev.findAll({
        where: { permohonan_id },
        attributes: ["id", "jenis_monev", "tipe"],
        raw: true,
      });

      if (!dataMonev.length) return null;

      // Cek status monitoring & evaluasi berdasarkan tipe
      const status_monitoring = dataMonev.some((m) => m.tipe === "monitoring")
        ? "selesai"
        : "belum selesai";

      const status_evaluasi = dataMonev.some((m) => m.tipe === "evaluasi")
        ? "selesai"
        : "belum selesai";

      return {
        jenis_monev: dataMonev.map((m) => m.jenis_monev),
        status_monitoring,
        status_evaluasi,
      };
    } catch (error) {
      console.error("Error status_monev:", error);
      return null;
    }
  }

  async daftar_monev() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;

    const typeFilter = {};
    if (body.type_kegiatan) typeFilter.id = body.type_kegiatan;
    if (body.type_year) typeFilter.tahun = body.type_year;

    try {
      const result = await Realisasi_permohonan.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "biaya_disetujui",
          "status_realisasi",
          "tanggal_realisasi",
          "updatedAt",
        ],
        include: [
          {
            model: Permohonan,
            required: true,
            attributes: ["id", "nomor_akun_bank"],
            include: [
              { model: Member, attributes: ["id", "fullname", "nomor_ktp"] },
              {
                model: Kegiatan,
                attributes: ["id", "nama_kegiatan"],
                required: true,
                where: typeFilter,
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      // Gunakan Promise.all biar paralel
      const data = await Promise.all(
        result.rows.map(async (e) => {
          const monevStatus = await this.status_monev(e.id);
          return {
            id: e.id,
            fullname: e.Permohonan.Member.fullname,
            nomor_ktp: e.Permohonan.Member.nomor_ktp,
            nomor_akun_bank: e.Permohonan.nomor_akun_bank,
            nama_kegiatan: e.Permohonan.Kegiatan.nama_kegiatan,
            biaya_disetujui: e.biaya_disetujui,
            tanggal_realisasi: e.tanggal_realisasi,
            status_realisasi: e.status_realisasi,
            datetimes: moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            ...monevStatus,
          };
        })
      );

      return { data, total: result.count };
    } catch (error) {
      console.error("Terjadi error saat mengambil daftar monev:", error);
      return {
        success: false,
        message: "Terjadi error saat mengambil daftar monev",
        error: error.message,
      };
    }
  }

  async pertanyaan() {
    const body = this.req.body;

    try {
      // Ambil urutan bagian
      const urutanData = await Urutan_bagian_monev.findOne({
        where: { jenis_monev: body.jenis_monev },
        attributes: ["urutan_bagian"],
        raw: true,
      });

      // Parse JSON string ke array JS
      const urutanBagian = JSON.parse(urutanData.urutan_bagian);

      // Ambil semua pertanyaan
      const pertanyaan = await Pertanyaan_monev.findAll({
        where: { jenis_monev: body.jenis_monev, tipe: body.tipe },
        attributes: [
          "id",
          "pertanyaan",
          "tipe",
          "bagian",
          "parent_id",
          "bentuk_pertanyaan",
        ],
        raw: true,
        nest: true,
      });

      // Map sub pertanyaan
      const mapSub = {};
      for (const p of pertanyaan) {
        if (p.parent_id) {
          if (!mapSub[p.parent_id]) mapSub[p.parent_id] = [];
          mapSub[p.parent_id].push(p);
        }
      }

      // Urutkan berdasarkan urutan_bagian yang didefinisikan
      pertanyaan.sort((a, b) => {
        const indexA = urutanBagian.indexOf(a.bagian);
        const indexB = urutanBagian.indexOf(b.bagian);
        return indexA - indexB;
      });

      // Bentuk hasil akhir
      const result = pertanyaan
        .filter((p) => !p.parent_id)
        .map((p) => ({
          id: p.id,
          pertanyaan: p.pertanyaan,
          tipe: p.tipe,
          bagian: p.bagian,
          parent_id: p.parent_id,
          bentuk_pertanyaan: p.bentuk_pertanyaan,
          sub_pertanyaan: (mapSub[p.id] || []).map((s) => ({
            id: s.id,
            pertanyaan: s.pertanyaan,
            tipe: s.tipe,
            bagian: s.bagian,
            parent_id: s.parent_id,
            bentuk_pertanyaan: s.bentuk_pertanyaan,
          })),
        }));

      return result;
    } catch (error) {
      console.error(
        "Terjadi error saat mengambil daftar pertanyaan monitoring:",
        error
      );
      return [];
    }
  }
}

module.exports = Model_r;
