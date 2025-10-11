const { Setting, Whatsapp_template, Whatsapp_message } = require("../models");

const validation = {};

// Validasi id member apakah sudah ada di database
validation.whatsapp_number = async (value) => {
  const check = await Setting.findByPk(value);
  if (!check) {
    throw new Error("Nomor asal tidak terdaftar di pangkalan data");
  }
  return true;
};

// Validasi id member apakah sudah ada di database
validation.Whatsapp_message = async (value) => {
  const check = await Whatsapp_message.findByPk(value);
  if (!check) {
    throw new Error("Nomor asal tidak terdaftar di pangkalan data");
  }
  return true;
};

// Validasi id bank apakah sudah ada di database
// validation.check_id_riwayat_infaq = async (value) => {
//   console.log("ID riwayat infaq", value);
//   const check = await Riwayat_pengumpulan.findOne({
//     where: {
//       id: value,
//       tipe: "infaq",
//     },
//   });

//   if (!check) {
//     throw new Error("Riwayat infaq tidak terdaftar di pangkalan data");
//   }
//   return true;
// };

module.exports = validation;
