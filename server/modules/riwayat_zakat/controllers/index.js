const Model_r = require("../models/model_r");
const Model_cud = require('../models/model_cud');
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");
// list agen
exports.list = async (req, res) => {
  console.log("controllers item");
  try {
    const model = new Model_r(req);
    const data = await model.list_riwayat_zakat();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("DDDDD");
    console.error(error);
    console.error("DDDDD");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controllers item");

  try {
    const model_r = new Model_r(req);
    const model_cud = new Model_cud(req);
    const invoice = await model_r.gen_invoice();
    await model_cud.add(invoice);

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Riwayat zakat berhasil ditambahkan.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Riwayat Zakat gagal ditambahkan.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};


// DELETE
exports.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controllers item");

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Riwayat zakat berhasil dihapus.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Riwayat Zakat gagal dihapus.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
