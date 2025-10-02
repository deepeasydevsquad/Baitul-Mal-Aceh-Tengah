const { body } = require("express-validator");
const { Target_pengumpulan } = require("../models");
const { Op } = require("sequelize");

const validation = {};

validation.add = [
  body("tahun")
    .notEmpty()
    .withMessage("Tahun tidak boleh kosong")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Tahun harus berupa angka antara 1900-2100")
    .custom(async (value) => {
      const check = await Target_pengumpulan.findOne({
        where: { tahun: value },
      });
      if (check) {
        throw new Error("Target pengumpulan untuk tahun ini sudah ada");
      }
      return true;
    }),
  body("infaq")
    .notEmpty()
    .withMessage("Target Infaq tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Infaq harus berupa angka positif"),
  body("zakat")
    .notEmpty()
    .withMessage("Target Zakat tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Zakat harus berupa angka positif"),
  body("donasi")
    .notEmpty()
    .withMessage("Target Donasi tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Donasi harus berupa angka positif"),
];

validation.edit = [
  body("id")
    .notEmpty()
    .withMessage("ID tidak boleh kosong")
    .isInt()
    .withMessage("ID harus berupa angka")
    .custom(async (value) => {
      const data = await Target_pengumpulan.findByPk(value);
      if (!data) {
        throw new Error(
          "Data target pengumpulan yang akan diedit tidak ditemukan"
        );
      }
      return true;
    }),
  body("tahun")
    .notEmpty()
    .withMessage("Tahun tidak boleh kosong")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Tahun harus berupa angka antara 1900-2100")
    .custom(async (value, { req }) => {
      const { id } = req.body;
      const check = await Target_pengumpulan.findOne({
        where: {
          tahun: value,
          id: { [Op.ne]: id },
        },
      });
      if (check) {
        throw new Error("Target pengumpulan untuk tahun ini sudah ada");
      }
      return true;
    }),
  body("infaq")
    .notEmpty()
    .withMessage("Target Infaq tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Infaq harus berupa angka positif"),
  body("zakat")
    .notEmpty()
    .withMessage("Target Zakat tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Zakat harus berupa angka positif"),
  body("donasi")
    .notEmpty()
    .withMessage("Target Donasi tidak boleh kosong")
    .isInt({ min: 0 })
    .withMessage("Target Donasi harus berupa angka positif"),
];

validation.delete = [
  body("id")
    .notEmpty()
    .withMessage("ID tidak boleh kosong")
    .isInt()
    .withMessage("ID harus berupa angka")
    .custom(async (value) => {
      const data = await Target_pengumpulan.findByPk(value);
      if (!data) {
        throw new Error(
          "Data target pengumpulan yang akan dihapus tidak ditemukan"
        );
      }
      return true;
    }),
];

validation.get_info_edit = [
  body("id")
    .notEmpty()
    .withMessage("ID tidak boleh kosong")
    .isInt()
    .withMessage("ID harus berupa angka")
    .custom(async (value) => {
      const data = await Target_pengumpulan.findByPk(value);
      if (!data) {
        throw new Error("Data target pengumpulan tidak ditemukan");
      }
      return true;
    }),
];

module.exports = validation;
