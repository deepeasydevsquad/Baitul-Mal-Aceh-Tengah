const express = require('express');
const cors = require("cors");
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

// Inisialisasi express app jika belum ada
const app = express();

// CORS configuration - letakkan di bagian atas setelah inisialisasi app
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // tambahkan variasi localhost
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const controllers = {};

// GET method untuk mendapatkan info pengaturan whatsapp
controllers.get_info_pengaturan_whatsapp = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_pengaturan_whatsapp();

    res.status(200).json({
      error: false,
      data: feedBack,
    });
  } catch (error) {
    console.error('Error in get_info_pengaturan_whatsapp:', error);
    handleServerError(res, error);
  }
};

controllers.pengaturan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.PengaturanWhatsapp();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.add = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add();

    const result = await model_cud.response();
    if (result.success) {
      res.status(200).json({
        error: false,
        error_msg: 'pengaturan_whatsapp berhasil ditambahkan.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: result.message || 'pengaturan_whatsapp gagal ditambahkan.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_info_edit_pengaturan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_edit_PengaturanWhatsapp();

    res.status(200).json({
      error: false,
      data: feedBack,
      total: 1
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.edit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.update();

    const result = await model_cud.response();
    if (result.success) {
      res.status(200).json({
        error: false,
        error_msg: 'pengaturan whatsapp berhasil diperbaharui.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: result.message || 'pengaturan_whatsapp gagal diperbaharui.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    const result = await model_cud.response();
    if (result.success) {
      res.status(200).json({
        error: false,
        error_msg: 'pengaturan whatsapp berhasil dihapus.',
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: result.message || 'pengaturan_whatsapp gagal dihapus.',
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
