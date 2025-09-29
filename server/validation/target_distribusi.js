const { Target_distribusi } = require("../models");

const validation = {};

// Validasi untuk konten unik (tidak duplikat)
validation.cek_tahun = async (value) => {
  const tahun = parseInt(value, 10);
  const tahunExists = await Target_distribusi.findOne({
    where: { tahun: tahun },
  });
  if (tahunExists) {
    throw new Error("Tahun sudah ada");
  }
  return true;
};

module.exports = validation;
