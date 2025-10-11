const moment = require("moment");
const {
  Sequelize,
  Op,
  Target_pengumpulan,
  Riwayat_pengumpulan,
  Riwayat_donasi,
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async laporan_pengumpulan() {
    try {
      const tahun = this.req.query.tahun || this.req.body.tahun || new Date().getFullYear();
      const search = this.req.query.search || this.req.body.search || "";

      console.log("📊 Request params:", { tahun, search });

      // 🔹 Ambil data target dari tabel Target_pengumpulan
      const targetData = await Target_pengumpulan.findAll({
        where: { tahun },
        raw: true,
      });

      const targetItem = targetData[0] || {};
      const targetZakat = Number(targetItem.zakat) || 0;
      const targetInfaq = Number(targetItem.infaq) || 0;
      const targetDonasi = Number(targetItem.donasi) || 0;
      const totalTarget = targetZakat + targetInfaq + targetDonasi;

      // 🔹 Ambil realisasi
      const zakatRealisasi =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            status: "success",
            tipe: { [Op.ne]: "infaq" },
            createdAt: {
              [Op.between]: [`${tahun}-01-01 00:00:00`, `${tahun}-12-31 23:59:59`],
            },
          },
        })) || 0;

      const infaqRealisasi =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            status: "success",
            tipe: "infaq",
            createdAt: {
              [Op.between]: [`${tahun}-01-01 00:00:00`, `${tahun}-12-31 23:59:59`],
            },
          },
        })) || 0;

      const donasiRealisasi =
        (await Riwayat_donasi.sum("nominal", {
          where: {
            status: "success",
            createdAt: {
              [Op.between]: [`${tahun}-01-01 00:00:00`, `${tahun}-12-31 23:59:59`],
            },
          },
        })) || 0;

      const totalRealisasi = zakatRealisasi + infaqRealisasi + donasiRealisasi;

      // 🧮 Fungsi aman pembulatan
      const fix = (num) => Math.round(num * 100) / 100;

      // 🔸 Hitung bobot target (agar total 100%)
      const bobotZakat = totalTarget ? targetZakat / totalTarget : 0;
      const bobotInfaq = totalTarget ? targetInfaq / totalTarget : 0;
      const bobotDonasi = totalTarget ? targetDonasi / totalTarget : 0;

      // 🔸 Hitung persentase berdasarkan kontribusi per jenis
      const persenZakat = fix((zakatRealisasi / targetZakat) * bobotZakat * 100 || 0);
      const persenInfaq = fix((infaqRealisasi / targetInfaq) * bobotInfaq * 100 || 0);
      const persenDonasi = fix((donasiRealisasi / targetDonasi) * bobotDonasi * 100 || 0);

      // 🔸 Pastikan total persentase = 100 maksimal
      let persenTotal = persenZakat + persenInfaq + persenDonasi;
      if (persenTotal > 100) persenTotal = 100;
      persenTotal = fix(persenTotal);

      // 🔹 Susun hasil laporan
      const laporan = {
        tahun: parseInt(tahun),
        totalTarget,
        totalRealisasi,
        persentaseTotal: persenTotal,
        dataPerJenis: [
          { jenis: "Zakat", target: targetZakat, realisasi: zakatRealisasi, persentase: persenZakat },
          { jenis: "Infaq", target: targetInfaq, realisasi: infaqRealisasi, persentase: persenInfaq },
          { jenis: "Donasi", target: targetDonasi, realisasi: donasiRealisasi, persentase: persenDonasi },
        ],
      };

      console.log("✅ Laporan final:", JSON.stringify(laporan, null, 2));
      return [laporan];
    } catch (error) {
      console.error("❌ Error laporan_pengumpulan:", error);
      throw error;
    }
  }

  async list_laporan_pengumpulan() {
    return this.laporan_pengumpulan();
  }
}

module.exports = Model_r;
