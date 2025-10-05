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

      // === Siapkan array bulan 1–12 ===
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const finalData = [];

      const dataKecamatan = await Kecamatan.findAll({attributes: ["id", "name"], raw: true});

      for (const m of months) {
        // Range tanggal bulan ini
        const start = moment(`${targetYear}-${m}-01`).startOf("month").toDate();
        const end = moment(`${targetYear}-${m}-01`).endOf("month").toDate();

        // === Query pengumpulan per kecamatan per bulan ===
        const [pengumpulan, donasi] = await Promise.all([
          Riwayat_pengumpulan.findAll({
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
              [Op.and]: [
                // filter berdasarkan rentang tanggal
                { updatedAt: { [Op.between]: [start, end] } },
                // filter tahun (pastikan tetap match)
                Sequelize.where(
                  fn("YEAR", col("Riwayat_pengumpulan.updatedAt")),
                  targetYear
                ),
              ],
            },
            group: ["Member->Desa->Kecamatan.id", "Member->Desa->Kecamatan.name"],
            raw: true,
          }),
          Riwayat_donasi.findAll({
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
              [Op.and]: [
                { updatedAt: { [Op.between]: [start, end] } },
                Sequelize.where(
                  fn("YEAR", col("Riwayat_donasi.updatedAt")),
                  targetYear
                ),
                Sequelize.where(fn("MONTH", col("Riwayat_donasi.updatedAt")), m),
              ],
            },
            group: ["Member->Desa->Kecamatan.id", "Member->Desa->Kecamatan.name"],
            raw: true,
          }),
        ]);

        console.log("pengumpulan", pengumpulan, "donasi", donasi);

        const sumByTipe = (rows) => {
          const result = dataKecamatan.reduce(
            (acc, d) => {
              acc[d.id] = {
                nama_kecamatan: d.name,
                total_pengumpulan: 0,
                total_donasi: 0,
              };
              return acc;
            },
            {}
          );

          return rows.reduce(
            (acc, rp) => {
              if (enumRiwayat[rp.tipe] !== undefined) {
                acc[rp.kecamatan_id].total_pengumpulan += rp.nominal;
              }
              return acc;
            },
            result
          );
        };

        // === Gabung hasil per kecamatan ===
        const kecamatanMap = {};

        pengumpulan.forEach((p) => {
          kecamatanMap[p.kecamatan_id] = {
            nama_kecamatan: p.nama_kecamatan,
            total_pengumpulan: Number(p.total_pengumpulan) || 0,
            total_donasi: 0,
          };
        });

        donasi.forEach((d) => {
          if (!kecamatanMap[d.kecamatan_id]) {
            kecamatanMap[d.kecamatan_id] = {
              nama_kecamatan: d.nama_kecamatan,
              total_pengumpulan: 0,
              total_donasi: Number(d.total_donasi) || 0,
            };
          } else {
            kecamatanMap[d.kecamatan_id].total_donasi = Number(d.total_donasi) || 0;
          }
        });

        
        // === Hitung total pengumpulan dan donasi ===
        const totalPengumpulan = sumByTipe(pengumpulan).total_pengumpulan;
        const totalDonasi = sumByTipe(donasi).total_donasi;
        console.log("totalPengumpulan", totalPengumpulan, "totalDonasi", totalDonasi);

        // === Format hasil akhir ===
        const result = Object.values(kecamatanMap).map((k) => ({
          year: targetYear,
          month: m.toString().padStart(2, "0"),
          nama_kecamatan: k.nama_kecamatan || "",
          total_pengumpulan: totalPengumpulan,
          total_donasi: totalDonasi,
          total_semua: k.total_pengumpulan + k.total_donasi || 0,
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
