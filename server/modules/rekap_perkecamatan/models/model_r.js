const moment = require("moment");
const {
  Sequelize,
  Permohonan,
  Member,
  Kegiatan,
  Desa,
  Kecamatan,
  Realisasi_permohonan,
  Setting,
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async fn_get_data_laporan_rekap_per_kecamatan(tahun) {
    try {
      const list = {};
      const allKecamatan = await Kecamatan.findAll({
        order: [["name", "ASC"]],
      });

      allKecamatan.forEach((kec) => {
        list[kec.id] = {
          name: kec.name,
          kode: kec.kode,
          detail_rupiah: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
          },
          detail_pemohon: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
          },
        };
      });
      const where = {
        status: "approve",
        status_realisasi: "sudah_direalisasi",
        tanggal_realisasi: {
          [Sequelize.Op.ne]: null,
        },
      };

      if (tahun && tahun !== "0") {
        where[Sequelize.Op.and] = Sequelize.where(
          Sequelize.fn(
            "YEAR",
            Sequelize.col("Realisasi_permohonan.tanggal_realisasi")
          ),
          tahun
        );
      }

      const realisasiData = await Realisasi_permohonan.findAll({
        where: where,
        include: [
          {
            model: Permohonan,
            required: true,
            attributes: ["id", "member_id"],
            include: [
              {
                model: Member,
                required: true,
                attributes: ["id", "desa_id"],
                include: {
                  model: Desa,
                  required: true,
                  attributes: ["id", "kecamatan_id", "name"],
                  include: {
                    model: Kecamatan,
                    required: true,
                    attributes: ["id", "name", "kode"],
                  },
                },
              },
            ],
          },
        ],
        group: ["Realisasi_permohonan.id"],
      });

      console.log("=== DEBUG INFO ===");
      console.log("Total records:", realisasiData.length);
      console.log("Unique IDs:", [...new Set(realisasiData.map((r) => r.id))]);
      console.log("==================");

      realisasiData.forEach((realisasi) => {
        if (!realisasi.tanggal_realisasi) return;

        const bulanIndex = moment(realisasi.tanggal_realisasi).month();
        const biaya = parseFloat(realisasi.biaya_disetujui) || 0;
        const kecamatanId = realisasi.Permohonan.Member.Desa.kecamatan_id;

        if (list[kecamatanId]) {
          list[kecamatanId].detail_rupiah[bulanIndex] += biaya;
          list[kecamatanId].detail_pemohon[bulanIndex] += 1;
        }
      });

      return { error: false, feedBack: list };
    } catch (error) {
      console.log("ERROR:", error);
      return { error: true, message: error.message };
    }
  }
}

module.exports = Model_r;
