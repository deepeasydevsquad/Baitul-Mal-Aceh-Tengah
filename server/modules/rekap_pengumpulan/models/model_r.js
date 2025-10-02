const {
  Op,
  Realisasi_permohonan,
  Permohonan,
  Member,
  Riwayat_pengumpulan,
  Riwayat_donasi,
  Sequelize,
} = require("../../../models");
const moment = require("moment");

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

      // ===== ENUM TIPE PENGUMPULAN =====
      const enumRiwayat = Object.freeze({
        zakat_harta: "zakat_harta",
        zakat_simpanan: "zakat_simpanan",
        zakat_profesi: "zakat_profesi",
        zakat_perdagangan: "zakat_perdagangan",
        zakat_pertanian: "zakat_pertanian",
        infaq: "infaq",
      });

      // ===== RANGE BULAN 1 TAHUN BERDASARKAN targetYear =====
      const startDate = moment().year(targetYear).startOf("year");
      const endDate = moment().year(targetYear).endOf("year");
      const months = Array.from(
        { length: endDate.diff(startDate, "months") + 1 },
        (_, k) => moment(startDate).add(k, "months")
      );

      const finalData = [];

      // Loop tiap bulan
      for (const m of months) {
        const start = m.clone().startOf("month").toDate();
        const end = m.clone().endOf("month").toDate();

        // === Ambil Realisasi + Member ===
        const realisasi = await Realisasi_permohonan.findAndCountAll({
          attributes: ["id", "nominal_realisasi", "tanggal_realisasi"],
          where: {
            [Op.and]: [
              {
                tanggal_realisasi: {
                  [Op.between]: [start, end],
                },
              },
              // ✅ pastikan tahun sesuai filter
              Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("tanggal_realisasi")),
                targetYear
              ),
            ],
          },
          include: [
            {
              model: Permohonan,
              attributes: ["id", "member_id"],
              include: [{ model: Member, attributes: ["id"] }],
            },
          ],
        });

        const memberIds = realisasi.rows
          .map((r) => r.Permohonan?.member_id)
          .filter(Boolean);

        // === Helper: Sum Pengumpulan per tipe ===
        const sumByTipe = (rows) =>
          rows.reduce(
            (acc, rp) => {
              if (enumRiwayat[rp.tipe] !== undefined) {
                acc[rp.tipe] += rp.nominal;
              }
              return acc;
            },
            {
              zakat_harta: 0,
              zakat_simpanan: 0,
              zakat_profesi: 0,
              zakat_perdagangan: 0,
              zakat_pertanian: 0,
              infaq: 0,
            }
          );

        // === Query paralel untuk efisiensi ===
        const [riwayatPengumpulan, riwayatDonasi] = await Promise.all([
          Riwayat_pengumpulan.findAll({
            attributes: ["tipe", "nominal"],
            where: { member_id: { [Op.in]: memberIds } },
            raw: true,
          }),
          Riwayat_donasi.findAll({
            attributes: ["nominal"],
            where: { member_id: { [Op.in]: memberIds } },
            raw: true,
          }),
        ]);

        const pengumpulanSum = sumByTipe(riwayatPengumpulan);
        const donasiSum = riwayatDonasi.reduce((acc, d) => acc + d.nominal, 0);

        finalData.push({
          year: targetYear,
          month: m.format("MM"), // atau "MMMM" kalau mau nama bulan
          total_realisasi: realisasi.count,
          total_nominal_realisasi:
            Object.values(pengumpulanSum).reduce((acc, cur) => acc + cur, 0) +
            donasiSum,
          sum_riwayat_pengumpulan: pengumpulanSum,
          sum_riwayat_donasi: donasiSum,
        });
      }

      return { data: finalData };
    } catch (err) {
      console.error("🔥 Error in Model_r.list:", err);
      return { data: [], total: 0, error: err.message };
    }
  }
}

module.exports = Model_r;
