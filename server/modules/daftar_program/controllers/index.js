const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list program
exports.list_program = async (req, res) => {
    // filter error
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.daftar_program();

        res.status(200).json({
            message: "Berhasil mengambil daftar program",
            status: "success",
            data: data || [],
        });
    } catch (error) {
        console.error("Terjadi error saat mengambil daftar program:", error);
        handleServerError(res, error);
    }
};

// tambah program
exports.add = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.create();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menambahkan program baru",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menambahkan program baru",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menambahkan program baru:", error);
        handleServerError(res, error);
    }
};

// edit program
exports.update = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil memperbarui program",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal memperbarui program",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat memperbarui program:", error);
        handleServerError(res, error);
    }
};

// hapus program
exports.delete = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.delete();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menghapus program",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menghapus program",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menghapus program:", error);
        handleServerError(res, error);
    }
};

// ambil detail program
exports.detail = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.detail_program(); // method baru di model_r

        if (data) {
            res.status(200).json({
                message: "Berhasil mengambil detail program",
                status: "success",
                data,
            });
        } else {
            res.status(404).json({
                message: "Syarat tidak ditemukan",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat mengambil detail program:", error);
        handleServerError(res, error);
    }
};

