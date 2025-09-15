const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.list = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.daftar_kegiatan();
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
        error_msg: "Kegiatan berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Kegiatan gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.list_desa = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.daftar_desa();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.list_kecamatan = async (req, res) => {
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.daftar_kecamatan();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};
