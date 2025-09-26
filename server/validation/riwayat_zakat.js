const { Op, Riwayat_pengumpulan, Member } = require("../models");

const validation = {};

// Validasi id member apakah sudah ada di database
validation.check_id_member = async (value) => {
  const check = await Member.findByPk(value);
  if (!check) {
    throw new Error("Member tidak terdaftar di pangkalan data");
  }
  return true;
};

// Validasi id riwayat apakah sudah ada di database
validation.check_id_riwayat_zakat = async (value) => {
  const check = await Riwayat_pengumpulan.findOne({
    where: {
      id: value,
      tipe: {
        [Op.in]: [
          "zakat_harta",
          "zakat_simpanan",
          "zakat_profesi",
          "zakat_perdagangan",
          "zakat_pertanian",
        ],
      },
    },
  });

  if (!check) {
    throw new Error("Riwayat zakat tidak terdaftar di pangkalan data");
  }
  return true;
};

module.exports = validation;
