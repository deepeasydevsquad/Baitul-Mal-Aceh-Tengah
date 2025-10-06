const Model_r = require("../models/model_r");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");
const moment = require("moment");

exports.list_rekap_distribusi_per_asnaf = async (req, res) => {
  try {
    const model = new Model_r(req);
    const { data } = await model.list_rekap_distribusi_per_asnaf(); // ambil langsung data array
    res.json({ success: true, data }); // kirim langsung array, bukan object dalam object
  } catch (err) {
    console.error("🔥 Error in list_rekap_distribusi_per_asnaf:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
