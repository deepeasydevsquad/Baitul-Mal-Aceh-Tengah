const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");
const { validationResult } = require("express-validator");

const controllers = {};

controllers.getZakatList = async (req, res) => {
  try {
    const { search, perpage, pageNumber } = req.body;
    const model_r = new Model_r(req);
    const { data, total } = await model_r.getZakatList(
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

controllers.kode_pembayaran = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const kode = await model_r.generateKode();
    res.status(200).json({
      error: false,
      message: "kode pembayaran berhasil di buat",
      data: kode,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.getMemberProfile = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const memberData = await model_r.getMemberProfile();
    res.status(200).json({
      error: false,
      message: "Profil member berhasil ditemukan.",
      data: memberData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.getBankList = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const bankData = await model_r.getZakatBanks();
    res.status(200).json({
      error: false,
      message: "Daftar bank berhasil ditemukan.",
      data: bankData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.getTipeZakat = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const tipeZakatData = await model_r.getTipeZakat();
    res.status(200).json({
      error: false,
      message: "Daftar tipe zakat berhasil ditemukan.",
      data: tipeZakatData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.addZakat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors.array());
  }

  try {
    const { tipe, nominal, invoice, kode } = req.body;

    const model_cud = new Model_cud(req);
    const newZakat = await model_cud.addZakat(tipe, nominal, invoice, kode);

    res.status(201).json({
      error: false,
      message: "Pembayaran Zakat berhasil dicatat dan sedang diproses.",
      data: newZakat,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.confirmZakatPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors.array());
  }

  try {
    const { invoice } = req.body;

    const model_cud = new Model_cud(req);
    const updatedZakat = await model_cud.confirmPayment(invoice);

    res.status(200).json({
      error: false,
      message: "Konfirmasi pembayaran berhasil dikirim.",
      data: updatedZakat,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
