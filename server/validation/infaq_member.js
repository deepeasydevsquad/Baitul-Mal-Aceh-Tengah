const { Riwayat_pengumpulan, Member } = require("../models");

const validation = {};

// Validasi invoice apakah sudah ada di database
validation.check_invoice_exists = async (value) => {
  const check = await Riwayat_pengumpulan.findOne({
    where: { invoice: value, tipe: "infaq" },
  });
  if (check) {
    throw new Error("Invoice dengan nomor yang sama sudah terdaftar di sistem");
  }
  return true;
};

// Validasi invoice untuk konfirmasi pembayaran
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

  const infaqRecord = await Riwayat_pengumpulan.findOne({
    where: {
      invoice: value,
      member_id: member.id,
      tipe: "infaq",
    },
  });

  if (!infaqRecord) {
    throw new Error(`Data infaq dengan invoice '${value}' tidak ditemukan`);
  }

  if (infaqRecord.konfirmasi_pembayaran === "sudah_dikirim") {
    throw new Error("Konfirmasi pembayaran sudah pernah dikirim sebelumnya");
  }

  return true;
};

// Validasi nominal infaq harus lebih dari 0
validation.check_nominal_positive = (value) => {
  if (!value || value <= 0) {
    throw new Error("Jumlah infaq harus lebih dari 0");
  }
  return true;
};

module.exports = validation;
