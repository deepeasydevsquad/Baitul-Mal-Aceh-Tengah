const moment = require("moment");
const {
  Sequelize,
  Op,
  Kegiatan,
  Riwayat_pengumpulan,
  Riwayat_donasi,
} = require("../../../models");
const { convertToRP } = require("../../../helper/currencyHelper");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async laporan_tahunan() {
    try {
      const body = this.req.body;
      const limit = parseInt(body.perpage) || 10;
      const page =
        body.pageNumber && body.pageNumber !== "0"
          ? parseInt(body.pageNumber)
          : 1;

      // 🔹 Ambil distinct tahun dari 3 tabel
      const tahunPengumpulan = await Riwayat_pengumpulan.findAll({
        attributes: [
          [
            Sequelize.fn(
              "DISTINCT",
              Sequelize.fn("YEAR", Sequelize.col("createdAt"))
            ),
            "tahun",
          ],
        ],
        raw: true,
      });

      const tahunDonasi = await Riwayat_donasi.findAll({
        attributes: [
          [
            Sequelize.fn(
              "DISTINCT",
              Sequelize.fn("YEAR", Sequelize.col("createdAt"))
            ),
            "tahun",
          ],
        ],
        raw: true,
      });

      const tahunKegiatan = await Kegiatan.findAll({
        attributes: [
          [
            Sequelize.fn(
              "DISTINCT",
              Sequelize.fn("YEAR", Sequelize.col("createdAt"))
            ),
            "tahun",
          ],
        ],
        raw: true,
      });

      // Gabung semua tahun & unique
      const semuaTahun = [
        ...new Set([
          ...tahunPengumpulan.map((t) => t.tahun),
          ...tahunDonasi.map((t) => t.tahun),
          ...tahunKegiatan.map((t) => t.tahun),
        ]),
      ].sort(); // biar urut dari kecil ke besar

      const total = semuaTahun.length;
      const offset = (page - 1) * limit;
      const paginatedTahun = semuaTahun.slice(offset, offset + limit);

      const data = [];
      for (const tahun of paginatedTahun) {
        const zakatPengumpulan =
          (await Riwayat_pengumpulan.sum("nominal", {
            where: {
              status: "success",
              tipe: { [Op.ne]: "infaq" },
              createdAt: {
                [Op.between]: [
                  `${tahun}-01-01 00:00:00`,
                  `${tahun}-12-31 23:59:59`,
                ],
              },
            },
          })) || 0;

        const infaqPengumpulan =
          (await Riwayat_pengumpulan.sum("nominal", {
            where: {
              status: "success",
              tipe: "infaq",
              createdAt: {
                [Op.between]: [
                  `${tahun}-01-01 00:00:00`,
                  `${tahun}-12-31 23:59:59`,
                ],
              },
            },
          })) || 0;

        const donasi =
          (await Riwayat_donasi.sum("nominal", {
            where: {
              status: "success",
              createdAt: {
                [Op.between]: [
                  `${tahun}-01-01 00:00:00`,
                  `${tahun}-12-31 23:59:59`,
                ],
              },
            },
          })) || 0;

        const totalPengumpulan = zakatPengumpulan + infaqPengumpulan + donasi;

        const zakatDistribusi =
          (await Kegiatan.sum("jumlah_dana", {
            where: {
              sumber_dana: "zakat",
              createdAt: {
                [Op.between]: [
                  `${tahun}-01-01 00:00:00`,
                  `${tahun}-12-31 23:59:59`,
                ],
              },
            },
          })) || 0;

        const infaqDistribusi =
          (await Kegiatan.sum("jumlah_dana", {
            where: {
              sumber_dana: "infaq",
              createdAt: {
                [Op.between]: [
                  `${tahun}-01-01 00:00:00`,
                  `${tahun}-12-31 23:59:59`,
                ],
              },
            },
          })) || 0;

        const totalDistribusi = zakatDistribusi + infaqDistribusi;
        console.log(
          "===================DDDDDDDDDDDDDDDD========================"
        );
        console.log("zakatPengumpulan", zakatPengumpulan);
        console.log("infaqPengumpulan", infaqPengumpulan);
        console.log("donasi", donasi);
        console.log("totalPengumpulan", totalPengumpulan);
        console.log("zakatDistribusi", zakatDistribusi);
        console.log("infaqDistribusi", infaqDistribusi);
        console.log("totalDistribusi", totalDistribusi);
        console.log(
          "===================DDDDDDDDDDDDDDDD========================"
        );

        data.push({
          tahun,
          pengumpulan: {
            zakat: await convertToRP(zakatPengumpulan),
            infaq: await convertToRP(infaqPengumpulan),
            donasi: await convertToRP(donasi),
            total: await convertToRP(totalPengumpulan),
          },
          distribusi: {
            zakat: await convertToRP(zakatDistribusi),
            infaq: await convertToRP(infaqDistribusi),
            total: await convertToRP(totalDistribusi),
          },
        });
      }

      return {
        data,
        total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = Model_r;
