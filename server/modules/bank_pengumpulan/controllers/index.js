const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleServerError } = require("../../../helper/handleError");

const controllers = {};

controllers.daftar_bank_pengumpulan = async (req, res) => {
  try {
    const { search, perpage, pageNumber } = req.body;
    const model_r = new Model_r(req);
    const { data, total } = await model_r.daftar_bank_pengumpulan(
      search,
      perpage,
      pageNumber
    );

    res.status(200).json({
      error: false,
      message: "Data Berhasil Ditemukan.",
      data: data,
      total: total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.daftar_bank = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const result = await model_r.daftar_bank();

    if (result.success) {
      res
        .status(200)
        .json({ error: false, message: result.message, data: result.data });
    } else {
      res
        .status(400)
        .json({ error: true, message: result.message, data: null });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.add_bank_pengumpulan_baru = async (req, res) => {
  try {
    const model_cud = new Model_cud(req);
    await model_cud.add_bank_pengumpulan_baru();
    const result = await model_cud.response();

    if (result.success) {
      res
        .status(201)
        .json({ error: false, message: result.message, data: result.data });
    } else {
      res.status(400).json({ error: true, message: result.message });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.edit_bank_pengumpulan = async (req, res) => {
  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_bank_pengumpulan();
    const result = await model_cud.response();

    if (result.success) {
      res
        .status(200)
        .json({ error: false, message: result.message, data: result.data });
    } else {
      const statusCode = result.message.includes("tidak ditemukan") ? 404 : 400;
      res.status(statusCode).json({ error: true, message: result.message });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete_bank_pengumpulan = async (req, res) => {
  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete_bank_pengumpulan();
    const result = await model_cud.response();

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
