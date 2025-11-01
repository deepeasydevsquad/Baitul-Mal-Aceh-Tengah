const { Riwayat_pengumpulan, Member } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async addZakat(tipe, nominal, invoice, kode) {
    try {
      const username = this.req.user?.username;
      if (!username) {
        throw new Error(
          "Sesi pengguna tidak valid atau username tidak ditemukan di token."
        );
      }

      const member = await Member.findOne({
        where: { username: username },
        attributes: ["id"],
      });

      if (!member) {
        throw new Error(
          `Member dengan username '${username}' tidak ditemukan.`
        );
      }
      const memberId = member.id;

      const newZakat = await Riwayat_pengumpulan.create({
        member_id: memberId,
        invoice: invoice,
        tipe: tipe,
        nominal: nominal,
        kode: kode,
        status: "process",
        tipe_pembayaran: "online",
        posisi_uang: "bank",
        konfirmasi_pembayaran: "belum_dikirim",
      });

      return newZakat;
    } catch (error) {
      console.error("Error creating zakat record in Model_cud:", error);
      throw error;
    }
  }

  async confirmPayment(invoice) {
    try {
      const username = this.req.user?.username;
      if (!username) {
        throw new Error(
          "Sesi pengguna tidak valid atau username tidak ditemukan di token."
        );
      }

      const member = await Member.findOne({
        where: { username: username },
        attributes: ["id"],
      });

      if (!member) {
        throw new Error(
          `Member dengan username '${username}' tidak ditemukan.`
        );
      }
      const memberId = member.id;

      const zakatRecord = await Riwayat_pengumpulan.findOne({
        where: {
          invoice: invoice,
          member_id: memberId,
        },
      });

      if (!zakatRecord) {
        throw new Error(
          `Data zakat dengan invoice '${invoice}' tidak ditemukan.`
        );
      }

      if (zakatRecord.konfirmasi_pembayaran === "sudah_dikirim") {
        throw new Error(
          "Konfirmasi pembayaran sudah pernah dikirim sebelumnya."
        );
      }

      await zakatRecord.update({
        konfirmasi_pembayaran: "sudah_dikirim",
      });

      return zakatRecord;
    } catch (error) {
      console.error("Error confirming payment in Model_cud:", error);
      throw error;
    }
  }
}

module.exports = Model_cud;
