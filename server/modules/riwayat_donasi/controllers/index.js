const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

// list riwayat donasi
exports.list_riwayat_donasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const feedBack = await model.list_riwayat_donasi();

    // return
    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    console.error("Terjadi error saat mengambil daftar riwayat donasi:", error);
    handleServerError(res, error);
  }
};

// hapus riwayat donasi
exports.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.delete();

    if (await model.response()) {
      res.status(200).json({
        status: "success",
        message: model.message || "Berhasil menghapus riwayat donasi",
        error: false,
        error_msg: null,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: model.message || "Gagal menghapus riwayat donasi",
        error: true,
        error_msg: model.message || "Proses gagal",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat menghapus riwayat donasi:", error);
    handleServerError(res, error);
  }
};

// ambil detail riwayat donasi
exports.detail = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.detail_riwayat_donasi();

    if (data) {
      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil detail riwayat donasi",
        data,
        error: false,
        error_msg: null,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "Riwayat donasi tidak ditemukan",
        error: true,
        error_msg: "Data tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat mengambil detail riwayat donasi:", error);
    handleServerError(res, error);
  }
};

exports.update_status = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.updatestatus();

    if (model.state) {
      res.status(200).json({
        status: "success",
        message: model.message,
        error: false,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: model.message,
        error: true,
      });
    }
  } catch (error) {
    console.error(
      "❌ Terjadi error saat mengupdate status riwayat donasi:",
      error
    );
    handleServerError(res, error);
  }
};
