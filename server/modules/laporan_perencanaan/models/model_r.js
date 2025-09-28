// modules/laporan_perencanaan/models/model_r.js
const { Kegiatan, Program } = require("../../../models");
const moment = require("moment");

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
          "jumlah_dana",
          "periode_bantuan",
          "program_id",
          "sumber_dana",
        ],
        include: [
          {
            model: Program,
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
            nama: k.Program?.name || `Program ${programId}`,
            program: [],
            total: 0,
          };
        }

        const jumlah = Number(k.jumlah_target_penerima || 0);
        const jumlah_satuan = Number(k.jumlah_dana || 0);
        const itemTotal = jumlah * jumlah_satuan;

        // push item (tanpa persentase dulu)
        kategoriMap[programId].program.push({
          id: k.id,
          uraian: k.nama_kegiatan || "-",
          rencana: {
            jumlah,
            satuan: k.satuan || "orang",
          },
          rincian: {
            vol: 1,
            satuan: k.periode_bantuan || "tahun",
            jumlah_satuan,
            jumlah_satuan_format: this.formatRupiah(jumlah_satuan),
          },
          item_total: itemTotal,
          item_total_format: this.formatRupiah(itemTotal),
          persentase: null,
          ket: k.sumber_dana || "-",
        });
        kategoriMap[programId].total += itemTotal;
      }

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
