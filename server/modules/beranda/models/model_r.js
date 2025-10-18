const moment = require("moment");
const {
  Sequelize,
  Op,
  Kegiatan,
  Riwayat_pengumpulan,
  Target_pengumpulan,
  Target_distribusi,
  Riwayat_donasi,
  Program_donasi,
  Permohonan,
  Realisasi_permohonan,
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async laporan_pertahun() {
    try {
      const tahun = parseInt(this.req.body?.tahun) || new Date().getFullYear();

      // ambil target pengumpulan, kasih default 0 kalau ga ada
      const target_pengumpulan = (await Target_pengumpulan.findOne({
        where: { tahun: tahun },
        attributes: ["zakat", "infaq", "donasi"],
      })) || { zakat: 0, infaq: 0, donasi: 0 };

      // Sum semua tipe zakat per tahun
      const realisasi_zakat_pengumpulan =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            tipe: { [Op.like]: "zakat%" },
            status: "success",
            createdAt: {
              [Op.gte]: new Date(Date.UTC(tahun, 0, 1)),
              [Op.lt]: new Date(Date.UTC(tahun + 1, 0, 1)),
            },
          },
        })) || 0;

      // Sum tipe infaq per tahun
      const realisasi_infaq_pengumpulan =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            tipe: { [Op.like]: "%infaq%" },
            status: "success",
            createdAt: {
              [Op.gte]: new Date(Date.UTC(tahun, 0, 1)),
              [Op.lt]: new Date(Date.UTC(tahun + 1, 0, 1)),
            },
          },
        })) || 0;

      // Sum donasi per tahun
      const realisasi_donasi_pengumpulan =
        (await Riwayat_donasi.sum("nominal", {
          include: [{ model: Program_donasi, where: { tahun: tahun } }],
          group: ["Program_donasi.id"],
        })) || 0;

      // Total target distribusi per tipe, default 0
      const total_target_zakat =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tahun, tipe: "zakat" },
        })) || 0;

      const total_target_infaq =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tahun, tipe: "infaq" },
        })) || 0;

      const total_target_donasi =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tahun, tipe: "donasi" },
        })) || 0;

      // ambil data zakat
      const zakatData = await Kegiatan.findAll({
        where: { tahun, sumber_dana: "zakat" },
        include: [
          {
            model: Permohonan,
            include: [
              {
                model: Realisasi_permohonan,
                where: { status_realisasi: "sudah_direalisasi" },
                attributes: ["biaya_disetujui"],
              },
            ],
          },
        ],
      });

      // ambil data infaq
      const infaqData = await Kegiatan.findAll({
        where: { tahun, sumber_dana: "infaq" },
        include: [
          {
            model: Permohonan,
            include: [
              {
                model: Realisasi_permohonan,
                where: { status_realisasi: "sudah_direalisasi" },
                attributes: ["biaya_disetujui"],
              },
            ],
          },
        ],
      });

      console.log("==========================");

      console.log("Zakat:", zakatData);
      console.log("Infaq:", infaqData);

      console.log("==========================");

      // function helper buat nge-sum biaya_disejutui
      function sumDistribusi(data) {
        return data.reduce((total, kegiatan) => {
          if (kegiatan.Permohonans) {
            kegiatan.Permohonans.forEach((perm) => {
              if (perm.Realisasi_permohonans) {
                perm.Realisasi_permohonans.forEach((real) => {
                  total += real.biaya_disetujui || 0;
                });
              }
            });
          }
          return total;
        }, 0);
      }

      const realisasi_zakat_distribusi = sumDistribusi(zakatData);
      const realisasi_infaq_distribusi = sumDistribusi(infaqData);

      console.log("Zakat:", realisasi_zakat_distribusi);
      console.log("Infaq:", realisasi_infaq_distribusi);

      const realisasi_donasi_distribusi =
        (await Program_donasi.sum("target_donasi_terkumpul", {
          where: { tahun },
        })) || 0;

      const data_perbulan_zakat_dan_infaq = await Riwayat_pengumpulan.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "bulan"],
          [Sequelize.fn("SUM", Sequelize.col("nominal")), "total"],
        ],
        where: Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("createdAt")),
          tahun
        ),
        group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
        raw: true,
      });

      // ambil total donasi per bulan
      const data_perbulan_donasi = await Riwayat_donasi.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "bulan"],
          [Sequelize.fn("SUM", Sequelize.col("nominal")), "total"],
        ],
        where: Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("createdAt")),
          tahun
        ),
        group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
        raw: true,
      });

      // fungsi biar tetap lengkap 12 bulan
      function generateBulanLengkap(data) {
        const hasil = [];
        for (let i = 1; i <= 12; i++) {
          const bulanData = data.find((d) => d.bulan === i);
          hasil.push({
            bulan: i,
            total: bulanData ? parseInt(bulanData.total) : 0,
          });
        }
        return hasil;
      }

      // bikin jadi array lengkap
      const zakatInfaq = generateBulanLengkap(data_perbulan_zakat_dan_infaq);
      const donasi = generateBulanLengkap(data_perbulan_donasi);

      // gabungin total per bulan
      const totalGabungan = zakatInfaq.map((z, index) => ({
        bulan: z.bulan,
        total: z.total + donasi[index].total,
      }));

      console.log(totalGabungan);

      const data = {
        pengumpulan: {
          totalGabungan,
        },
        infaq: {
          target_pengumpulan: target_pengumpulan.infaq,
          realisasi_pengumpulan: realisasi_infaq_pengumpulan,
          persentase_pengumpulan: target_pengumpulan.infaq
            ? (realisasi_infaq_pengumpulan / target_pengumpulan.infaq) * 100
            : 0,
          target_distribusi: total_target_infaq,
          realisasi_distribusi: realisasi_infaq_distribusi,
          persentase_distribusi: total_target_infaq
            ? (realisasi_infaq_distribusi / total_target_infaq) * 100
            : 0,
        },
        zakat: {
          target_pengumpulan: target_pengumpulan.zakat,
          realisasi_pengumpulan: realisasi_zakat_pengumpulan,
          persentase_pengumpulan: target_pengumpulan.zakat
            ? (realisasi_zakat_pengumpulan / target_pengumpulan.zakat) * 100
            : 0,
          target_distribusi: total_target_zakat,
          realisasi_distribusi: realisasi_zakat_distribusi,
          persentase_distribusi: total_target_zakat
            ? (realisasi_zakat_distribusi / total_target_zakat) * 100
            : 0,
        },
        donasi: {
          target_pengumpulan: target_pengumpulan.donasi,
          realisasi_pengumpulan: realisasi_donasi_pengumpulan,
          persentase_pengumpulan: target_pengumpulan.donasi
            ? (realisasi_donasi_pengumpulan / target_pengumpulan.donasi) * 100
            : 0,
          target_distribusi: total_target_donasi,
          realisasi_distribusi: realisasi_donasi_distribusi,
          persentase_distribusi: total_target_donasi
            ? (realisasi_donasi_distribusi / total_target_donasi) * 100
            : 0,
        },
      };

      return data;
    } catch (error) {
      console.error(error);
      // kalo error, return semua 0 supaya front-end aman
      return {
        infaq: {
          target_pengumpulan: 0,
          realisasi_pengumpulan: 0,
          persentase_pengumpulan: 0,
          target_distribusi: 0,
          realisasi_distribusi: 0,
          persentase_distribusi: 0,
        },
        zakat: {
          target_pengumpulan: 0,
          realisasi_pengumpulan: 0,
          persentase_pengumpulan: 0,
          target_distribusi: 0,
          realisasi_distribusi: 0,
          persentase_distribusi: 0,
        },
        donasi: {
          target_pengumpulan: 0,
          realisasi_pengumpulan: 0,
          persentase_pengumpulan: 0,
          target_distribusi: 0,
          realisasi_distribusi: 0,
          persentase_distribusi: 0,
        },
      };
    }
  }
}

module.exports = Model_r;
