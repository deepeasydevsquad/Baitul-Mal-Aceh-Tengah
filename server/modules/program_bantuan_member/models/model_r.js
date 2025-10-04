const {
  Realisasi_permohonan,
  Permohonan,
  Kegiatan,
  Program,
  Sequelize,
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getLaporan() {
    try {
      const { tahun } = this.req.body || {};
      const selectedYear = tahun || new Date().getFullYear();

      // === Ambil data semua program + kegiatan + permohonan + realisasi ===
      const programs = await Program.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: Kegiatan,
            attributes: ["id", "sumber_dana", "tahun", "jumlah_dana"],
            required: true,
            where: { tahun: selectedYear },
            include: [
              {
                model: Permohonan,
                attributes: ["id", "kegiatan_id", "createdAt"],
                include: [
                  {
                    model: Realisasi_permohonan,
                    attributes: ["biaya_disetujui", "status_realisasi"],
                  },
                ],
              },
            ],
          },
        ],
      });

      // === Olah data per program ===
      const laporan = programs.map((program) => {
        let totalDana = 0;
        let sudahRealisasi = 0;
        let totalPenerima = 0;

        program.Kegiatans.forEach((kegiatan) => {
          totalDana += kegiatan.jumlah_dana || 0;

          kegiatan.Permohonans.forEach((perm) => {
            let isSudahRealisasi = false;

            perm.Realisasi_permohonans.forEach((real) => {
              if (real.status_realisasi === "sudah_direalisasi") {
                sudahRealisasi += real.biaya_disetujui || 0;
                isSudahRealisasi = true;
              }
            });

            // Hitung orang terbantu (permohonan yg sudah direalisasi)
            if (isSudahRealisasi) totalPenerima += 1;
          });
        });

        const belumRealisasi = totalDana - sudahRealisasi;
        const persentase =
          totalDana > 0 ? ((sudahRealisasi / totalDana) * 100).toFixed(2) : 0;

        return {
          program: program.name,
          tahun: selectedYear,
          total_dana: totalDana,
          sudah_direalisasi: sudahRealisasi,
          belum_direalisasi: belumRealisasi,
          total_penerima: totalPenerima, // ✅ jumlah orang terbantu
          persentase_realisasi: parseFloat(persentase),
        };
      });

      // === Hitung total keseluruhan (buat summary kalau mau ditampilkan di frontend) ===
      const totalSemua = laporan.reduce(
        (acc, curr) => {
          acc.sudah_direalisasi += curr.sudah_direalisasi;

          acc.total_penerima += curr.total_penerima;
          return acc;
        },
        {
          total_dana: 0,
          sudah_direalisasi: 0,
          belum_direalisasi: 0,
          total_penerima: 0,
        }
      );

      return {
        tahun: selectedYear,
        total: totalSemua,
        data: laporan,
      };
    } catch (err) {
      console.error("❌ ERROR getLaporan:", err);
      return { error: true, message: err.message };
    }
  }
}

module.exports = Model_r;
