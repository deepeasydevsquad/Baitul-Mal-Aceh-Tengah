const {
  Op,
  sequelize,
  Validasi_syarat_permohonan,
  Realisasi_permohonan,
  Permohonan,
  Member,
  Kegiatan,
  Kriteria,
  Syarat_kegiatan,
  Syarat,
  Bank,
  Desa_area_kegiatan,
  Kecamatan_area_kegiatan,
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

  async permohonan_bantuan() {
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

    const typeFilterKegiatan = {};
    const typeFilterPermohonan = {};

    const validStatus = [
      "process",
      "process_lapangan",
      "approve",
      "reject_berkas",
      "reject_tidak_layak",
      "reject_sudah_pernah",
      "reject_unkriteria",
      "reject_administrasi",
      "ditunda",
      "sudah_direalisasi",
      "belum_direalisasi",
    ];

    // Filter kegiatan
    if (body.type_kegiatan_id) {
      typeFilterKegiatan.id = body.type_kegiatan_id;
    }

    // Filter kategori status_realisasi (proses / approve / reject)
    if (body.type_status_realisasi) {
      if (body.type_status_realisasi === "proses") {
        typeFilterPermohonan.status = {
          [Op.in]: ["process", "process_lapangan"],
        };
      } else if (body.type_status_realisasi === "approve") {
        typeFilterPermohonan.status = "approve";
      } else if (body.type_status_realisasi === "reject") {
        typeFilterPermohonan.status = {
          [Op.in]: validStatus.filter((status) => status.startsWith("reject")),
        };
      } else if (body.type_status_realisasi === "ditunda") {
        typeFilterPermohonan.status = "ditunda";
      }
    }

    // Filter high-level realisasi (sudah_direalisasi / belum_direalisasi)
    if (body.type_realisasi) {
      if (
        !["sudah_direalisasi", "belum_direalisasi"].includes(
          body.type_realisasi
        )
      )
        if (typeFilterPermohonan.status_realisasi) {
          // Combine jika ada filter lain
          typeFilterPermohonan[Op.and] = [
            { status_realisasi: typeFilterPermohonan.status_realisasi },
            { status_realisasi: body.type_realisasi },
          ];
          delete typeFilterPermohonan.status_realisasi;
        } else {
          typeFilterPermohonan.status_realisasi = body.type_realisasi;
        }
    }

    try {
      // STEP 1: Query utama
      let result = await Realisasi_permohonan.findAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "status_realisasi",
          "status",
          "biaya_disetujui",
          "nominal_realisasi",
          "bulan",
        ],
        where: typeFilterPermohonan,
        include: [
          {
            model: Permohonan,
            required: true,
            attributes: ["id", "nomor_akun_bank", "nama_akun_bank", "status"],
            include: [
              { model: Bank, attributes: ["name"], required: true },
              {
                model: Member,
                attributes: ["fullname", "tipe", "desa_id"],
                where: where,
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
                ],
                where: typeFilterKegiatan,
                required: true,
              },
            ],
          },
        ],
      });

      // STEP 2: Kumpulin IDs
      const permohonanIds = result.map((r) => r.id).filter(Boolean);
      const kegiatanIds = result
        .map((r) => r.Permohonan?.Kegiatan?.id)
        .filter(Boolean);
      const desaIds = result
        .map((r) => r.Permohonan?.Member?.desa_id)
        .filter(Boolean);

      // STEP 3: Query tambahan
      const [kriteria, syarat, validasi_syarat, desa] = await Promise.all([
        Kriteria.findAll({
          where: { kegiatan_id: kegiatanIds },
          attributes: ["id", "kegiatan_id", "name"],
          raw: true,
        }),
        Syarat_kegiatan.findAll({
          where: { kegiatan_id: kegiatanIds },
          attributes: ["kegiatan_id"],
          include: [{ model: Syarat, attributes: ["id", "name", "path"] }],
          raw: true,
          nest: true,
        }),
        Validasi_syarat_permohonan.findAll({
          where: { realisasi_permohonan_id: permohonanIds },
          attributes: [
            "realisasi_permohonan_id",
            "file_name",
            "path",
            "status",
          ],
          raw: true,
          nest: true,
        }),
        get_info_lokasi_list(desaIds),
      ]);

      // STEP 3.5: Preload sisa_dana untuk semua kegiatan
      const sisaDanaList = await Promise.all(
        [...new Set(kegiatanIds)].map(async (id) => ({
          id,
          sisa: await this.sisa_dana(id),
        }))
      );
      const sisaDanaMap = Object.fromEntries(
        sisaDanaList.map((d) => [d.id, d.sisa])
      );

      // STEP 4: Mapping helper
      const kriteriaByKegiatan = {};
      kriteria.forEach((k) => {
        if (!kriteriaByKegiatan[k.kegiatan_id])
          kriteriaByKegiatan[k.kegiatan_id] = [];
        kriteriaByKegiatan[k.kegiatan_id].push({
          id: k.id,
          name: k.name,
        });
      });

      const syaratByKegiatan = {};
      syarat.forEach((s) => {
        if (!syaratByKegiatan[s.kegiatan_id])
          syaratByKegiatan[s.kegiatan_id] = [];
        syaratByKegiatan[s.kegiatan_id].push({
          id: s.Syarat.id,
          name: s.Syarat.name,
          path: s.Syarat.path,
        });
      });

      const desaById = {};
      desa.forEach((d) => {
        desaById[d.id] = {
          desa_name: d.desa_name,
          kecamatan_name: d.kecamatan_name,
        };
      });

      const validasiSyaratByRealisasi = {};
      validasi_syarat.forEach((v) => {
        if (!validasiSyaratByRealisasi[v.realisasi_permohonan_id])
          validasiSyaratByRealisasi[v.realisasi_permohonan_id] = {};
        validasiSyaratByRealisasi[v.realisasi_permohonan_id][v.file_name] =
          v.status;
      });

      // STEP TAMBAHAN: filter hanya bulan saat ini
      const currentMonth = moment().format("MM");

      result = result.filter((r) => {
        if (!r) return false;
        const bulan = r.bulan ? moment(r.bulan, "MM").format("MM") : null;

        if (!bulan) return true; // permohonan tahunan

        if (bulan === currentMonth) return true;

        if (
          moment(bulan, "MM").isBefore(moment(currentMonth, "MM")) &&
          r.status_realisasi === "belum_direalisasi" &&
          r.status === "process"
        ) {
          return true;
        }
        return false;
      });

      // STEP 5: Gabungkan ke setiap row
      const finalData = result.map((r) => {
        const kegiatanId = r.Permohonan?.Kegiatan?.id;
        const desaId = r.Permohonan?.Member?.desa_id;
        const sisa_jumlah_dana = sisaDanaMap[kegiatanId] || 0;

        return {
          id: r.id,
          biaya_disetujui: r.biaya_disetujui,
          nominal_realisasi: r.nominal_realisasi,
          Permohonan: {
            id: r.Permohonan?.id,
            bank_name: r.Permohonan?.Bank?.name,
            nomor_akun_bank: r.Permohonan?.nomor_akun_bank,
            nama_akun_bank: r.Permohonan?.nama_akun_bank,
            status: r.Permohonan?.status,
            member_id: r.Permohonan?.Member?.id,
            member_name: r.Permohonan?.Member?.fullname,
            member_tipe: r.Permohonan?.Member?.tipe,
            desa_name: desaById[desaId]?.desa_name || null,
            kecamatan_name: desaById[desaId]?.kecamatan_name || null,
            Kegiatan: {
              id: r.Permohonan?.Kegiatan?.id,
              nama_kegiatan: r.Permohonan?.Kegiatan?.nama_kegiatan,
              sisa_jumlah_dana,
              jumlah_dana: r.Permohonan?.Kegiatan?.jumlah_dana,
              sumber_dana: r.Permohonan?.Kegiatan?.sumber_dana,
              area_penyaluran: r.Permohonan?.Kegiatan?.area_penyaluran,
              status_kegiatan: r.Permohonan?.Kegiatan?.status_kegiatan,
              tahun: r.Permohonan?.Kegiatan?.tahun,
              kriteria: kriteriaByKegiatan[kegiatanId] || [],
              syarat: (syaratByKegiatan[kegiatanId] || []).map((s) => ({
                id: s.id,
                name: s.name,
                status: validasiSyaratByRealisasi[r.id]?.[s.path] || null,
              })),
            },
          },
        };
      });

      return {
        data: finalData,
        total: finalData.length,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total: 0 };
    }
  }

  async list_kegiatan() {
    try {
      // STEP 1: Ambil semua kegiatan tahun ini yg sedang berlangsung
      const allKegiatan = await Permohonan.findAll({
        attributes: ["kegiatan_id"],
        include: [
          {
            model: Kegiatan,
            attributes: [
              "id",
              "nama_kegiatan",
              "tahun",
              "area_penyaluran",
              "status_kegiatan",
            ],
            where: {
              tahun: moment().format("YYYY"),
              status_kegiatan: "sedang_berlangsung",
            },
            required: true,
          },
        ],
      });

      // STEP 2: Helper buat filter kuota
      async function filterKuota(modelArea, kegiatanId) {
        // total kapasitas kuota
        const total = await modelArea.findOne({
          attributes: [
            [sequelize.fn("SUM", sequelize.col("kuota")), "total_kuota"],
          ],
          where: { kegiatan_id: kegiatanId },
          raw: true,
        });

        const totalKuota = Number(total?.total_kuota || 0);

        // total terpakai (permohonan yg sudah direalisasi)
        const used = await Realisasi_permohonan.count({
          where: {
            status_realisasi: "sudah_direalisasi", // field yg menandakan udah kepake
          },
          include: [
            {
              model: Permohonan,
              where: { kegiatan_id: kegiatanId },
              required: true,
              attributes: [], // agar tidak mengambil data redundant
            },
          ],
        });

        return totalKuota - used > 0;
      }

      // STEP 3: Filter kegiatan paralel
      const results = await Promise.all(
        allKegiatan.map(async (p) => {
          const kegiatan = p.Kegiatan;
          const area = kegiatan.area_penyaluran;

          if (area === "desa") {
            const ok = await filterKuota(Desa_area_kegiatan, kegiatan.id);
            return ok ? kegiatan.id : null;
          } else if (area === "kecamatan") {
            const ok = await filterKuota(Kecamatan_area_kegiatan, kegiatan.id);
            return ok ? kegiatan.id : null;
          } else {
            return kegiatan.id;
          }
        })
      );

      let finalIds = results.filter(Boolean);
      finalIds = [...new Set(finalIds)];

      if (!finalIds.length) {
        return { data: [], total: 0 };
      }

      // STEP 4: Ambil detail kegiatan final
      const kegiatan = await Kegiatan.findAndCountAll({
        attributes: ["id", "nama_kegiatan", "tahun", "area_penyaluran"],
        order: [["nama_kegiatan", "ASC"]],
        where: { id: finalIds },
      });

      return {
        data: kegiatan.rows.map((e) => ({
          id: e.id,
          name: `(${e.tahun}) ${e.nama_kegiatan}`,
        })),
        total: kegiatan.count,
      };
    } catch (error) {
      console.error("Error fetching info for kegiatan:", error);
      return { data: [], total: 0 };
    }
  }

  async list_bank() {
    try {
      const banks = await Bank.findAndCountAll({ attributes: ["id", "name"] });
      return {
        data: banks.rows.map((e) => ({
          id: e.id,
          name: e.name,
        })),
        total: banks.count,
      };
    } catch (error) {
      console.error("Error fetching info for bank:", error);
      return { banks: [], members: [] };
    }
  }

  async list_member() {
    try {
      const permohonan = await Realisasi_permohonan.findAll({
        attributes: [],
        where: {
          status_realisasi: "belum_direalisasi",
        },
        include: [
          {
            model: Permohonan,
            attributes: ["member_id"],
            required: true,
          },
        ],
      });
      const memberIds = permohonan
        .map((r) => r.Permohonan.member_id)
        .filter(Boolean); // untuk exclude member yang sudah ada permohonan di tahun yang sama
      console.log(memberIds);
      const members = await Member.findAndCountAll({
        attributes: ["id", "fullname", "tipe"],
        order: [["fullname", "ASC"]],
        where: {
          id: { [Op.notIn]: memberIds },
          tipe: "perorangan",
        },
      });

      return {
        data: members.rows.map((e) => ({ id: e.id, name: e.fullname })),
        total: members.count,
      };
    } catch (error) {
      console.error("Error fetching info for member:", error);
      return { data: [], total: 0 };
    }
  }

  async list_kriteria_syarat() {
    const body = this.req.body;

    try {
      const [kriteria, syarat] = await Promise.all([
        Kriteria.findAndCountAll({
          attributes: ["id", "name"],
          where: { kegiatan_id: body.kegiatan_id },
          order: [["name", "ASC"]],
        }),
        Syarat_kegiatan.findAndCountAll({
          attributes: ["id"],
          where: { kegiatan_id: body.kegiatan_id },
          include: [{ model: Syarat, attributes: ["name", "path"] }],
          order: [[Syarat, "name", "ASC"]],
          raw: true,
          nest: true,
        }),
      ]);

      return {
        data: {
          kriteria: kriteria.rows.map((e) => ({ id: e.id, name: e.name })),
          syarat: syarat.rows.map((e) => ({
            id: e.id,
            name: e.Syarat.name,
            path: e.Syarat.path,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching info for syarat:", error);
      return { data: [], total: 0 };
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
