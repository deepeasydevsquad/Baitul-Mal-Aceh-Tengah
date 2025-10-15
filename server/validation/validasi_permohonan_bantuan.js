const {
  Op,
  sequelize,
  Realisasi_permohonan,
  Validasi_syarat_permohonan,
  Permohonan,
  Kegiatan,
  Bank,
  Member,
} = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { convertToRP } = require("../helper/currencyHelper");

const validation = {};

// === VALIDATION DATABASE CHECKS ===
validation.check_id_permohonan_bantuan = async (value) => {
  const check = await Realisasi_permohonan.findByPk(value);
  if (!check) {
    throw new Error("Permohonan tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_id_validasi_permohonan_bantuan = async (value, { req }) => {
  const body = req.body;
  const check = await Validasi_syarat_permohonan.findOne({
    where: {
      id: value,
      realisasi_permohonan_id: body.id,
    },
  });

  if (!check) {
    throw new Error("Validasi file syarat tidak terdaftar di pangkalan data");
  }

  // Pastikan status bukan approve
  if (check.status === "approve") {
    throw new Error(
      "Validasi file syarat sudah disetujui, tidak dapat diubah lagi"
    );
  }

  return true;
};

validation.check_berkas = async (value) => {
  const totalBerkas = await Validasi_syarat_permohonan.count({
    where: { realisasi_permohonan_id: value },
  });

  if (totalBerkas === 0) {
    throw new Error("Belum ada berkas yang diunggah untuk permohonan ini.");
  }

  const berkasBelumApprove = await Validasi_syarat_permohonan.count({
    where: {
      realisasi_permohonan_id: value,
      status: { [Op.ne]: "approve" }, // Not equal to 'approve'
    },
  });

  if (berkasBelumApprove > 0) {
    throw new Error(
      "Masih ada berkas yang belum disetujui. Harap approve semua berkas terlebih dahulu."
    );
  }

  return true;
};

validation.check_biaya_disetujui = async (value, { req }) => {
  // Ambil kegiatan_id langsung lewat relasi Realisasi → Permohonan
  const realisasi = await Realisasi_permohonan.findOne({
    where: { id: req.body.id },
    attributes: [],
    include: [
      {
        model: Permohonan,
        attributes: ["kegiatan_id"],
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  if (!realisasi) throw new Error("Data realisasi permohonan tidak ditemukan");

  const kegiatanId = realisasi.Permohonan.kegiatan_id;

  // Jalankan dua query paralel
  const [dataKegiatan, dataRealisasiTotal] = await Promise.all([
    Kegiatan.findOne({
      where: { id: kegiatanId },
      attributes: ["jumlah_dana"],
      raw: true,
    }),
    Realisasi_permohonan.findOne({
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
          where: { kegiatan_id: kegiatanId },
          required: true,
          attributes: [],
        },
      ],
      raw: true,
    }),
  ]);

  if (!dataKegiatan) throw new Error("Data kegiatan tidak ditemukan");

  const totalRealisasi = Number(dataRealisasiTotal.total) || 0;
  const sisaDana = dataKegiatan.jumlah_dana - totalRealisasi;

  if (value > sisaDana) {
    throw new Error(
      `Nominal disetujui (${convertToRP(
        value
      )}) melebihi sisa dana kegiatan (${convertToRP(sisaDana)})`
    );
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
    if (!req.body.file) req.body.file = [];
    req.body.file.push({ basename: baseName, path: filename });
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus PDF"), false);
  }
};

// === FINAL UPLOAD ===
validation.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
});

module.exports = validation;
