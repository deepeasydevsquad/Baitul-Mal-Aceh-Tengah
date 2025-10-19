const Model_r = require("../models/model_r");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.getLaporan();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};

exports.list_bantuan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.get_program_by_tipe();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};
