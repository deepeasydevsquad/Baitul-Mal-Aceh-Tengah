const { Target_distribusi } = require("../models");

const validation = {};

// Validasi untuk konten unik (tidak duplikat tahun + bulan)
validation.cek_tahun_bulan = async (value, { req }) => {
  const tahun = parseInt(req.body.tahun, 10);
  const bulan = parseInt(req.body.bulan, 10);

  const exists = await Target_distribusi.findOne({
    where: { tahun: tahun, bulan: bulan },
  });

  if (exists) {
    throw new Error("Data target untuk tahun dan bulan ini sudah ada");
  }
  return true;
};

module.exports = validation;
