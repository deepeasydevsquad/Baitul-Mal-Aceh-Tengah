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
    const data = await model.createPertanyaan();
    res
      .status(201)
      .json({ error: false, data, message: "Pertanyaan berhasil dibuat" });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.update_pertanyaan = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.updatePertanyaan();
    res
      .status(200)
      .json({ error: false, data, message: "Pertanyaan berhasil diperbarui" });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete_pertanyaan = async (req, res) => {
  try {
    const model = new Model_cud(req);
    const data = await model.deletePertanyaan();
    res.status(200).json({ error: false, ...data });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
