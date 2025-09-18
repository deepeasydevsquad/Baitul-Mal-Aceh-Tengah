const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.daftar_program_donasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.list();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.detail = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.detail();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.daftar_member = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.list_member();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.add();

    if (await model.response()) {
      res.status(200).json({
        message: "Berhasil menambahkan program donasi ",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat menambahkan donasi:", error);
    handleServerError(res, error);
  }
};

exports.edit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.edit();

    if (await model.response()) {
      res.status(200).json({
        message: "Berhasil mengedit program donasi ",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat mengedit donasi:", error);
    handleServerError(res, error);
  }
};

exports.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.delete();

    if (await model.response()) {
      res.status(200).json({
        message: "Berhasil menghapus donasi ",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat  menghapus donasi:", error);
    handleServerError(res, error);
  }
};

exports.tutup = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.close();

    if (await model.response()) {
      res.status(200).json({
        message: "Berhasil menutup program donasi ",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat menutup donasi:", error);
    handleServerError(res, error);
  }
};

exports.add_donasi = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.add_donasi();

    if (await model.response()) {
      res.status(200).json({
        message: "Berhasil menambahkan donasi ",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat menambahkan donasi:", error);
    handleServerError(res, error);
  }
};
