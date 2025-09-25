const { Riwayat_pengumpulan, Member } = require("../models");

const validation = {};

// Validasi id member apakah sudah ada di database
validation.check_id_member = async (value) => {
  const check = await Member.findByPk(value);
  if (!check) {
    throw new Error("Member tidak terdaftar di pangkalan data");
  }
  return true;
};

// Validasi id bank apakah sudah ada di database
validation.check_id_riwayat_infaq = async (value) => {
  console.log("ID riwayat infaq", value);
  const check = await Riwayat_pengumpulan.findOne({
    where: {
      id: value,
      tipe: "infaq",
    },
  });

  if (!check) {
    throw new Error("Riwayat infaq tidak terdaftar di pangkalan data");
  }
  return true;
};

module.exports = validation;
