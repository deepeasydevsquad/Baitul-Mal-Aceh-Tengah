const { Bank } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const validation = {};

// Validasi id bank apakah sudah ada di database
validation.check_id_bank = async (value) => {
  const check = await Bank.findByPk(value);
  if (!check) {
    throw new Error("Bank tidak terdaftar di pangkalan data");
  }
  return true;
};

// Validasi nama bank apakah sudah ada di database
validation.check_nama_bank = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await Bank.findByPk(id);
    if (!current) {
      throw new Error("Bank tidak ditemukan");
    }

    if (current.name === value) {
      return true;
    }

    const check = await Bank.findOne({
      where: { id: { [Op.ne]: id }, name: value },
    });
    if (check) {
      throw new Error(
        "Bank dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await Bank.findOne({
      where: { name: value },
    });
    if (check) {
      throw new Error(
        "Bank dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

const uploadPath = path.join(__dirname, "../uploads/img/bank");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let safeName = req.body.name || "bank";
    safeName = safeName
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();

    const filename = `${safeName}${ext}`;
    req.body.photoPath = filename;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus PNG, JPG atau JPEG"), false);
  }
};

validation.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});

// Middleware validasi dimensi gambar
validation.check_dimensions = (isRequired = true) => {
  return async (req, res, next) => {
    if (!req.file) {
      if (isRequired) {
        return res
          .status(400)
          .json({ error: true, error_msg: "Logo bank wajib diupload" });
      } else {
        return next();
      }
    }

    try {
      const metadata = await sharp(req.file.path).metadata();
      if (metadata.width !== 100 || metadata.height !== 33) {
        fs.unlinkSync(req.file.path); // hapus file invalid
        return res
          .status(400)
          .json({
            error: true,
            error_msg: "Ukuran gambar harus 100x33 piksel",
          });
      }
      next();
    } catch (err) {
      return res
        .status(500)
        .json({
          error: true,
          error_msg: "Gagal memproses gambar",
          error_detail: err.message,
        });
    }
  };
};

module.exports = validation;
