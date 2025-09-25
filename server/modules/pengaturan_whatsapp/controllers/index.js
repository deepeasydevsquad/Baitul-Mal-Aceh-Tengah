const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

// GET method untuk mendapatkan info pengaturan whatsapp
controllers.get_konfigurasi = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_konfigurasi();

    res.status(200).json({
      error: false,
      data: feedBack,
    });
  } catch (error) {
    console.error("Error in get_info_pengaturan_whatsapp:", error);
    handleServerError(res, error);
  }
};

controllers.list_pengaturan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_pengaturan_whatsapp();

    console.log("================");
    console.log(feedBack);
    console.log("================");

    res.status(200).json({
      error: false,
      data: feedBack,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.start = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.get_start();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

controllers.update = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "pengaturan whatsapp berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "pengaturan whatsapp gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
