const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");
const { validationResult } = require("express-validator");

const controllers = {};

controllers.getInfaqList = async (req, res) => {
  try {
    const { search, perpage, pageNumber } = req.body;
    const model_r = new Model_r(req);
    const { data, total } = await model_r.getInfaqList(
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
    const bankData = await model_r.getInfaqBanks();
    res.status(200).json({
      error: false,
      message: "Daftar bank berhasil ditemukan.",
      data: bankData,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.addInfaq = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors.array());
  }

  try {
    const { nominal, invoice } = req.body;
    const kode = Math.floor(100 + Math.random() * 900);

    const model_cud = new Model_cud(req);
    const newInfaq = await model_cud.addInfaq(nominal, invoice, kode);

    res.status(201).json({
      error: false,
      message: "Pembayaran infaq berhasil dicatat dan sedang diproses.",
      data: newInfaq,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.confirmInfaqPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors.array());
  }

  try {
    const { invoice } = req.body;

    const model_cud = new Model_cud(req);
    const updatedInfaq = await model_cud.confirmPayment(invoice);

    res.status(200).json({
      error: false,
      message: "Konfirmasi pembayaran berhasil dikirim.",
      data: updatedInfaq,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
