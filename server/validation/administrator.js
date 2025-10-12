const { Op, User } = require("../models");
const bcrypt = require("bcryptjs");

const validation = {};

validation.username = async (value) => {
  var check = await User.findOne({
    where: { username: value },
  });
  if (!check) {
    throw new Error("Username tidak terdaftar dipangkalan data");
  }
  return true;
};

validation.password = async (value, { req }) => {
  try {
    var q = await User.findOne({
      where: { username: req.body.username },
    });
    if (!q) {
      console.log("1");
      throw new Error("User ini tidak terdaftar dipangkalan data");
    } else {
      console.log("2");
      const salt = await bcrypt.genSalt(10);
      const hasil = await bcrypt.hash(value, salt);
      console.log(" Username Password ");
      console.log(hasil);

      console.log(value);
      console.log(q.password);
      console.log(" Username Password ");

      const valid_password = await bcrypt.compare(value, q.password);
      if (!valid_password) {
        throw new Error("Username atau Password anda tidak valid.");
      }
    }
    return true;
  } catch (error) {
    console.log("----------");
    console.log(error);
    console.log("----------");
    throw new Error(error);
  }
};

// validasi username
validation.check_username = async (value, { req }) => {
  const id = req.body.id; // id user yang sedang di-edit (jika ada)

  // 🧩 MODE EDIT (user sedang update profile)
  if (id) {
    const current = await User.findByPk(id);

    if (!current) {
      throw new Error("User tidak ditemukan di pangkalan data.");
    }

    // Jika username tidak berubah, loloskan
    if (current.username === value) {
      return true;
    }

    // Cek apakah username baru sudah dipakai user lain
    const check = await User.findOne({
      where: {
        username: value,
        id: { [Op.ne]: id }, // user lain selain yang sedang login
      },
    });

    if (check) {
      throw new Error("Username sudah digunakan oleh pengguna lain.");
    }

    return true;
  }

  // MODE REGISTRASI (user baru)
  const check = await User.findOne({
    where: { username: value },
  });

  if (check) {
    throw new Error("Username sudah digunakan oleh pengguna lain.");
  }

  return true;
};

// validasi password
validation.check_password = async (value, { req }) => {
  if (value && value.length < 8) {
    throw new Error("Password harus minimal 8 karakter");
  }
  console.log(value);
  console.log(req.body.password_confirmation);

  if (value && value !== req.body.password_confirmation) {
    throw new Error("Password dan konfirmasi password harus sama");
  }
  return true;
};

module.exports = validation;
