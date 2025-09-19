const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const runningTextValidation = require("../../../validation/running_text");
const {
  handleServerError,
  handleValidationErrors,
  error_msg,
} = require("../../../helper/handleError");

const controllers = {};

controllers.running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const { data, total } = await model_r.content_text();

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

controllers.add_running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add_running_text();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Running text berhasil ditambahkan.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Running text gagal ditambahkan.',
      });
    }
  } catch (error) {

    handleServerError(res, error);
  }
};

controllers.edit_running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_running_text();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Running text berhasil diperbaharui.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Running text gagal diperbaharui.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete_running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete_running_text();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Running text berhasil dihapus.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Running text gagal dihapus.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.toggle_status_running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    const result = await model_cud.toggle_status();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Status Running text berhasil diperbaharui.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Status Running text gagal diperbaharui.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.update_order_running_text = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update_order();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: 'Order Running text berhasil diperbaharui.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: 'Order Running text berhasil diperbaharui.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.getActiveRunningText = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    
    req.body = {
      search: null,
      perpage: 1000,
      pageNumber: 1,
      activeOnly: true
    };

    const { data } = await model_r.content_text();

    res.status(200).json({
      error: false,
      message: "Data running text aktif berhasil diambil.",
      data: data
    });

  } catch (error) {
    console.error('Error in getActiveRunningText:', error);
    res.status(500).json({
      error: true,
      message: "Terjadi kesalahan saat mengambil running text aktif.",
      details: error.message
    });
  }
};

module.exports = controllers;