const {
  Op,
  Sequelize,
  Member,
  Riwayat_pengumpulan,
  Riwayat_donasi,
  Desa,
  Kecamatan,
} = require("../../../models");
const moment = require("moment");
const { fn, col } = Sequelize;

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async list() {
    try {
      // === Ambil tahun dari query param, default tahun berjalan ===
      const targetYear = this.req.query.year
        ? parseInt(this.req.query.year, 10)
        : moment().year();

      // Ambil semua kecamatan (biar muncul walau ga ada data)
      const semuaKecamatan = await Kecamatan.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const finalData = [];

      for (const m of months) {
        const start = moment(`${targetYear}-${m}-01`).startOf("month").toDate();
        const end = moment(`${targetYear}-${m}-01`).endOf("month").toDate();

        // === Data pengumpulan per kecamatan ===
        const pengumpulan = await Riwayat_pengumpulan.findAll({
          attributes: [
            [col("Member->Desa->Kecamatan.id"), "kecamatan_id"],
            [col("Member->Desa->Kecamatan.name"), "nama_kecamatan"],
            [fn("SUM", col("Riwayat_pengumpulan.nominal")), "total_pengumpulan"],
          ],
          include: [
            {
              model: Member,
              attributes: [],
              include: [
                {
                  model: Desa,
                  attributes: [],
                  include: [{ model: Kecamatan, attributes: [] }],
                },
              ],
            },
          ],
          where: {
            updatedAt: { [Op.between]: [start, end] },
            [Op.and]: [
              Sequelize.where(fn("YEAR", col("Riwayat_pengumpulan.updatedAt")), targetYear),
              Sequelize.where(fn("MONTH", col("Riwayat_pengumpulan.updatedAt")), m),
            ],
          },
          group: ["Member->Desa->Kecamatan.id", "Member->Desa->Kecamatan.name"],
          raw: true,
        });

        // === Data donasi per kecamatan ===
        const donasi = await Riwayat_donasi.findAll({
          attributes: [
            [col("Member->Desa->Kecamatan.id"), "kecamatan_id"],
            [col("Member->Desa->Kecamatan.name"), "nama_kecamatan"],
            [fn("SUM", col("Riwayat_donasi.nominal")), "total_donasi"],
          ],
          include: [
            {
              model: Member,
              attributes: [],
              include: [
                {
                  model: Desa,
                  attributes: [],
                  include: [{ model: Kecamatan, attributes: [] }],
                },
              ],
            },
          ],
          where: {
            updatedAt: { [Op.between]: [start, end] },
            [Op.and]: [
              Sequelize.where(fn("YEAR", col("Riwayat_donasi.updatedAt")), targetYear),
              Sequelize.where(fn("MONTH", col("Riwayat_donasi.updatedAt")), m),
            ],
          },
          group: ["Member->Desa->Kecamatan.id", "Member->Desa->Kecamatan.name"],
          raw: true,
        });

        // === Gabung semua data berdasarkan id kecamatan ===
        const kecamatanMap = {};

        // isi dulu semua kecamatan dengan nilai 0
        semuaKecamatan.forEach((k) => {
          kecamatanMap[k.id] = {
            nama_kecamatan: k.name,
            total_pengumpulan: 0,
            total_donasi: 0,
          };
        });

        // update nilai dari hasil query pengumpulan
        pengumpulan.forEach((p) => {
          if (kecamatanMap[p.kecamatan_id]) {
            kecamatanMap[p.kecamatan_id].total_pengumpulan = Number(p.total_pengumpulan) || 0;
          }
        });

        // update nilai dari hasil query donasi
        donasi.forEach((d) => {
          if (kecamatanMap[d.kecamatan_id]) {
            kecamatanMap[d.kecamatan_id].total_donasi = Number(d.total_donasi) || 0;
          }
        });

        // format hasil akhir
        const result = Object.entries(kecamatanMap).map(([id, k]) => ({
          kecamatan_id: Number(id),
          year: targetYear,
          month: m.toString().padStart(2, "0"),
          nama_kecamatan: k.nama_kecamatan,
          total_pengumpulan: k.total_pengumpulan,
          total_donasi: k.total_donasi,
          total_semua: k.total_pengumpulan + k.total_donasi,
        }));

        finalData.push(...result);
      }

      return { data: finalData };
    } catch (err) {
      console.error("🔥 Error in Model_r.list (rekap_pengumpulan_per_kecamatan):", err);
      return { data: [], error: err.message };
    }
  }
}

module.exports = Model_r;
