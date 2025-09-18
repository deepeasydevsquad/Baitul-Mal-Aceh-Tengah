const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list tab
exports.list_tab = async (req, res) => {
    // filter error
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.daftar_tab();

        res.status(200).json({
            message: "Berhasil mengambil daftar tab",
            status: "success",
            data: data || [],
        });
    } catch (error) {
        console.error("Terjadi error saat mengambil daftar tab:", error);
        handleServerError(res, error);
    }
};

// edit tab
exports.update = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                message: "Deskripsi Berhasil Diperbaharui!",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal Mengedit Tab!",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat mengedit tab:", error);
        handleServerError(res, error);
    }
};

// ambil detail tab
exports.detail = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.detail_tab(); // method baru di model_r

        if (data) {
            res.status(200).json({
                message: "Berhasil mengambil detail tab",
                status: "success",
                data,
            });
        } else {
            res.status(404).json({
                message: "Tab tidak ditemukan",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat mengambil detail tab:", error);
        handleServerError(res, error);
    }
};

