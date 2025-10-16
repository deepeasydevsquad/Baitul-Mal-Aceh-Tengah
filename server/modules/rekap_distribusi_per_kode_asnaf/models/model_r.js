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
        { length: 12 },
        (_, k) => moment(startDate).add(k, "months")
      );

      console.log("🧭 DEBUG START: Rekap distribusi per kode asnaf (ALL ASNAF)");
      console.log("Tahun target:", targetYear);

      const allAsnaf = await Asnaf.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: Kegiatan,
            attributes: ["id", "kode", "asnaf_id"],
            required: false, // LEFT JOIN - tetap tampilkan asnaf meski tidak punya kegiatan
          },
        ],
        order: [["name", "ASC"]],
      });

      console.log("📋 Total Asnaf di database:", allAsnaf.length);
      console.log("📋 Daftar Asnaf:");
      allAsnaf.forEach((a) => {
        console.log(`   - ${a.name} (ID: ${a.id}) - Kegiatan: ${a.Kegiatans?.length || 0}`);
      });

      const allRealisasi = await Realisasi_permohonan.findAll({
        attributes: ["id", "nominal_realisasi", "createdAt"],
        where: {
          status_realisasi: "sudah_direalisasi",
          createdAt: {
            [Op.between]: [startDate.toDate(), endDate.toDate()],
          },
        },
        include: [
          {
            model: Permohonan,
            attributes: ["id", "member_id", "kegiatan_id"],
            required: true,
            include: [
              {
                model: Member,
                attributes: ["id"],
                required: true,
              },
            ],
          },
        ],
      });

      console.log(`📊 Total realisasi tahun ${targetYear}:`, allRealisasi.length);

      const realisasiMap = {};

      for (const r of allRealisasi) {
        const kegiatanId = r.Permohonan?.kegiatan_id;
        if (!kegiatanId) continue;

        const monthKey = moment(r.createdAt).format("MM");
        const mapKey = `${monthKey}_${kegiatanId}`;

        if (!realisasiMap[mapKey]) {
          realisasiMap[mapKey] = {
            total_nominal: 0,
            total_penerima: new Set(),
          };
        }

        realisasiMap[mapKey].total_nominal += r.nominal_realisasi || 0;
        if (r.Permohonan?.member_id) {
          realisasiMap[mapKey].total_penerima.add(r.Permohonan.member_id);
        }
      }

      console.log("🗺️ Total kombinasi bulan-kegiatan dengan realisasi:", Object.keys(realisasiMap).length);

      const finalData = [];

      for (const m of months) {
        const monthKey = m.format("MM");
        const monthData = [];

        console.log(`\n📅 Processing Bulan: ${m.format("MMMM YYYY")}`);
        for (const asnaf of allAsnaf) {
          // Jika asnaf tidak punya kegiatan
          if (!asnaf.Kegiatans || asnaf.Kegiatans.length === 0) {
            monthData.push({
              asnaf_id: asnaf.id,
              asnaf: asnaf.name,
              kegiatan_id: null,
              kode: "-",
              total_nominal: 0,
              total_penerima: 0,
              status: "belum_ada_kegiatan",
            });
            continue;
          }

          // Loop setiap kegiatan dari asnaf ini
          for (const kegiatan of asnaf.Kegiatans) {
            const mapKey = `${monthKey}_${kegiatan.id}`;
            const realisasiData = realisasiMap[mapKey];

            monthData.push({
              asnaf_id: asnaf.id,
              asnaf: asnaf.name,
              kegiatan_id: kegiatan.id,
              kode: kegiatan.kode || "-",
              total_nominal: realisasiData?.total_nominal || 0,
              total_penerima: realisasiData?.total_penerima.size || 0,
              status: realisasiData ? "sudah_direalisasi" : "belum_direalisasi",
            });
          }
        }

        finalData.push({
          year: targetYear,
          month: monthKey,
          month_name: m.format("MMMM"),
          data: monthData,
        });
      }

      // 🔥 Summary
      const uniqueAsnaf = new Set();
      const uniqueKegiatan = new Set();
      let totalRealisasi = 0;
      let totalBelumRealisasi = 0;

      finalData.forEach((monthData) => {
        monthData.data.forEach((item) => {
          uniqueAsnaf.add(item.asnaf_id);
          if (item.kegiatan_id) {
            uniqueKegiatan.add(`${item.asnaf_id}_${item.kegiatan_id}`);
          }
          if (item.status === "sudah_direalisasi") totalRealisasi++;
          else totalBelumRealisasi++;
        });
      });

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