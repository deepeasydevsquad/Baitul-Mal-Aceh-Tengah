const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.list_bank = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.bank();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.list_member = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.member();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.riwayat_infaq();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const model_cud = new Model_cud(req);
    const invoice = await model_r.gen_invoie();
    await model_cud.add(invoice);

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Riwayat infaq berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Riwayat infaq gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.approve_online = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_cud = new Model_cud(req);
    await model_cud.approve_online();
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Pembayaran infaq online berhasil disetujui.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Gagal menyetujui pembayaran infaq online.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.reject_online = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_cud = new Model_cud(req);
    await model_cud.reject_online();
    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Pembayaran infaq online berhasil ditolak.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Gagal menolak pembayaran infaq online.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Riwayat infaq berhasil dihapus.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Riwayat infaq gagal dihapus.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.upload_bukti_transfer = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.upload_bukti_transfer();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Bukti transfer berhasil diupload.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Bukti transfer gagal diupload.",
      });
    }
  } catch (error) {
    console.log("=======error");
    console.log(error);
    console.log("=======error");
    handleServerError(res, error);
  }
};

controllers.upload_bukti_setoran = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.upload_bukti_setoran();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Bukti setoran berhasil diupload.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Bukti setoran gagal diupload.",
      });
    }
  } catch (error) {
    console.log("=======error");
    console.log(error);
    console.log("=======error");
    handleServerError(res, error);
  }
};

module.exports = controllers;
