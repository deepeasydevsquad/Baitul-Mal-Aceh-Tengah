const {
  Op,
  sequelize,
  Validasi_syarat_permohonan,
  Realisasi_permohonan,
  Permohonan,
  Member,
  Kegiatan,
  Syarat_kegiatan,
  Syarat,
  Bank,
} = require("../../../models");
const { get_info_lokasi_list } = require("../../../helper/locationHelper");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async sisa_dana(id) {
    try {
      const [dataKegiatan, dataPermohonan] = await Promise.all([
        Kegiatan.findOne({
          where: { id },
          attributes: ["jumlah_dana"],
          raw: true,
        }),
        Realisasi_permohonan.findOne({
          raw: true,
          attributes: [
            [
              sequelize.fn(
                "COALESCE",
                sequelize.fn("SUM", sequelize.col("nominal_realisasi")),
                0
              ),
              "total",
            ],
          ],
          include: [
            {
              model: Permohonan,
              where: { kegiatan_id: id },
              required: true,
              attributes: [],
            },
          ],
        }),
      ]);
      const totalRealisasi = parseInt(dataPermohonan.total, 10) || 0;
      return dataKegiatan.jumlah_dana - totalRealisasi;
    } catch (error) {
      console.error("Error sisa_dana:", error);
      return null;
    }
  }

  async get_filter_type() {
    try {
      const data = await Kegiatan.findAndCountAll({
        attributes: ["id", "nama_kegiatan", "tahun"],
        raw: true,
        where: {
          tahun: {
            [Op.gte]: new Date().getFullYear() - 4,
          },
        },
        order: [["tahun", "DESC"]],
      });
      return {
        data: data.rows.map((e) => ({
          value: e.id,
          label: `[${e.tahun}] ${e.nama_kegiatan}`,
        })),
        total: data.total,
      };
    } catch (error) {
      console.error("Error get_filter_type:", error);
      return null;
    }
  }

  async validasi_permohonan_bantuan() {
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
          ],
        }
      : {};

    // Filter kegiatan
    const typeFilterKegiatan = {};
    if (body.type_kegiatan_id) {
      typeFilterKegiatan.id = body.type_kegiatan_id;
    }

    try {
      const currentYear = moment().year();
      const currentMonth = moment().month() + 1; // 1-12

      // STEP 1: Query utama - hanya permohonan berlangsung dan belum divalidasi
      let result = await Realisasi_permohonan.findAll({
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "status_realisasi",
          "status",
          "biaya_disetujui",
          "nominal_realisasi",
          "bulan",
          "permohonan_id",
        ],
        where: {
          status: "process", // Hanya yang belum divalidasi (belum approve)
        },
        include: [
          {
            model: Permohonan,
            where: {
              status: "sedang_berlangsung", // Hanya permohonan berlangsung
            },
            required: true,
            attributes: ["id", "nomor_akun_bank", "nama_akun_bank", "status"],
            include: [
              { model: Bank, attributes: ["name"], required: true },
              {
                model: Member,
                attributes: ["fullname", "tipe", "desa_id"],
                where,
                required: true,
              },
              {
                model: Kegiatan,
                attributes: [
                  "id",
                  "nama_kegiatan",
                  "jumlah_dana",
                  "sumber_dana",
                  "area_penyaluran",
                  "status_kegiatan",
                  "tahun",
                  "periode_bantuan", // tahunan atau bulanan
                ],
                where: typeFilterKegiatan,
                required: true,
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      // STEP 2: Filter dan group berdasarkan logika periode bantuan
      const grouped = {};

      for (const r of result) {
        const kegiatanId = r.Permohonan?.Kegiatan?.id;
        const tahunKegiatan = r.Permohonan?.Kegiatan?.tahun;
        const periodeBantuan = r.Permohonan?.Kegiatan?.periode_bantuan;
        const bulan = r.bulan;

        if (!kegiatanId) continue;

        // Buat unique key: kegiatan_id + permohonan_id
        const permohonanId = r.permohonan_id;
        const groupKey = `${kegiatanId}_${permohonanId}`;

        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            tahunKegiatan,
            periodeBantuan,
            rows: [],
          };
        }
        grouped[groupKey].rows.push(r);
      }

      // STEP 3: Pilih data yang tepat berdasarkan periode bantuan
      let filtered = [];

      Object.values(grouped).forEach(
        ({ tahunKegiatan, periodeBantuan, rows }) => {
          if (periodeBantuan === "tahunan") {
            // Jika tahunan, hanya muncul sekali (bulan = null)
            const tahunanRow = rows.find((r) => r.bulan === null);
            if (tahunanRow) {
              filtered.push(tahunanRow);
            }
          } else if (periodeBantuan === "bulanan") {
            // Jika bulanan, tampilkan sesuai bulan berjalan
            const rowsBulanan = rows.filter((r) => r.bulan !== null);

            if (currentYear === tahunKegiatan) {
              // Tahun sama: tampilkan data bulan sekarang
              const currentMonthRow = rowsBulanan.find(
                (r) => r.bulan === currentMonth
              );

              if (currentMonthRow) {
                filtered.push(currentMonthRow);
              }
              // Jika bulan sekarang belum ada, tidak perlu tampilkan
            } else if (currentYear > tahunKegiatan) {
              // Tahun sudah lewat: tampilkan bulan 12 jika belum divalidasi
              const bulan12Row = rowsBulanan.find((r) => r.bulan === 12);
              if (bulan12Row) {
                filtered.push(bulan12Row);
              }
            }
            // Jika tahun belum sampai, tidak perlu tampilkan
          }
        }
      );

      // STEP 4: Apply pagination setelah filtering
      const total = filtered.length;
      const paginatedResult = filtered.slice((page - 1) * limit, page * limit);

      // STEP 5: Kumpulin IDs dari data yang sudah di-paginate
      const realisasiIds = paginatedResult.map((r) => r.id).filter(Boolean);
      const kegiatanIds = [
        ...new Set(
          paginatedResult.map((r) => r.Permohonan?.Kegiatan?.id).filter(Boolean)
        ),
      ];
      const desaIds = [
        ...new Set(
          paginatedResult
            .map((r) => r.Permohonan?.Member?.desa_id)
            .filter(Boolean)
        ),
      ];

      // STEP 6: Query tambahan (parallel) - syarat dan validasi syarat
      const [syarat, validasi_syarat, desa, sisaDanaList] = await Promise.all([
        Syarat_kegiatan.findAll({
          where: { kegiatan_id: kegiatanIds },
          attributes: ["kegiatan_id"],
          include: [
            {
              model: Syarat,
              attributes: ["id", "name", "path"],
            },
          ],
          raw: true,
          nest: true,
        }),
        Validasi_syarat_permohonan.findAll({
          where: { realisasi_permohonan_id: realisasiIds },
          attributes: [
            "id",
            "realisasi_permohonan_id",
            "file_name",
            "path",
            "status", // process, approve, reject
            "alasan_penolakan",
          ],
          raw: true,
        }),
        get_info_lokasi_list(desaIds),
        Promise.all(
          kegiatanIds.map(async (id) => ({
            id,
            sisa: await this.sisa_dana(id),
          }))
        ),
      ]);

      // STEP 7: Mapping helper
      const sisaDanaMap = Object.fromEntries(
        sisaDanaList.map((d) => [d.id, d.sisa])
      );

      // Group syarat by kegiatan_id
      const syaratByKegiatan = {};
      syarat.forEach((s) => {
        if (!syaratByKegiatan[s.kegiatan_id]) {
          syaratByKegiatan[s.kegiatan_id] = [];
        }
        syaratByKegiatan[s.kegiatan_id].push({
          id: s.Syarat.id,
          name: s.Syarat.name,
          path: s.Syarat.path,
        });
      });

      const desaById = desa.reduce((acc, d) => {
        acc[d.id] = {
          desa_name: d.desa_name,
          kecamatan_name: d.kecamatan_name,
        };
        return acc;
      }, {});

      // Group validasi syarat by realisasi_permohonan_id
      // Key: realisasi_permohonan_id, Value: { file_name: validasi_data }
      const validasiByRealisasi = {};
      validasi_syarat.forEach((v) => {
        if (!validasiByRealisasi[v.realisasi_permohonan_id]) {
          validasiByRealisasi[v.realisasi_permohonan_id] = {};
        }
        // Simpan berdasarkan file_name untuk matching dengan syarat.path
        validasiByRealisasi[v.realisasi_permohonan_id][v.file_name] = {
          id: v.id,
          file_name: v.file_name,
          path: v.path,
          status: v.status,
          alasan_penolakan: v.alasan_penolakan,
        };
      });

      // STEP 8: Gabungkan ke setiap row dengan format clean untuk frontend
      const finalData = paginatedResult.map((r) => {
        const kegiatanId = r.Permohonan?.Kegiatan?.id;
        const desaId = r.Permohonan?.Member?.desa_id;
        const sisa_jumlah_dana = sisaDanaMap[kegiatanId] || 0;
        const syaratList = syaratByKegiatan[kegiatanId] || [];
        const validasiPermohonan = validasiByRealisasi[r.id] || {};

        // Sandingkan syarat dengan validasi berdasarkan syarat.path = validasi.file_name
        const syarat_persyaratan = syaratList.map((s) => {
          const validasi = validasiPermohonan[s.path]; // Match berdasarkan path
          return {
            syarat_id: s.id,
            syarat_name: s.name,
            syarat_path: s.path, // Original path dari syarat
            validasi_id: validasi?.id || null,
            file_name: validasi?.file_name || null,
            file_path: validasi?.path || null, // Path file yang diupload
            status_validasi: validasi?.status || null, // process, approve, reject, atau null
            alasan_penolakan: validasi?.alasan_penolakan || null,
            has_file: !!validasi, // boolean untuk cek apakah sudah upload
          };
        });

        // Hitung status validasi
        const totalSyarat = syarat_persyaratan.length;
        const approvedCount = syarat_persyaratan.filter(
          (s) => s.status_validasi === "approve"
        ).length;
        const rejectedCount = syarat_persyaratan.filter(
          (s) => s.status_validasi === "reject"
        ).length;
        const processCount = syarat_persyaratan.filter(
          (s) => s.status_validasi === "process"
        ).length;
        const pendingCount = syarat_persyaratan.filter(
          (s) => !s.status_validasi
        ).length;

        return {
          // === INFO REALISASI ===
          realisasi_id: r.id,
          periode_bulan: r.bulan, // null untuk tahunan, 1-12 untuk bulanan
          status_realisasi: r.status_realisasi,
          status: r.status,

          // === INFO PERMOHONAN ===
          permohonan_id: r.Permohonan?.id,
          status_permohonan: r.Permohonan?.status,

          // === INFO PEMOHON ===
          member_name: r.Permohonan?.Member?.fullname,
          member_tipe: r.Permohonan?.Member?.tipe,
          desa_name: desaById[desaId]?.desa_name || null,
          kecamatan_name: desaById[desaId]?.kecamatan_name || null,

          // === INFO BANK ===
          bank_name: r.Permohonan?.Bank?.name,
          nomor_akun_bank: r.Permohonan?.nomor_akun_bank,
          nama_akun_bank: r.Permohonan?.nama_akun_bank,

          // === INFO KEGIATAN ===
          kegiatan_id: kegiatanId,
          nama_kegiatan: r.Permohonan?.Kegiatan?.nama_kegiatan,
          periode_bantuan: r.Permohonan?.Kegiatan?.periode_bantuan, // tahunan/bulanan
          tahun_kegiatan: r.Permohonan?.Kegiatan?.tahun,
          total_dana_kegiatan: r.Permohonan?.Kegiatan?.jumlah_dana,
          sisa_dana_kegiatan: sisa_jumlah_dana,
          sumber_dana: r.Permohonan?.Kegiatan?.sumber_dana,
          area_penyaluran: r.Permohonan?.Kegiatan?.area_penyaluran,

          // === INFO SYARAT & VALIDASI ===
          syarat_persyaratan, // Array berisi detail setiap syarat dengan status validasinya
          total_syarat: totalSyarat,
          syarat_approved: approvedCount,
          syarat_rejected: rejectedCount,
          syarat_process: processCount,
          syarat_pending: pendingCount, // Belum upload
          all_syarat_approved: approvedCount === totalSyarat && totalSyarat > 0, // Flag untuk enable button approve permohonan
        };
      });

      return {
        data: finalData,
        total,
        summary: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching validasi permohonan:", error);
      return { data: [], total: 0 };
    }
  }

  async get_info_edit_file() {
    const body = this.req.body;

    console.log("--------------");
    console.log(body);
    console.log("--------------");

    try {
      const dataValidasiSyarat = await Validasi_syarat_permohonan.findOne({
        where: { realisasi_permohonan_id: body.id, id: body.validasi_id },
        attributes: ["id", "file_name", "path", "status", "alasan_penolakan"],
        raw: true,
        nest: true,
      });

      return {
        validasi_id: dataValidasiSyarat?.id || null,
        file_name: dataValidasiSyarat?.file_name || null,
        file_path: dataValidasiSyarat?.path || null, // Path file yang diupload
        status_validasi: dataValidasiSyarat?.status || null, // process, approve, reject, atau null
        alasan_penolakan: dataValidasiSyarat?.alasan_penolakan || null,
        has_file: !!dataValidasiSyarat, // boolean untuk cek apakah sudah upload
      };
    } catch (error) {
      console.error("Error fetching info for permohonan:", error);
      return null;
    }
  }

  async get_info_edit() {
    const body = this.req.body;

    try {
      const realisasi = await Realisasi_permohonan.findByPk(body.id, {
        attributes: ["id", "permohonan_id"],
      });

      const permohonan = await this.info_permohonan(realisasi.permohonan_id);
      const member = await this.info_member(permohonan.member_id);

      // --- Ambil syarat
      const syaratData = await Syarat_kegiatan.findAll({
        attributes: ["id", "kegiatan_id"],
        where: { kegiatan_id: permohonan.kegiatan_id },
        include: [{ model: Syarat, attributes: ["id", "name", "path"] }],
        order: [[Syarat, "name", "ASC"]],
        raw: true,
        nest: true,
      });

      // --- Ambil validasi
      const validasiData = await Validasi_syarat_permohonan.findAll({
        attributes: ["id", "file_name", "path"],
        where: { realisasi_permohonan_id: body.id },
        raw: true,
      });

      // --- Index validasi by syarat_id
      const validasiByPath = {};
      validasiData.forEach((v) => {
        validasiByPath[v.file_name] = v; // asumsi: path unik untuk binding sesuai syaratfile
      });

      // --- Gabung syarat + validasi
      const syarat = syaratData.map((e) => {
        const v = validasiByPath[e.Syarat.path] || {}; // ambil validasi kalau ada
        return {
          id: v.id,
          name: e.Syarat.name,
          path: e.Syarat.path,
          file_path: v.path || null,
        };
      });

      return { permohonan, member, syarat };
    } catch (error) {
      console.error("Error fetching info for permohonan:", error);
      return null;
    }
  }

  async get_info_persetujuan() {
    const body = this.req.body;

    try {
      const permohonan = await this.info_permohonan(body.id);
      const kegiatan = await this.info_kegiatan(permohonan.kegiatan_id);
      const sisa_dana = await this.sisa_dana(permohonan.kegiatan_id);

      let data = {
        jumlah_maksimal_nominal_bantuan:
          kegiatan.jumlah_maksimal_nominal_bantuan,
        sisa_dana,
      };

      return data;
    } catch (error) {
      console.error("Error fetching info for permohonan:", error);
      return null;
    }
  }

  async info_realisasi(realisasi_id) {
    try {
      const realisasi = await Realisasi_permohonan.findOne({
        where: { id: realisasi_id },
        raw: true,
        nest: true,
      });
      return realisasi;
    } catch (error) {
      console.error("Error fetching info for permohonan:", error);
      return null;
    }
  }

  async info_permohonan(permohonan_id) {
    try {
      const permohonan = await Permohonan.findOne({
        where: { id: permohonan_id },
        raw: true,
        nest: true,
        attributes: [
          "id",
          "member_id",
          "kegiatan_id",
          "bank_id",
          "nomor_akun_bank",
          "nama_akun_bank",
          "status",
          "alasan_penolakan",
        ],
      });
      return permohonan;
    } catch (error) {
      console.error("Error fetching info for permohonan:", error);
      return null;
    }
  }

  async info_kegiatan(kegiatan_id) {
    try {
      const kegiatan = await Kegiatan.findOne({
        where: { id: kegiatan_id },
        raw: true,
        nest: true,
        attributes: [
          "id",
          "nama_kegiatan",
          "jumlah_dana",
          "jumlah_maksimal_nominal_bantuan",
          "tahun",
          "area_penyaluran",
          "status_kegiatan",
          "periode_bantuan",
        ],
      });
      return kegiatan;
    } catch (error) {
      console.error("Error fetching info for kegiatan:", error);
      return null;
    }
  }

  async info_member(member_id) {
    try {
      const member = await Member.findOne({
        where: { id: member_id },
        raw: true,
        nest: true,
        attributes: ["id", "fullname", "tipe", "desa_id"],
      });
      return member;
    } catch (error) {
      console.error("Error fetching info for member:", error);
      return null;
    }
  }
}

module.exports = Model_r;
