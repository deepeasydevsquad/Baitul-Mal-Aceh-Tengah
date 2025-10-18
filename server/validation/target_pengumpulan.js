const { Target_pengumpulan } = require("../models");
const { Op } = require("sequelize");

const validation = {};

// Validasi untuk cek tahun + bulan saat add (tidak boleh duplikat)
validation.cek_tahun_bulan_add = async (value, { req }) => {
  const tahun = parseInt(req.body.tahun, 10);
  const bulan = parseInt(value, 10);

  const check = await Target_pengumpulan.findOne({
    where: { tahun: tahun, bulan: bulan },
  });

  if (check) {
    throw new Error("Target pengumpulan untuk tahun dan bulan ini sudah ada");
  }
  return true;
};

// Validasi untuk cek tahun + bulan saat edit (tidak boleh duplikat kecuali id sama)
validation.cek_tahun_bulan_edit = async (value, { req }) => {
  const id = parseInt(req.body.id, 10);
  const tahun = parseInt(req.body.tahun, 10);
  const bulan = parseInt(value, 10);

  const check = await Target_pengumpulan.findOne({
    where: {
      tahun: tahun,
      bulan: bulan,
      id: { [Op.ne]: id },
    },
  });

  if (check) {
    throw new Error("Target pengumpulan untuk tahun dan bulan ini sudah ada");
  }
  return true;
};

module.exports = validation;
