const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list asnaf
exports.list_asnaf = async (req, res) => {
    // filter error
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.daftar_asnaf();

        res.status(200).json({
            message: "Berhasil mengambil daftar asnaf",
            status: "success",
            data: data || [],
        });
    } catch (error) {
        console.error("Terjadi error saat mengambil daftar asnaf:", error);
        handleServerError(res, error);
    }
};

// tambah asnaf
exports.add = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.create();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menambahkan asnaf baru",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menambahkan asnaf baru",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menambahkan asnaf baru:", error);
        handleServerError(res, error);
    }
};

// edit asnaf
exports.update = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil memperbarui asnaf",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal memperbarui asnaf",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat memperbarui asnaf:", error);
        handleServerError(res, error);
    }
};

// hapus asnaf
exports.delete = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.delete();

        if (await model.response()) {
            res.status(200).json({
                message: model.message || "Berhasil menghapus asnaf",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal menghapus asnaf",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menghapus asnaf:", error);
        handleServerError(res, error);
    }
};

// ambil detail asnaf
exports.detail = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.detail_asnaf(); // method baru di model_r

        if (data) {
            res.status(200).json({
                message: "Berhasil mengambil detail asnaf",
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
        console.error("Terjadi error saat mengambil detail asnaf:", error);
        handleServerError(res, error);
    }
};

