const { 
  Op, 
  Pertanyaan_monev, 
  Permohonan, 
  Member, 
  Kegiatan, 
  Realisasi_permohonan, 
  Urutan_bagian_monev 
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async monev() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page = body.pageNumber && body.pageNumber !== "0"
      ? parseInt(body.pageNumber, 10)
      : 1;

    const where = body.search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${body.search}%` } },
          ],
        }
      : {};

    try {
      const result = await Permohonan.findAndCountAll({
        attributes: [
          "id",
          "nomor_akun_bank",
          "status",
          "createdAt",
          "updatedAt",
        ],
        where,
        include: [
          {
            model: Member,
            attributes: ["id", "no_ktp", "fullname"],
          },
          {
            model: Kegiatan,
            attributes: ["id", "nama_kegiatan"],
          },
          {
            model: Realisasi_permohonan,
            attributes: [
              "id",
              "biaya_disetujui",
              "status_realisasi",
              "tanggal_realisasi",
            ],
          },
          {
            model: Pertanyaan_monev,
            attributes: ["id", "jenis_monev",],
          },

        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
      });

      return {
        data: result.rows.map((e) => ({
          id: e.id,
          nama_pemohon: e.Member?.fullname || null,
          no_ktp: e.Member?.no_ktp || null,
          nomor_rekening: e.nomor_akun_bank,
          nama_kegiatan: e.Kegiatan?.nama_kegiatan || null,
          biaya_disetujui: e.Realisasi_permohonan?.biaya_disetujui || 0,
          status_realisasi: e.Realisasi_permohonan?.status_realisasi || null,
          tanggal_realisasi: e.Realisasi_permohonan?.tanggal_realisasi || null,
          jenis_monev: e.Urutan_bagian_monev?.jenis_monev || null,
          status_monitoring: e.Urutan_bagian_monev?.status_monitoring || null,
          status_evaluasi: e.Urutan_bagian_monev?.status_evaluasi || null,
          createdAt: e.createdAt,
        })),
        total: result.count,
      };
    } catch (error) {
      console.error("Error fetching monev data:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
