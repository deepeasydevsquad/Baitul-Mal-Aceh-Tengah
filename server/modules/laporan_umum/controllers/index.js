const Model_r = require("../models/model_r");

exports.laporan_umum = async (req, res) => {
  const model = new Model_r(req);
  const result = await model.list_laporan_umum();
  return res.json(result);
};

// controller untuk laporan umum
exports.laporan_umum = async (req, res) => {
  try {
    const model = new Model_r(req);
    const result = await model.list_laporan_umum();

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Controller laporan_umum error:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
