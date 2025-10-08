const { Riwayat_pengumpulan, Member } = require("../../../models");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async addInfaq(nominal, invoice, kode) {
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
      const newInfaq = await Riwayat_pengumpulan.create({
        member_id: memberId,
        invoice: invoice,
        tipe: "infaq",
        nominal: nominal,
        kode: kode,
        status: "process",
        konfirmasi_pembayaran: "belum_dikirim",
      });

      return newInfaq;
    } catch (error) {
      console.error("Error creating infaq record in Model_cud:", error);
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

      const infaqRecord = await Riwayat_pengumpulan.findOne({
        where: {
          invoice: invoice,
          member_id: memberId,
          tipe: "infaq",
        },
      });

      if (!infaqRecord) {
        throw new Error(
          `Data infaq dengan invoice '${invoice}' tidak ditemukan.`
        );
      }

      if (infaqRecord.konfirmasi_pembayaran === "sudah_dikirim") {
        throw new Error(
          "Konfirmasi pembayaran sudah pernah dikirim sebelumnya."
        );
      }

      await infaqRecord.update({
        konfirmasi_pembayaran: "sudah_dikirim",
      });

      return infaqRecord;
    } catch (error) {
      console.error("Error confirming payment in Model_cud:", error);
      throw error;
    }
  }
}

module.exports = Model_cud;
