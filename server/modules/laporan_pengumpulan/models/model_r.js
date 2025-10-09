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

  // 🔹 Fungsi utama: hitung laporan pengumpulan
  async laporan_pengumpulan() {
    try {
      const tahun = this.req.query.tahun || this.req.body.tahun || new Date().getFullYear();
      const search = this.req.query.search || this.req.body.search || "";

      console.log("📊 Request params:", { tahun, search });

      // 🔸 Ambil data target dari tabel Target_pengumpulan
      const targetData = await Target_pengumpulan.findAll({
        where: { tahun },
        raw: true,
      });

      console.log("🎯 Target data:", targetData);

      // 🔹 Ambil target per kategori
      const targetItem = targetData[0] || {};
      const targetZakat = targetItem.zakat || 0;
      const targetInfaq = targetItem.infaq || 0;
      const targetDonasi = targetItem.donasi || 0;
      const totalTarget = targetZakat + targetInfaq + targetDonasi;

      // 🔹 Hitung realisasi zakat
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

      // 🔹 Hitung realisasi infaq
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

      // 🔹 Hitung realisasi donasi
      const donasiRealisasi =
        (await Riwayat_donasi.sum("nominal", {
          where: {
            status: "success",
            createdAt: {
              [Op.between]: [`${tahun}-01-01 00:00:00`, `${tahun}-12-31 23:59:59`],
            },
          },
        })) || 0;

      // 🔸 Total realisasi
      const totalRealisasi = zakatRealisasi + infaqRealisasi + donasiRealisasi;

      // 🔹 Helper aman untuk persentase
      const hitungPersen = (realisasi, target) => {
        if (!target || target <= 0) return 0;
        const persen = (realisasi / target) * 100;
        return Math.round(persen * 100) / 100; // dua desimal
      };

      // 🔹 Hitung persentase
      const persenZakat = hitungPersen(zakatRealisasi, targetZakat);
      const persenInfaq = hitungPersen(infaqRealisasi, targetInfaq);
      const persenDonasi = hitungPersen(donasiRealisasi, targetDonasi);
      const persenTotal = hitungPersen(totalRealisasi, totalTarget);

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

  // ✅ Alias agar tetap kompatibel dengan controller lama
  async list_laporan_pengumpulan() {
    return this.laporan_pengumpulan();
  }
}

module.exports = Model_r;
