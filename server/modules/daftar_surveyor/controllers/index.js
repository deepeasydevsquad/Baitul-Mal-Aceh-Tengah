const Model_r = require("../models/model_r");
const Model_cud = require('../models/model_cud');
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");
// list agen
exports.list = async (req, res) => {
    console.log("controller item");
    try {
        const model = new Model_r(req);
        const data = await model.daftar_Surveyor();
        return res.status(200).json(data); // pake return
    } catch (error) {
        console.error("DDDDD");
        console.error(error);
        console.error("DDDDD");
        return handleServerError(res, error); // kasih full error object
    }
};

// list agen
exports.detail = async (req, res) => {
    console.log("controller item");
    try {
        const model = new Model_r(req);
        const data = await model.detail_surveyor();
        return res.status(200).json(data); // pake return
    } catch (error) {
        console.error("DDDDD");
        console.error(error);
        console.error("DDDDD");
        return handleServerError(res, error); // kasih full error object
    }
};
// CREATE
exports.add = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.create();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menambahkan data surveyor baru",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menambahkan data surveyor baru",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menambah surveyor:", error);
        handleServerError(res, error);
    }
};

// UPDATE
exports.updateSurveyor = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil memperbarui data surveyor",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal memperbarui data surveyor",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat update surveyor:", error);
        handleServerError(res, error);
    }
};

// DELETE
exports.deleteSurveyor = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.delete();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menghapus data surveyor",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menghapus data surveyor",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat delete surveyor:", error);
        handleServerError(res, error);
    }
};
