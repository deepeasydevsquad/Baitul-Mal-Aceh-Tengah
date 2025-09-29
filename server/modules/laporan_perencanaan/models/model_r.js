// modules/laporan_perencanaan/models/model_r.js
const { Kegiatan, Asnaf } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  // Helper format Rupiah tanpa ,00
  formatRupiah(val) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  }

  async list_laporan_perencanaan() {
    try {
      const kegiatanList = await Kegiatan.findAll({
        attributes: [
          "id",
          "nama_kegiatan",
          "satuan",
          "jumlah_target_penerima",
          "jumlah_maksimal_nominal_bantuan",
          "periode_bantuan",
          "program_id",
          "sumber_dana",
        ],
        include: [
          {
            model: Asnaf,
            attributes: ["id", "name"],
          },
        ],
        raw: true,
        nest: true,
      });

      const kategoriMap = {};

      for (const k of kegiatanList) {
        const programId = k.program_id;
        if (!kategoriMap[programId]) {
          kategoriMap[programId] = {
            nama: k.Asnaf?.name || `Program ${programId}`,
            program: [],
            total: 0,
          };
        }

        const jumlah = Number(k.jumlah_target_penerima || 0);
        const jumlahSatuan = Number(k.jumlah_maksimal_nominal_bantuan || 0);

        let vol = 1;
        let satuan = "tahun";
        let totalBaris = 0;

        if (k.periode_bantuan === "bulanan") {
          vol = jumlah * 12;
          satuan = "OB";
          totalBaris = vol * jumlahSatuan;
        } else {
          vol = 1;
          satuan = "tahun";
          totalBaris = jumlah * jumlahSatuan;
        }

        kategoriMap[programId].program.push({
          id: k.id,
          uraian: k.nama_kegiatan || "-",
          rencana: {
            jumlah,
            satuan: k.satuan || "orang",
          },
          rincian: {
            vol,
            satuan,
            jumlah_satuan: jumlahSatuan,
            jumlah_satuan_format: this.formatRupiah(jumlahSatuan),
          },
          item_total: totalBaris,
          item_total_format: this.formatRupiah(totalBaris),
          persentase: null,
          ket: k.sumber_dana || "-",
        });

        kategoriMap[programId].total += totalBaris;
      }

      // Hitung persentase per kategori
      for (const cat of Object.values(kategoriMap)) {
        const catTotal = cat.total;
        for (const prog of cat.program) {
          prog.persentase =
            catTotal > 0
              ? ((prog.item_total / catTotal) * 100).toFixed(2) + "%"
              : "0%";
        }
        cat.total_format = this.formatRupiah(cat.total);
      }

      const data = Object.values(kategoriMap);
      const grand_total = data.reduce((s, c) => s + c.total, 0);

      return {
        data,
        total: data.length,
        grand_total,
        grand_total_format: this.formatRupiah(grand_total),
      };
    } catch (error) {
      console.error("[Model_r] laporan_perencanaan error:", error);
      throw error;
    }
  }
}

module.exports = Model_r;
