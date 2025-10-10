const Model_r = require("../models/model_r");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.beranda = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("_______DDDDDDDDD_______");
  console.log("controller beranada");
  console.log("_______DDDDDDDDD_______");

  try {
    const model = new Model_r(req);
    const data = await model.laporan_pertahun();

    return res.status(200).json({
      success: true,
      message: "Laporan pertahun berhasil diambil",
      ...data,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};
