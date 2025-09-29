const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

const controllers = {};

controllers.get_jenis_monev_list = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.getJenisMonevList();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_urutan_by_jenis = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.getUrutanByJenis();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.update_urutan = async (req, res) => {
  try {
    const { jenis_monev, urutan_bagian } = req.body;
    if (!jenis_monev || !Array.isArray(urutan_bagian)) {
      return res
        .status(400)
        .json({ error: true, message: "Input tidak valid." });
    }

    const model = new Model_cud(req);
    await model.updateUrutan();
    const result = await model.response();

    if (result.success) {
      res.status(200).json({ error: false, message: result.message });
    } else {
      const statusCode = result.message.includes("tidak ditemukan") ? 404 : 400;
      res.status(statusCode).json({ error: true, message: result.message });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
