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

controllers.get_urutan_bagian = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.getUrutanBagian();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.pertanyaan_monev_list = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.pertanyaan_monev_list();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_info_edit = async (req, res) => {
  try {
    const model = new Model_r(req);
    const data = await model.getInfoEdit();
    res.status(200).json({ error: false, data });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.create_pertanyaan = async (req, res) => {
  try {
    const model = new Model_cud(req);
    await model.createPertanyaan();
    const result = await model.response();

    if (result.success) {
      res
        .status(201)
        .json({ error: false, data: result.data, message: result.message });
    } else {
      res.status(400).json({ error: true, message: result.message });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.update_pertanyaan = async (req, res) => {
  try {
    const model = new Model_cud(req);
    await model.updatePertanyaan();
    const result = await model.response();

    if (result.success) {
      res
        .status(200)
        .json({ error: false, data: result.data, message: result.message });
    } else {
      const statusCode = result.message.includes("tidak ditemukan") ? 404 : 400;
      res.status(statusCode).json({ error: true, message: result.message });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete_pertanyaan = async (req, res) => {
  try {
    const model = new Model_cud(req);
    await model.deletePertanyaan();
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
