const { Riwayat_pengumpulan, Member } = require("../models");
const { Op } = require("sequelize");

const validation = {};

validation.check_tipe_zakat = async (value) => {
  const enumValues = Riwayat_pengumpulan.rawAttributes.tipe.values;
  const validZakatTypes = enumValues.filter((tipe) => tipe !== "infaq");

  if (!validZakatTypes.includes(value)) {
    throw new Error("Tipe zakat tidak valid");
  }
  return true;
};

validation.check_invoice_exists = async (value) => {
  const check = await Riwayat_pengumpulan.findOne({
    where: {
      invoice: value,
      tipe: { [Op.ne]: "infaq" },
    },
  });
  if (check) {
    throw new Error(
      "Invoice dengan nomor yang sama sudah terdaftar di sistem untuk zakat"
    );
  }
  return true;
};

validation.check_invoice_for_confirm = async (value, { req }) => {
  const username = req.user?.username;
  if (!username) {
    throw new Error("Sesi pengguna tidak valid atau username tidak ditemukan");
  }

  const member = await Member.findOne({
    where: { username: username },
    attributes: ["id"],
  });

  if (!member) {
    throw new Error(`Member dengan username '${username}' tidak ditemukan`);
  }

  const zakatRecord = await Riwayat_pengumpulan.findOne({
    where: {
      invoice: value,
      member_id: member.id,
      tipe: { [Op.ne]: "infaq" },
    },
  });

  if (!zakatRecord) {
    throw new Error(
      `Data zakat dengan invoice '${value}' tidak ditemukan untuk member ini`
    );
  }

  if (zakatRecord.konfirmasi_pembayaran === "sudah_dikirim") {
    throw new Error("Konfirmasi pembayaran sudah pernah dikirim sebelumnya");
  }

  return true;
};

module.exports = validation;
