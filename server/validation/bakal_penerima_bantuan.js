const {
  Op,
  sequelize,
  Realisasi_permohonan,
  Permohonan,
  Kegiatan,
  Bank,
  Member,
} = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const validation = {};

// ========================================
// VALIDATION DATABASE CHECKS
// ========================================
validation.check_id_realisasi = async (value) => {
  const check = await Realisasi_permohonan.findByPk(value);
  if (!check) {
    throw new Error("Realisasi tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_status_belum_direalisasi = async (value) => {
  const check = await Realisasi_permohonan.findOne({
    where: { id: value },
    attributes: ["status_realisasi", "status"],
    raw: true,
  });

  if (!check) {
    throw new Error("Realisasi tidak ditemukan");
  }

  if (check.status !== "approve") {
    throw new Error(
      "Realisasi belum disetujui, tidak dapat melakukan realisasi bantuan"
    );
  }

  if (check.status_realisasi === "sudah_direalisasi") {
    throw new Error("Realisasi sudah direalisasi dan tidak dapat diubah");
  }

  return true;
};

validation.check_status_approve = async (value) => {
  const check = await Realisasi_permohonan.findOne({
    where: { id: value },
    attributes: ["status", "status_realisasi"],
    raw: true,
  });

  if (!check) {
    throw new Error("Realisasi tidak ditemukan");
  }

  if (check.status !== "approve") {
    throw new Error("Realisasi belum disetujui");
  }

  return true;
};

validation.check_status_sudah_direalisasi = async (value) => {
  const check = await Realisasi_permohonan.findOne({
    where: { id: value },
    attributes: ["status_realisasi"],
    raw: true,
  });

  if (!check) {
    throw new Error("Realisasi tidak ditemukan");
  }

  if (check.status_realisasi !== "sudah_direalisasi") {
    throw new Error("Realisasi belum direalisasi, tidak dapat dibatalkan");
  }

  return true;
};

validation.check_id_kegiatan = async (value) => {
  const check = await Kegiatan.findByPk(value);
  if (!check) {
    throw new Error("Kegiatan tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_id_bank = async (value) => {
  const check = await Bank.findByPk(value);
  if (!check) {
    throw new Error("Bank tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_tanggal_realisasi = async (value) => {
  const today = moment().format("YYYY-MM-DD");
  if (moment(value).isAfter(today)) {
    throw new Error("Tanggal realisasi tidak boleh lebih dari hari ini");
  }
  return true;
};

validation.check_nominal_realisasi = async (value, { req }) => {
  const { id } = req.body;

  const realisasi = await Realisasi_permohonan.findOne({
    where: { id },
    attributes: ["biaya_disetujui"],
    raw: true,
  });

  if (!realisasi) {
    throw new Error("Realisasi tidak ditemukan");
  }

  if (value > realisasi.biaya_disetujui) {
    throw new Error(
      `Nominal realisasi tidak boleh melebihi biaya yang disetujui (Rp ${realisasi.biaya_disetujui.toLocaleString(
        "id-ID"
      )})`
    );
  }

  if (value <= 0) {
    throw new Error("Nominal realisasi harus lebih dari 0");
  }

  return true;
};

validation.check_selected_ids = async (value) => {
  try {
    const ids = JSON.parse(value);

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Selected IDs harus berupa array dan tidak boleh kosong");
    }

    // Validasi setiap ID
    const checks = await Promise.all(
      ids.map((id) =>
        Realisasi_permohonan.findOne({
          where: {
            id,
            status: "approve",
            status_realisasi: "sudah_direalisasi",
            berita_acara: null,
            [Op.or]: [
              { bukti_transfer: { [Op.not]: null } },
              { mou: { [Op.not]: null } },
            ],
          },
          attributes: ["id"],
        })
      )
    );

    const invalidIds = ids.filter((id, index) => !checks[index]);
    if (invalidIds.length > 0) {
      throw new Error(
        `ID tidak valid atau tidak memenuhi syarat: ${invalidIds.join(", ")}`
      );
    }

    return true;
  } catch (error) {
    throw new Error(error.message || "Format Selected IDs tidak valid");
  }
};

validation.check_status_sudah_direalisasi = async (value) => {
  const check = await Realisasi_permohonan.findOne({
    where: { id: value },
    attributes: ["status_realisasi"],
    raw: true,
  });

  if (!check) {
    throw new Error("Realisasi tidak ditemukan");
  }

  if (check.status_realisasi !== "sudah_direalisasi") {
    throw new Error("Realisasi belum direalisasi, tidak dapat dibatalkan");
  }

  return true;
};

// ========================================
// UPLOAD HANDLER - BUKTI REALISASI
// ========================================
const uploadPathRealisasi = path.join(
  __dirname,
  "../uploads/dokumen/bakal_penerima_bantuan/bukti_realisasi"
);

if (!fs.existsSync(uploadPathRealisasi)) {
  fs.mkdirSync(uploadPathRealisasi, { recursive: true });
}

const storageRealisasi = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPathRealisasi);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10); // 8 karakter
    const filename = `${randomString}_${req.body.tipe}_${timestamp}${ext}`;

    req.body.bukti_realisasi = filename;
    cb(null, filename);
  },
});

const fileFilterRealisasi = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus gambar (JPG, JPEG, PNG)"), false);
  }
};

// ========================================
// UPLOAD HANDLER - BERITA ACARA
// ========================================
const uploadPathBeritaAcara = path.join(
  __dirname,
  "../uploads/dokumen/bakal_penerima_bantuan/berita_acara"
);

if (!fs.existsSync(uploadPathBeritaAcara)) {
  fs.mkdirSync(uploadPathBeritaAcara, { recursive: true });
}

const storageBeritaAcara = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPathBeritaAcara);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10); // 8 karakter
    const filename = `${randomString}_${timestamp}${ext}`;

    req.body.berita_acara = filename;
    cb(null, filename);
  },
});

const fileFilterBeritaAcara = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus gambar (JPG, JPEG, PNG)"), false);
  }
};

// ========================================
// MULTER UPLOAD CONFIGS
// ========================================
validation.single = {
  upload: (fieldName) => {
    return (req, res, next) => {
      let upload;

      if (fieldName === "bukti_realisasi") {
        upload = multer({
          storage: storageRealisasi,
          fileFilter: fileFilterRealisasi,
          limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
        }).single(fieldName);
      } else if (fieldName === "berita_acara") {
        upload = multer({
          storage: storageBeritaAcara,
          fileFilter: fileFilterBeritaAcara,
          limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
        }).single(fieldName);
      }

      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            error: true,
            error_msg: err.message,
          });
        }
        next();
      });
    };
  },
};

module.exports = validation;
