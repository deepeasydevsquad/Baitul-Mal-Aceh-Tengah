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

  async list_rekap_distribusi_per_kode_asnaf() {
    try {
      const currentYear = moment().year();
      const availableYears = [currentYear - 1, currentYear, currentYear + 1];

      const targetYear = this.req.query.year
        ? parseInt(this.req.query.year, 10)
        : currentYear;

      if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
        return {
          success: false,
          message: "Tahun tidak valid",
          data: [],
        };
      }

      const startDate = moment().year(targetYear).startOf("year");
      const endDate = moment().year(targetYear).endOf("year");
      const months = Array.from(
        { length: endDate.diff(startDate, "months") + 1 },
        (_, k) => moment(startDate).add(k, "months")
      );

      const finalData = [];

      console.log("🧭 DEBUG START: Rekap distribusi per kode asnaf");
      console.log("Tahun target:", targetYear);
      console.log(
        "Rentang waktu:",
        startDate.format("YYYY-MM-DD"),
        "→",
        endDate.format("YYYY-MM-DD")
      );
      console.log("Total bulan:", months.length);
      console.log("==============================================");

      for (const m of months) {
        const start = m.clone().startOf("month").toDate();
        const end = m.clone().endOf("month").toDate();

        console.log(`\n📅 Bulan: ${m.format("MMMM YYYY")}`);
        console.log("Range tanggal:", start, "→", end);

        const realisasi = await Realisasi_permohonan.findAll({
          attributes: ["id", "nominal_realisasi", "createdAt"],
          where: {
            status_realisasi: "sudah_direalisasi",
            createdAt: { [Op.between]: [start, end] },
          },
          include: [
            {
              model: Permohonan,
              attributes: ["id", "member_id", "kegiatan_id"],
              include: [
                { model: Member, attributes: ["id"] },
                {
                  model: Kegiatan,
                  attributes: ["id", "asnaf_id", "kode"],
                  include: [{ model: Asnaf, attributes: ["id", "name"] }],
                },
              ],
            },
          ],
        });

        console.log(`Jumlah data realisasi di bulan ini: ${realisasi.length}`);

        // Kalau tidak ada data di bulan ini, skip ke bulan berikutnya
        if (realisasi.length === 0) continue;

        const rekap = {};

        for (const r of realisasi) {
          const asnafId = r.Permohonan?.Kegiatan?.Asnaf?.id;
          const asnafName =
            r.Permohonan?.Kegiatan?.Asnaf?.name || "Tidak Diketahui";
          const kegiatanId = r.Permohonan?.Kegiatan?.id;
          const kodeKegiatan = r.Permohonan?.Kegiatan?.kode || "-";

          // 🔍 Debug relasi
          console.log("➡️ Realisasi:", {
            id: r.id,
            nominal: r.nominal_realisasi,
            kegiatan_id: kegiatanId,
            asnaf_id: asnafId,
            asnaf: asnafName,
            kode: kodeKegiatan,
          });

          if (!asnafId || !kegiatanId) {
            console.log("⚠️  Data dilewati karena asnaf/kegiatan null");
            continue;
          }

          const key = `${asnafId}_${kegiatanId}`;

          if (!rekap[key]) {
            rekap[key] = {
              asnaf_id: asnafId,
              asnaf: asnafName,
              kegiatan_id: kegiatanId,
              kode: kodeKegiatan,
              total_nominal: 0,
              total_penerima: new Set(),
            };
          }

          rekap[key].total_nominal += r.nominal_realisasi || 0;
          if (r.Permohonan?.member_id) {
            rekap[key].total_penerima.add(r.Permohonan.member_id);
          }
        }

        const monthData = Object.values(rekap).map((item) => ({
          asnaf_id: item.asnaf_id,
          asnaf: item.asnaf,
          kegiatan_id: item.kegiatan_id,
          kode: item.kode,
          total_nominal: item.total_nominal,
          total_penerima: item.total_penerima.size,
        }));

        console.log("📊 Rekap bulan ini:", monthData.length, "asnaf ditemukan");
        console.table(
          monthData.map((x) => ({
            Asnaf: x.asnaf,
            Kode: x.kode,
            Nominal: x.total_nominal,
            Penerima: x.total_penerima,
          }))
        );

        finalData.push({
          year: targetYear,
          month: m.format("MM"),
          month_name: m.format("MMMM"),
          data: monthData,
        });
      }

      console.log("==============================================");
      console.log(
        "✅ Debug Selesai. Total bulan dengan data:",
        finalData.length
      );
      console.log(
        "📦 Total asnaf unik (gabungan semua bulan):",
        [...new Set(finalData.flatMap((f) => f.data.map((x) => x.asnaf_id)))]
          .length
      );

      return {
        success: true,
        year: targetYear,
        data: finalData,
      };
    } catch (err) {
      console.error(
        "🔥 Error in Model_r.list_rekap_distribusi_per_kode_asnaf:",
        err
      );
      return {
        success: false,
        message: err.message,
        data: [],
      };
    }
  }
}

module.exports = Model_r;
