const {
  Riwayat_pengumpulan,
  Member,
  Bank_pengumpulan,
  Bank,
} = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getInfaqList(search, perpage, pageNumber) {
    try {
      const userSession = this.req.user;

      if (!userSession || !userSession.username) {
        throw new Error(
          "Sesi pengguna tidak valid atau tidak mengandung username."
        );
      }

      const member = await Member.findOne({
        where: { username: userSession.username },
        attributes: ["id"],
      });

      if (!member) {
        throw new Error(
          `Pengguna dengan username '${userSession.username}' tidak ditemukan.`
        );
      }

      const memberId = member.id;

      const limit = parseInt(perpage, 10) || 10;
      const page = parseInt(pageNumber, 10) || 1;
      const offset = (page - 1) * limit;

      const whereCondition = {
        tipe: "infaq",
        member_id: memberId,
      };

      if (search) {
        whereCondition.invoice = { [Op.like]: `%${search}%` };
      }

      const { count, rows } = await Riwayat_pengumpulan.findAndCountAll({
        where: whereCondition,
        attributes: [
          "id",
          "invoice",
          "nominal",
          "status",
          "konfirmasi_pembayaran",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
      });

      const formattedData = rows.map((item) => ({
        id: item.id,
        invoice: item.invoice,
        nominal: item.nominal,
        status: item.status,
        konfirmasi_pembayaran: item.konfirmasi_pembayaran,
        tanggal_pembayaran: moment(item.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      }));

      return {
        data: formattedData,
        total: count,
      };
    } catch (error) {
      console.error("Error in getInfaqList model:", error.message);
      throw error;
    }
  }

  async getMemberProfile() {
    try {
      const userSession = this.req.user;

      if (!userSession || !userSession.username) {
        throw new Error(
          "Sesi pengguna tidak valid atau tidak mengandung username."
        );
      }

      const memberProfile = await Member.findOne({
        where: { username: userSession.username },
        attributes: ["fullname", "nomor_ktp", "whatsapp_number"],
      });

      if (!memberProfile) {
        throw new Error(
          `Profil untuk username '${userSession.username}' tidak ditemukan.`
        );
      }

      return memberProfile;
    } catch (error) {
      console.error("Error in getMemberProfile model:", error.message);
      throw error;
    }
  }

  async getInfaqBanks() {
    try {
      const banks = await Bank_pengumpulan.findAll({
        where: { tipe: "infaq" },
        include: [
          {
            model: Bank,
            attributes: ["name"],
            required: true,
          },
        ],
        attributes: ["nama_akun_bank", "nomor_akun_bank"],
      });

      return banks.map((bank) => ({
        bankName: bank.Bank.name,
        accountName: bank.nama_akun_bank,
        accountNumber: bank.nomor_akun_bank,
      }));
    } catch (error) {
      console.error("Error in getInfaqBanks model:", error.message);
      throw error;
    }
  }
}

module.exports = Model_r;
