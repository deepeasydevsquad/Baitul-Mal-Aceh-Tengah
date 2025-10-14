// const Model_cud = require("../models/model_cud");
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.daftar_program = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller program donasi");
  try {
    const model = new Model_r(req);
    const data = await model.daftar_donasi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};
exports.detail_donasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.detail_donasi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.daftar_donatur = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.donatur_donasi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.detail_donatur = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.detail_donatur();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};
exports.konfirmasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.getKonfirmasi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.detail_konfirmasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.detail_konfirmasi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.riwayat_donasi_user = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.get_riwayat_donasi_user();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.detail_riwayat = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.detail_riwayat();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.getMemberProfile = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const memberData = await model_r.getMemberProfile();
    res.status(200).json({
      error: false,
      message: "Profil member berhasil ditemukan.",
      data: memberData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.getBankList = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const bankData = await model_r.get_bank();
    res.status(200).json({
      error: false,
      message: "Daftar bank berhasil ditemukan.",
      data: bankData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add_donasi();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Donasi bantuan berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Donasi bantuan gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.update_konfirmasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update_konfirmasi();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Donasi bantuan berhasil diupdate.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Donasi bantuan gagal diupdate.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
