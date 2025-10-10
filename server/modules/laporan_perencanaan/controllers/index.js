const Model_r = require("../models/model_r");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

exports.list_laporan_perencanaan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  console.log("controller item");
  try {
    const model = new Model_r(req);
    const data = await model.list_laporan_perencanaan();
    return res.status(200).json(data); // pake return
  } catch (error) {
    console.error("_____DDDDD_______");
    console.error(error);
    console.error("_____DDDDD_______");
    return handleServerError(res, error); // kasih full error object
  }
};
