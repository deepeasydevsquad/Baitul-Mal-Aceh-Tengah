const Model_cud = require("../models/model_cud");
const Model_r = require("../models/model_r");
const {
  handleServerError,
  handleValidationErrors,
} = require("../../../helper/handleError");

exports.list_grup = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.list_grup();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.list_menu_by_id = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.list_menu_by_id();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.list_menu = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.list_menu();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

exports.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Grup berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Grup gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.edit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Grup berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Grup gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Grup berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Grup gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
