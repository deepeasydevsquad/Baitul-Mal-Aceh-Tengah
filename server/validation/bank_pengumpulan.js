const { body } = require("express-validator");
const { Bank, Bank_pengumpulan } = require("../models");
const { Op } = require("sequelize");

const validation = {};

// Aturan validasi untuk menambahkan
validation.add = [
  body("bank_id")
    .notEmpty()
    .withMessage("Bank tidak boleh kosong")
    .isInt()
    .withMessage("Bank ID harus berupa angka")
    .custom(async (value) => {
      const bank = await Bank.findByPk(value);
      if (!bank) {
        throw new Error("Bank tidak terdaftar di pangkalan data");
      }
      return true;
    }),
  body("tipe")
    .notEmpty()
    .withMessage("Jenis Pemasukan tidak boleh kosong")
    .isIn(["zakat", "infaq", "donasi"])
    .withMessage("Jenis Pemasukan tidak valid"),
  body("nomor_akun_bank")
    .notEmpty()
    .withMessage("Nomor Rekening tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Nomor Rekening minimal 8 digit")
    .isNumeric()
    .withMessage("Nomor Rekening harus berupa angka")
    .custom(async (value, { req }) => {
      const check = await Bank_pengumpulan.findOne({
        where: {
          nomor_akun_bank: value,
          bank_id: req.body.bank_id,
        },
      });
      if (check) {
        throw new Error(
          "Nomor rekening ini sudah terdaftar untuk bank yang sama"
        );
      }
      return true;
    }),
  body("nama_akun_bank")
    .notEmpty()
    .withMessage("Nama Akun Bank tidak boleh kosong")
    .isLength({ min: 3 })
    .withMessage("Nama Akun Bank minimal 3 karakter"),
];

// Aturan validasi untuk mengedit
validation.edit = [
  body("id")
    .notEmpty()
    .withMessage("ID tidak boleh kosong")
    .isInt()
    .withMessage("ID harus berupa angka")
    .custom(async (value) => {
      const data = await Bank_pengumpulan.findByPk(value);
      if (!data) {
        throw new Error("Data yang akan diedit tidak ditemukan");
      }
      return true;
    }),
  body("bank_id")
    .notEmpty()
    .withMessage("Bank tidak boleh kosong")
    .isInt()
    .withMessage("Bank ID harus berupa angka")
    .custom(async (value) => {
      const bank = await Bank.findByPk(value);
      if (!bank) {
        throw new Error("Bank tidak terdaftar di pangkalan data");
      }
      return true;
    }),
  body("tipe")
    .notEmpty()
    .withMessage("Jenis Pemasukan tidak boleh kosong")
    .isIn(["zakat", "infaq", "donasi"])
    .withMessage("Jenis Pemasukan tidak valid"),
  body("nomor_akun_bank")
    .notEmpty()
    .withMessage("Nomor Rekening tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Nomor Rekening minimal 8 digit")
    .isNumeric()
    .withMessage("Nomor Rekening harus berupa angka")
    .custom(async (value, { req }) => {
      const { id } = req.body;
      const check = await Bank_pengumpulan.findOne({
        where: {
          nomor_akun_bank: value,
          bank_id: req.body.bank_id,
          id: { [Op.ne]: id },
        },
      });
      if (check) {
        throw new Error(
          "Nomor rekening ini sudah terdaftar untuk bank yang sama"
        );
      }
      return true;
    }),
  body("nama_akun_bank")
    .notEmpty()
    .withMessage("Nama Akun Bank tidak boleh kosong")
    .isLength({ min: 3 })
    .withMessage("Nama Akun Bank minimal 3 karakter"),
];

module.exports = validation;
