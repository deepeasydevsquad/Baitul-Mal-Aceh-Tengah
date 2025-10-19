const {
  Riwayat_pengumpulan,
  Member,
  Bank_pengumpulan,
  Bank,
} = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

const { kode_pembayaran_zakat_infaq } = require("../../../helper/randomHelper");

class Model_r {
  constructor(req) {
    this.req = req;
    this.kode_pembayaran = null;
  }

  async initialize() {
    this.kode_pembayaran = await kode_pembayaran_zakat_infaq();
  }

  async generateKode() {
    try {
      await this.initialize();
      const kode = this.kode_pembayaran;
      return kode;
    } catch (error) {
      console.error("Error in initialize method:", error);
      return null;
    }
  }

  async getZakatList(search, perpage, pageNumber) {
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
        tipe: { [Op.ne]: "infaq" },
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
          "tipe",
          "kode",
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
        tipe: item.tipe
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        nominal: Number(item.nominal + item.kode),
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
      console.error("Error in getZakatList model:", error.message);
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

  async getZakatBanks() {
    try {
      const banks = await Bank_pengumpulan.findAll({
        where: { tipe: "zakat" },
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
      console.error("Error in getZakatBanks model:", error.message);
      throw error;
    }
  }

  async getTipeZakat() {
    try {
      const enumValues = Riwayat_pengumpulan.rawAttributes.tipe.values;

      const tipeZakatList = enumValues
        .filter((tipe) => tipe !== "infaq")
        .map((tipe) => ({
          value: tipe,
          label: tipe
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));

      return tipeZakatList;
    } catch (error) {
      console.error("Error in getTipeZakat model:", error.message);
      throw error;
    }
  }
}

module.exports = Model_r;
