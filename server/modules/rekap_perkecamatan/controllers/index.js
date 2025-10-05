const {
  handleValidationErrors,
  handleServerError,
  messageError,
} = require("../../../helper/handleError");
const ExcelJS = require("exceljs");
const moment = require("moment");
const Model_r = require("../models/model_r");
const { convertToRP } = require("../../../helper/currencyHelper");
const { kabupatenKota } = require("../../../helper/locationHelper");

const controllers = {};

controllers.fn_get_data_laporan_rekap_per_kecamatan = async (req, res) => {
    try {
      const { tahun } = req.query;
      const model_r_instance = new Model_r(req);
      const feedBack = await model_r_instance.fn_get_data_laporan_rekap_per_kecamatan(tahun);
  
      if (feedBack.error) {
        return res.status(500).json({
          error: true,
          error_msg: feedBack.message || "Gagal mengambil data laporan",
          data: {},
        });
      }
      if (!feedBack.feedBack || Object.keys(feedBack.feedBack).length === 0) {
        return res.status(404).json({
          error: true,
          error_msg: "Data laporan penyaluran tidak ditemukan",
          data: {},
        });
      }
  
      res.status(200).json({
        error: false,
        error_msg: "Data laporan penyaluran ditemukan",
        data: feedBack,
      });
    } catch (error) {
      console.error("ERROR in controller:", error);
      res.status(500).json({ 
        error: true, 
        error_msg: "Internal Server Error",
        message: error.message 
      });
    }
  };

module.exports = controllers;
