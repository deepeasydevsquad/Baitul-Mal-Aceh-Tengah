const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.list = async (req, res) => {
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

exports.detail_target = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.detail_target_distribusi();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.daftar_asnaf = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.list_asnaf();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.add = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.update = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target berhasil update.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target gagal update.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.delete = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target berhasil di hapus.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target gagal di hapus.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
