const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list syarat
exports.list_syarat = async (req, res) => {
    // filter error
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.daftar_syarat();

        res.status(200).json({
            message: "Berhasil mengambil daftar syarat",
            status: "success",
            data: data || [],
        });
    } catch (error) {
        console.error("Terjadi error saat mengambil daftar syarat:", error);
        handleServerError(res, error);
    }
};

// tambah syarat
exports.add = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.create();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menambahkan syarat baru",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menambahkan syarat baru",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menambahkan syarat baru:", error);
        handleServerError(res, error);
    }
};

// edit syarat
exports.update = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil memperbarui syarat",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal memperbarui syarat",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat memperbarui syarat:", error);
        handleServerError(res, error);
    }
};

// hapus syarat
exports.delete = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.delete();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menghapus syarat",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menghapus syarat",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menghapus syarat:", error);
        handleServerError(res, error);
    }
};
