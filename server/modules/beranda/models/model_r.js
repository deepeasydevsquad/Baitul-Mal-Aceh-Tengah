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
      const tahun = this.req.body?.tahun ? parseInt(this.req.body.tahun) : null;

      // Kalo ga ada tahun, ambil semua tahun yang ada
      if (!tahun) {
        return await this.laporan_semua_tahun();
      }

      // Kalo ada tahun, proses seperti biasa
      return await this.laporan_per_tahun(tahun);
    } catch (error) {
      console.error(error);
      return this.getEmptyData();
    }
  }

  // Function untuk laporan semua tahun
  async laporan_semua_tahun() {
    try {
      console.log("🔥 MASUK LAPORAN SEMUA TAHUN");

      // Cari tahun terawal dan terakhir dari data
      const minMaxTahun = await Riwayat_pengumpulan.findOne({
        attributes: [
          [
            Sequelize.fn(
              "MIN",
              Sequelize.fn("YEAR", Sequelize.col("createdAt"))
            ),
            "minTahun",
          ],
          [
            Sequelize.fn(
              "MAX",
              Sequelize.fn("YEAR", Sequelize.col("createdAt"))
            ),
            "maxTahun",
          ],
        ],
        raw: true,
      });
      console.log("✅ 1. minMaxTahun:", minMaxTahun);

      const tahunMin = minMaxTahun?.minTahun || new Date().getFullYear();
      const tahunMax = minMaxTahun?.maxTahun || new Date().getFullYear();

      // Ambil semua target pengumpulan
      const allTargetPengumpulan = await Target_pengumpulan.findAll({
        attributes: ["tahun", "zakat", "infaq", "donasi"],
        raw: true,
      });
      console.log(
        "✅ 2. allTargetPengumpulan:",
        allTargetPengumpulan.length,
        "rows"
      );

      // Sum realisasi zakat untuk semua tahun
      const realisasi_zakat_pengumpulan =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            tipe: { [Op.like]: "zakat%" },
            status: "success",
          },
        })) || 0;
      console.log(
        "✅ 3. realisasi_zakat_pengumpulan:",
        realisasi_zakat_pengumpulan
      );

      // Sum realisasi infaq untuk semua tahun
      const realisasi_infaq_pengumpulan =
        (await Riwayat_pengumpulan.sum("nominal", {
          where: {
            tipe: { [Op.like]: "%infaq%" },
            status: "success",
          },
        })) || 0;
      console.log(
        "✅ 4. realisasi_infaq_pengumpulan:",
        realisasi_infaq_pengumpulan
      );

      // Sum donasi untuk semua tahun
      const realisasi_donasi_pengumpulan =
        (await Riwayat_donasi.sum("nominal")) || 0;
      console.log(
        "✅ 5. realisasi_donasi_pengumpulan:",
        realisasi_donasi_pengumpulan
      );

      // Total target distribusi semua tahun
      const total_target_zakat =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tipe: "zakat" },
        })) || 0;
      console.log("✅ 6. total_target_zakat:", total_target_zakat);

      const total_target_infaq =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tipe: "infaq" },
        })) || 0;
      console.log("✅ 7. total_target_infaq:", total_target_infaq);

      const total_target_donasi =
        (await Target_distribusi.sum("target_rupiah", {
          where: { tipe: "donasi" },
        })) || 0;
      console.log("✅ 8. total_target_donasi:", total_target_donasi);

      // Ambil semua data distribusi zakat
      console.log("⏳ 9. Fetching zakatData...");
      const zakatData = await Kegiatan.findAll({
        where: { sumber_dana: "zakat" },
        include: [
          {
            model: Permohonan,
            required: false, // TAMBAHKAN INI BIAR GA ERROR KALO GA ADA DATA
            include: [
              {
                model: Realisasi_permohonan,
                required: false, // TAMBAHKAN INI
                where: { status_realisasi: "sudah_direalisasi" },
                attributes: ["biaya_disetujui"],
              },
            ],
          },
        ],
      });
      console.log("✅ 9. zakatData:", zakatData.length, "rows");

      // Ambil semua data distribusi infaq
      console.log("⏳ 10. Fetching infaqData...");
      const infaqData = await Kegiatan.findAll({
        where: { sumber_dana: "infaq" },
        include: [
          {
            model: Permohonan,
            required: false, // TAMBAHKAN INI
            include: [
              {
                model: Realisasi_permohonan,
                required: false, // TAMBAHKAN INI
                where: { status_realisasi: "sudah_direalisasi" },
                attributes: ["biaya_disetujui"],
              },
            ],
          },
        ],
      });
      console.log("✅ 10. infaqData:", infaqData.length, "rows");

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
      console.log(
        "✅ 11. realisasi_zakat_distribusi:",
        realisasi_zakat_distribusi
      );
      console.log(
        "✅ 12. realisasi_infaq_distribusi:",
        realisasi_infaq_distribusi
      );

      // const realisasi_donasi_distribusi =
      //   (await Program_donasi.sum("target_donasi_terkumpul")) || 0;
      // console.log(
      //   "✅ 13. realisasi_donasi_distribusi:",
      //   realisasi_donasi_distribusi
      // );

      const realisasi_donasi_distribusi = 0;

      // Ambil data per tahun untuk chart
      console.log("⏳ 14. Fetching data_per_tahun...");
      const data_per_tahun = await Riwayat_pengumpulan.findAll({
        attributes: [
          [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "tahun"],
          [Sequelize.fn("SUM", Sequelize.col("nominal")), "total"],
        ],
        group: [Sequelize.fn("YEAR", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });
      console.log("✅ 14. data_per_tahun:", data_per_tahun);

      // Tambahkan donasi per tahun
      console.log("⏳ 15. Fetching donasi_per_tahun...");
      const donasi_per_tahun = await Riwayat_donasi.findAll({
        attributes: [
          [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "tahun"],
          [Sequelize.fn("SUM", Sequelize.col("nominal")), "total"],
        ],
        group: [Sequelize.fn("YEAR", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });
      console.log("✅ 15. donasi_per_tahun:", donasi_per_tahun);

      // Gabungkan data per tahun
      const tahunSet = new Set([
        ...data_per_tahun.map((d) => d.tahun),
        ...donasi_per_tahun.map((d) => d.tahun),
      ]);

      const totalPerTahun = Array.from(tahunSet)
        .sort()
        .map((tahun) => {
          const zakatInfaq =
            data_per_tahun.find((d) => d.tahun === tahun)?.total || 0;
          const donasi =
            donasi_per_tahun.find((d) => d.tahun === tahun)?.total || 0;
          return {
            tahun: tahun,
            total: parseInt(zakatInfaq) + parseInt(donasi),
          };
        });
      console.log("✅ 16. totalPerTahun:", totalPerTahun);

      // Total semua target pengumpulan
      const total_target_pengumpulan = allTargetPengumpulan.reduce(
        (sum, t) => sum + (t.zakat || 0) + (t.infaq || 0) + (t.donasi || 0),
        0
      );

      const data = {
        pengumpulan: {
          totalPerTahun, // untuk chart
        },
        infaq: {
          target_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.infaq || 0),
            0
          ),
          realisasi_pengumpulan: realisasi_infaq_pengumpulan,
          persentase_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.infaq || 0),
            0
          )
            ? (realisasi_infaq_pengumpulan /
                allTargetPengumpulan.reduce(
                  (sum, t) => sum + (t.infaq || 0),
                  0
                )) *
              100
            : 0,
          target_distribusi: total_target_infaq,
          realisasi_distribusi: realisasi_infaq_distribusi,
          persentase_distribusi: total_target_infaq
            ? (realisasi_infaq_distribusi / total_target_infaq) * 100
            : 0,
        },
        zakat: {
          target_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.zakat || 0),
            0
          ),
          realisasi_pengumpulan: realisasi_zakat_pengumpulan,
          persentase_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.zakat || 0),
            0
          )
            ? (realisasi_zakat_pengumpulan /
                allTargetPengumpulan.reduce(
                  (sum, t) => sum + (t.zakat || 0),
                  0
                )) *
              100
            : 0,
          target_distribusi: total_target_zakat,
          realisasi_distribusi: realisasi_zakat_distribusi,
          persentase_distribusi: total_target_zakat
            ? (realisasi_zakat_distribusi / total_target_zakat) * 100
            : 0,
        },
        donasi: {
          target_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.donasi || 0),
            0
          ),
          realisasi_pengumpulan: realisasi_donasi_pengumpulan,
          persentase_pengumpulan: allTargetPengumpulan.reduce(
            (sum, t) => sum + (t.donasi || 0),
            0
          )
            ? (realisasi_donasi_pengumpulan /
                allTargetPengumpulan.reduce(
                  (sum, t) => sum + (t.donasi || 0),
                  0
                )) *
              100
            : 0,
          target_distribusi: total_target_donasi,
          realisasi_distribusi: realisasi_donasi_distribusi,
          persentase_distribusi: total_target_donasi
            ? (realisasi_donasi_distribusi / total_target_donasi) * 100
            : 0,
        },
      };

      console.log("🎉 FINAL DATA:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error("❌ ERROR di laporan_semua_tahun:", error.message);
      console.error(error.stack);
      return this.getEmptyData();
    }
  }

  // Function untuk laporan per tahun (code asli)
  async laporan_per_tahun(tahun) {
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
    const donasiResult = await Riwayat_donasi.findAll({
      attributes: [[Sequelize.fn("SUM", Sequelize.col("nominal")), "total"]],
      include: [
        {
          model: Program_donasi,
          where: { tahun: tahun },
          attributes: [],
        },
      ],
      raw: true,
    });

    const realisasi_donasi_pengumpulan = Number(donasiResult[0]?.total) || 0;

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

    // const realisasi_donasi_distribusi =
    //   (await Program_donasi.sum("target_donasi_terkumpul", {
    //     where: { tahun },
    //   })) || 0;

    const realisasi_donasi_distribusi = 0;

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
  }

  // Function untuk return data kosong
  getEmptyData() {
    return {
      pengumpulan: {
        totalGabungan: [],
      },
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

module.exports = Model_r;
