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
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  // async gabung_status_monev() {
  //   try {
  //     // Ambil semua data Monev
  //     const monevData = await Monev.findAll({
  //       attributes: ["id", "jenis_monev", "tipe"],
  //     });

  //     // Ambil semua jawaban (hanya id monev)
  //     const jawabanData = await Jawaban_monev.findAll({
  //       attributes: ["monev_id"],
  //     });

  //     // Buat set untuk percepatan pencarian
  //     const sudahDijawab = new Set(jawabanData.map((j) => j.monev_id));

  //     const hasilGabungan = [];

  //     // Loop tiap record monev, langsung cek statusnya per tipe
  //     for (const m of monevData) {
  //       const baseJenis = m.jenis_monev
  //         .replace("monitoring_", "")
  //         .replace("evaluasi_", "");

  //       // Cek status dari tipe monitoring & evaluasi
  //       let entry = hasilGabungan.find((e) => e.jenis_monev === baseJenis);
  //       if (!entry) {
  //         entry = {
  //           jenis_monev: baseJenis,
  //           status_monitoring: "belum selesai",
  //           status_evaluasi: "belum selesai",
  //         };
  //         hasilGabungan.push(entry);
  //       }

  //       if (m.tipe === "monitoring" && sudahDijawab.has(m.id)) {
  //         entry.status_monitoring = "selesai";
  //       }
  //       if (m.tipe === "evaluasi" && sudahDijawab.has(m.id)) {
  //         entry.status_evaluasi = "selesai";
  //       }
  //     }
  //     console.log("_____DDDDDDDDD______:");
  //     console.log(hasilGabungan);
  //     console.log("_____DDDDDDDDD______:");

  //     return hasilGabungan;
  //   } catch (error) {
  //     console.error("Error gabung_status_monev:", error);
  //     return [];
  //   }
  // }

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

  // async daftar_monev() {
  //   try {
  //     let { page = 1, limit = 10 } = this.req.query;
  //     page = parseInt(page);
  //     limit = parseInt(limit);
  //     const offset = (page - 1) * limit;

  //     const totalData = await Permohonan.count();

  //     const data = await Permohonan.findAll({
  //       limit,
  //       offset,
  //       order: [["id", "ASC"]],
  //       include: [
  //         { model: Member, attributes: ["id", "fullname", "nomor_ktp"] },
  //         { model: Kegiatan, attributes: ["id", "nama_kegiatan"] },
  //         {
  //           model: Realisasi_permohonan,
  //           attributes: [
  //             "id",
  //             "biaya_disetujui",
  //             "status_realisasi",
  //             "tanggal_realisasi",
  //           ],
  //         },
  //         {
  //           model: Monev,
  //           attributes: ["id", "jenis_monev", "tipe", "nama_petugas_monev"],
  //           include: [
  //             {
  //               model: Jawaban_monev,
  //               attributes: ["id", "jawaban", "pertanyaan_id"],
  //               required: false, // biar tetap muncul walau belum ada jawaban
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     const result = data.map((item) => ({
  //       id: item.id,
  //       fullname: item.Member?.fullname || null,
  //       nomor_akun_bank: item.nomor_akun_bank || null,
  //       nomor_ktp: item.Member?.nomor_ktp || null,
  //       kegiatan: item.Kegiatan?.nama_kegiatan || null,
  //       realisasi:
  //         item.Realisasi_permohonans?.map((r) => ({
  //           id: r.id,
  //           biaya_disetujui: r.biaya_disetujui,
  //           status_realisasi: r.status_realisasi,
  //           tanggal_realisasi: moment(r.tanggal_realisasi).format("YYYY-MM-DD"),
  //         })) || [],
  //       monev:
  //         item.Monevs?.map((m) => {
  //           const adaJawaban =
  //             Array.isArray(m.Jawaban_monevs) && m.Jawaban_monevs.length > 0;

  //           // Tentukan status per record monev
  //           const status_monitoring =
  //             m.tipe === "monitoring"
  //               ? adaJawaban
  //                 ? "selesai"
  //                 : "belum selesai"
  //               : "tidak berlaku";

  //           const status_evaluasi =
  //             m.tipe === "evaluasi"
  //               ? adaJawaban
  //                 ? "selesai"
  //                 : "belum selesai"
  //               : "tidak berlaku";

  //           return {
  //             id: m.id,
  //             jenis_monev: m.jenis_monev,
  //             tipe: m.tipe,
  //             petugas: m.nama_petugas_monev,
  //             status_monitoring,
  //             status_evaluasi,
  //           };
  //         }) || [],
  //     }));

  //     const totalPages = Math.ceil(totalData / limit);

  //     return {
  //       success: true,
  //       message: "Daftar monev berhasil diambil",
  //       pagination: {
  //         total_data: totalData,
  //         total_pages: totalPages,
  //         current_page: page,
  //         per_page: limit,
  //       },
  //       data: result,
  //     };
  //   } catch (error) {
  //     console.error("Terjadi error saat mengambil daftar monev:", error);
  //     return {
  //       success: false,
  //       message: "Terjadi error saat mengambil daftar monev",
  //       error: error.message,
  //     };
  //   }
  // }

  //  Pertanyaan Evaluasi

  async pertanyaan_evaluasi() {
    try {
      const pertanyaan_evaluasi = await Pertanyaan_monev.findAll({
        order: [["bagian", "ASC"]],
        raw: true,
        nest: true,
        where: { tipe: "evaluasi" },
        attributes: [
          "id",
          "pertanyaan",
          "tipe",
          "bagian",
          "parent_id",
          "bentuk_pertanyaan",
        ],
      });

      // mapping dari id -> sub pertanyaan biar cepat lookup-nya
      const mapSub = {};
      pertanyaan_evaluasi.forEach((item) => {
        if (item.parent_id) {
          if (!mapSub[item.parent_id]) mapSub[item.parent_id] = [];
          mapSub[item.parent_id].push(item);
        }
      });

      // hasil akhir: hanya parent utama yang dimunculkan
      const result = pertanyaan_evaluasi
        .filter((item) => !item.parent_id) // hanya yang bukan anak
        .map((item) => ({
          id: item.id,
          pertanyaan: item.pertanyaan,
          tipe: item.tipe,
          bagian: item.bagian,
          parent_id: item.parent_id,
          bentuk_pertanyaan: item.bentuk_pertanyaan,
          sub_pertanyaan: (mapSub[item.id] || []).map((p) => ({
            id: p.id,
            pertanyaan: p.pertanyaan,
            tipe: p.tipe,
            bagian: p.bagian,
            parent_id: p.parent_id,
            bentuk_pertanyaan: p.bentuk_pertanyaan,
          })),
        }));

      return result;
    } catch (error) {
      console.error(
        "Terjadi error saat mengambil daftar pertanyaan evaluasi:",
        error
      );
      return [];
    }
  }

  //  Pertanyaan Monitoring
  async pertanyaan_monitoring() {
    try {
      const pertanyaan_monitoring = await Pertanyaan_monev.findAll({
        order: [["bagian", "ASC"]],
        raw: true,
        nest: true,
        where: { tipe: "monitoring" },
        attributes: [
          "id",
          "pertanyaan",
          "tipe",
          "bagian",
          "parent_id",
          "bentuk_pertanyaan",
        ],
      });

      // mapping dari id -> sub pertanyaan biar cepat lookup-nya
      const mapSub = {};
      pertanyaan_monitoring.forEach((item) => {
        if (item.parent_id) {
          if (!mapSub[item.parent_id]) mapSub[item.parent_id] = [];
          mapSub[item.parent_id].push(item);
        }
      });

      // hasil akhir: hanya parent utama yang dimunculkan
      const result = pertanyaan_monitoring
        .filter((item) => !item.parent_id) // hanya yang bukan anak
        .map((item) => ({
          id: item.id,
          pertanyaan: item.pertanyaan,
          tipe: item.tipe,
          bagian: item.bagian,
          parent_id: item.parent_id,
          bentuk_pertanyaan: item.bentuk_pertanyaan,
          sub_pertanyaan: (mapSub[item.id] || []).map((p) => ({
            id: p.id,
            pertanyaan: p.pertanyaan,
            tipe: p.tipe,
            bagian: p.bagian,
            parent_id: p.parent_id,
            bentuk_pertanyaan: p.bentuk_pertanyaan,
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
