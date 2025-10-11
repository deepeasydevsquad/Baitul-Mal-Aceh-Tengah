const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.daftar_riwayat();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

controllers.delete = async (req, res) => {
  // filter error
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_cud(req);
    await model.delete();

    if (await model.response()) {
      res.status(200).json({
        message:
          model.message || "Berhasil, Melakukan Verifikasi Request Keanggotaan",
        status: "success",
      });
    } else {
      res.status(400).json({
        message: model.message || "Gagal melakukan Verifikasi",
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Terjadi error saat Melakukan Verifikasi:", error);
    handleServerError(res, error);
  }
};

module.exports = controllers;
