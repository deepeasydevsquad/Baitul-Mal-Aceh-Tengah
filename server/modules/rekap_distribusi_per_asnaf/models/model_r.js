const {
  Op,
  Sequelize,
  Asnaf,
  Realisasi_permohonan,
  Permohonan,
  Member,
  Kegiatan,
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async list_rekap_distribusi_per_asnaf() {
    try {
        const currentYear = moment().year();
      const availableYears = [currentYear - 1, currentYear, currentYear + 1];
      const targetYear = this.req.query.year
        ? parseInt(this.req.query.year, 10)
        : moment().year();

      const startDate = moment().year(targetYear).startOf("year");
      const endDate = moment().year(targetYear).endOf("year");
      const months = Array.from(
        { length: endDate.diff(startDate, "months") + 1 },
        (_, k) => moment(startDate).add(k, "months")
      );

      // 🔹 Ambil semua daftar Asnaf lebih dulu
      const allAsnaf = await Asnaf.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      const finalData = [];

      for (const m of months) {
        const start = m.clone().startOf("month").toDate();
        const end = m.clone().endOf("month").toDate();

        const realisasi = await Realisasi_permohonan.findAll({
          attributes: ["id", "nominal_realisasi", "tanggal_realisasi"],
          where: {
            status_realisasi: "sudah_direalisasi",
            tanggal_realisasi: { [Op.between]: [start, end] },
          },
          include: [
            {
              model: Permohonan,
              attributes: ["id", "member_id", "kegiatan_id"],
              include: [
                { model: Member, attributes: ["id"] },
                {
                  model: Kegiatan,
                  attributes: ["id", "asnaf_id"],
                  include: [{ model: Asnaf, attributes: ["id", "name"] }],
                },
              ],
            },
          ],
        });

        const rekap = {};
        for (const r of realisasi) {
          const asnafId = r.Permohonan?.Kegiatan?.Asnaf?.id;
          const asnafName = r.Permohonan?.Kegiatan?.Asnaf?.name || "Tidak Diketahui";

          if (!asnafId) continue;

          if (!rekap[asnafId]) {
            rekap[asnafId] = {
              asnaf_id: asnafId,
              asnaf: asnafName,
              total_nominal: 0,
              total_penerima: new Set(),
            };
          }

          rekap[asnafId].total_nominal += r.nominal_realisasi || 0;

          if (r.Permohonan?.member_id) {
            rekap[asnafId].total_penerima.add(r.Permohonan.member_id);
          }
        }

        const mergedData = allAsnaf.map((a) => {
          const found = rekap[a.id];
          return {
            asnaf_id: a.id,
            asnaf: a.name,
            total_nominal: found ? found.total_nominal : 0,
            total_penerima: found ? found.total_penerima.size : 0,
          };
        });

        finalData.push({
          year: targetYear,
          month: m.format("MM"),
          data: mergedData,
        });
      }

      return { data: finalData };
    } catch (err) {
      console.error("🔥 Error in Model_r.list_rekap_distribusi_per_asnaf:", err);
      return { data: [], total: 0, error: err.message };
    }
  }
}

module.exports = Model_r;
