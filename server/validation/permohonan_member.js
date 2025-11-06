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

// === VALIDATION DATABASE CHECKS ===
validation.check_id_permohonan_bantuan = async (value) => {
  const check = await Realisasi_permohonan.findByPk(value);
  if (!check) {
    throw new Error("Permohonan tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_status_permohonan_bantuan = async (value) => {
  const check = await Realisasi_permohonan.findOne({
    where: { id: value },
    attributes: ["status_realisasi"],
    raw: true,
  });

  if (!check) {
    throw new Error("Permohonan tidak ditemukan");
  }

  if (check.status_realisasi === "sudah_direalisasi") {
    throw new Error(
      "Status permohonan sudah direalisasi dan tidak dapat diubah"
    );
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

validation.check_id_member = async (value, { req }) => {
  const body = req.body;

  const check = await Member.findByPk(value);
  if (!check) {
    throw new Error("Member tidak terdaftar di pangkalan data");
  }

  if (!body.id) {
    const check_permohonan = await Realisasi_permohonan.findOne({
      include: [
        {
          model: Permohonan,
          where: { member_id: value },
          required: true,
          attributes: [],
          include: [
            {
              model: Kegiatan,
              attributes: [],
              where: { tahun: moment().format("YYYY") },
              required: true,
            },
          ],
        },
      ],
    });
    if (check_permohonan) {
      throw new Error("Member sudah mempunyai permohonan");
    }
  }

  return true;
};

validation.check_nominal_yang_disetujui = async (value, { req }) => {
  const { id } = req.body;
  const [dataKegiatan, dataPermohonan] = await Promise.all([
    Kegiatan.findOne({
      where: { id },
      attributes: ["jumlah_dana", "jumlah_maksimal_nominal_bantuan"],
      raw: true,
    }),
    Realisasi_permohonan.findOne({
      raw: true,
      attributes: [
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("SUM", sequelize.col("nominal_realisasi")),
            0
          ),
          "total",
        ],
      ],
      include: [
        {
          model: Permohonan,
          where: { kegiatan_id: id },
          required: true,
          attributes: [],
        },
      ],
    }),
  ]);

  if (value > dataKegiatan.jumlah_maksimal_nominal_bantuan) {
    throw new Error("Nominal yang disetujui melebihi batas maksimal bantuan");
  }

  if (value > dataKegiatan.jumlah_dana - dataPermohonan.total) {
    throw new Error("Nominal yang disetujui melebihi sisa dana kegiatan ini");
  }
  return true;
};

// === UPLOAD HANDLER ===
const uploadPath = path.join(
  __dirname,
  "../uploads/dokumen/permohonan_bantuan"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = file.fieldname.replace(/^dokumen_/, "");
    const timestamp = Date.now();
    const filename = `${baseName}_${timestamp}${ext}`;

    // inject ke req.body biar gampang diakses di controller
    if (!req.body.arr_path) req.body.arr_path = [];
    req.body.arr_path.push({ basename: baseName, path: filename });

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus PDF, JPEG, JPG, PNG"), false);
  }
};

// === FINAL UPLOAD ===
validation.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
}).any(); // <== allow semua dokumen dynamic

// === HELPER UNTUK MERGE FILES + META ===
validation.parseUploadData = (req) => {
  const dokumenMap = {};

  // 1. Files dari multer
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      dokumenMap[file.fieldname] = {
        file: file.filename,
      };
    });
  }

  // 2. Meta dari req.body (JSON string yg dikirim frontend)
  Object.entries(req.body).forEach(([key, val]) => {
    if (key.startsWith("dokumen_")) {
      try {
        const meta = JSON.parse(val);
        if (!dokumenMap[key]) dokumenMap[key] = {};
        dokumenMap[key] = { ...dokumenMap[key], ...meta };
      } catch (err) {
        // kalo bukan JSON valid, skip
      }
    }
  });

  return dokumenMap;
};

validation.parseUploadMiddleware = (req, res, next) => {
  try {
    req.body.dokumenMap = validation.parseUploadData(req);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validation;
