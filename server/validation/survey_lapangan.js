// ============================================
// VALIDATION: validation/survey_lapangan.js
// ============================================
const {
  Op,
  Surveyor_kegiatan,
  Surveyor,
  Survey_permohonan,
  Realisasi_permohonan,
  Permohonan,
  Member,
} = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const validation = {};

// Check access code valid dan active
validation.check_access_code = async (value) => {
  const check = await Surveyor_kegiatan.findOne({
    where: {
      access_code: value,
      status: "active",
    },
  });

  if (!check) {
    throw new Error("Access Code tidak terdaftar atau tidak aktif");
  }

  return true;
};

// Check member exists
validation.check_id_member = async (value) => {
  const check = await Member.findOne({
    where: {
      id: value,
    },
  });

  if (!check) {
    throw new Error("Member tidak terdaftar di pangkalan data");
  }

  return true;
};

// Check member belum pernah di-survey dalam access code ini
validation.check_member_not_surveyed = async (member_id, access_code) => {
  // Get surveyor_kegiatan_id from access_code
  const surveyorKegiatan = await Surveyor_kegiatan.findOne({
    where: { access_code },
    attributes: ["id", "kegiatan_id"],
  });

  if (!surveyorKegiatan) {
    throw new Error("Access Code tidak valid");
  }

  // Survey_permohonan -> Permohonan -> member_id
  const existingSurvey = await Survey_permohonan.findOne({
    where: {
      surveyor_kegiatan_id: surveyorKegiatan.id,
    },
    include: [
      {
        model: Permohonan,
        required: true,
        where: {
          member_id: member_id,
        },
        attributes: ["id"],
      },
    ],
  });

  if (existingSurvey) {
    throw new Error("Member ini sudah pernah disurvey dalam kegiatan ini");
  }

  return true;
};

// Check member termasuk dalam scope access code dan eligible untuk survey
validation.check_member_in_access_code = async (member_id, access_code) => {
  // Get surveyor_kegiatan with kegiatan_id
  const surveyorKegiatan = await Surveyor_kegiatan.findOne({
    where: { access_code, status: "active" },
    attributes: ["id", "kegiatan_id"],
  });

  if (!surveyorKegiatan) {
    throw new Error("Access Code tidak valid atau tidak aktif");
  }

  const member = await Member.findOne({
    where: { id: member_id },
    attributes: ["id", "fullname"],
  });

  if (!member) {
    throw new Error("Member tidak ditemukan di pangkalan data");
  }

  // Check if member ada di Realisasi_permohonan dengan status process_lapangan
  // untuk kegiatan ini
  const eligibleRealisasi = await Realisasi_permohonan.findOne({
    where: { status: "process_lapangan" },
    include: [
      {
        model: Permohonan,
        required: true,
        where: {
          member_id: member_id,
          kegiatan_id: surveyorKegiatan.kegiatan_id,
        },
        attributes: ["id"],
      },
    ],
  });

  if (!eligibleRealisasi) {
    throw new Error(
      "Member tidak eligible untuk survey ini (status bukan process_lapangan atau bukan bagian dari kegiatan ini)"
    );
  }

  return true;
};

// === UPLOAD HANDLER ===
const uploadPath = path.join(__dirname, "../uploads/dokumen/survey_lapangan");

// Create upload directory if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);

    let baseName = file.fieldname;

    if (file.fieldname.includes("dokumentasi")) {
      baseName = "dokumentasi";
    }

    const filename = `${baseName}_${timestamp}_${randomString}${ext}`;

    // Inject ke req.body.uploaded_files untuk menyimpan informasi file
    if (!req.body.uploaded_files) {
      req.body.uploaded_files = {};
    }

    if (file.fieldname.includes("dokumentasi")) {
      if (!req.body.uploaded_files.dokumentasi) {
        req.body.uploaded_files.dokumentasi = [];
      }
      req.body.uploaded_files.dokumentasi.push(filename);
    } else {
      req.body.uploaded_files[file.fieldname] = filename;
    }

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Format file ${file.originalname} harus PDF`), false);
  }
};

// === FINAL UPLOAD ===
validation.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB per file
    files: 12, // Max 12 files (10 dokumentasi + 2 single files) total 12 MB per request
  },
});

module.exports = validation;
