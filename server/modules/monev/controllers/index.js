const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

const controllers = {};

// READ Controllers
controllers.get_monev_list = async (req, res) => {
  try {
    const model = new Model_r(req);
    // memanggil method yang benar (daftar_monev)
    const data = await model.daftar_monev();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.pertanyaan_evaluasi = async (req, res) => {
  try {
    const model = new Model_r(req);
    // memanggil method yang benar (daftar_monev)
    const data = await model.pertanyaan_evaluasi();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.pertanyaan_monitoring = async (req, res) => {
  try {
    const model = new Model_r(req);
    // memanggil method yang benar (daftar_monev)
    const data = await model.pertanyaan_monitoring();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.kirim_jawaban_evaluasi = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const result = await model.kirim_jawaban_evaluasi();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.kirim_jawaban_monitoring = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const result = await model.kirim_jawaban_monitoring();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Status Monitoring & Evaluasi
controllers.gabung_status_monev = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.gabung_status_monev();

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil status monev gabungan",
      data,
    });
  } catch (error) {
    console.error("Error gabung_status_monev:", error);
    res.status(500).json({
      success: false,
      error_msg: "Gagal mengambil status monev gabungan",
    });
  }
};

module.exports = controllers;
