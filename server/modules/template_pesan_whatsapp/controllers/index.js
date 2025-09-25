const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list template pesan whatsapp
exports.list_template_pesan_whatsapp = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.daftar_template_pesan_whatsapp();

        res.status(200).json({
            status: "success",
            message: "Berhasil mengambil daftar template pesan whatsapp",
            data: data || [],
            error: false,
            error_msg: null,
        });
    } catch (error) {
        console.error("Terjadi error saat mengambil daftar template pesan whatsapp:", error);
        handleServerError(res, error);
    }
};

// tambah template pesan whatsapp
exports.add = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.create();

        if (await model.response()) {
            res.status(200).json({
                status: "success",
                message: model.message || "Berhasil menambahkan template pesan whatsapp baru",
                error: false,
                error_msg: null,
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: model.message || "Gagal menambahkan template pesan whatsapp baru",
                error: true,
                error_msg: model.message || "Proses gagal",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menambahkan template pesan whatsapp baru:", error);
        handleServerError(res, error);
    }
};

// edit template pesan whatsapp
exports.update = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.update();

        if (await model.response()) {
            res.status(200).json({
                status: "success",
                message: model.message || "Berhasil memperbarui template pesan whatsapp",
                error: false,
                error_msg: null,
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: model.message || "Gagal memperbarui template pesan whatsapp",
                error: true,
                error_msg: model.message || "Proses gagal",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat memperbarui template pesan whatsapp:", error);
        handleServerError(res, error);
    }
};

// hapus template pesan whatsapp
exports.delete = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.delete();

        if (await model.response()) {
            res.status(200).json({
                status: "success",
                message: model.message || "Berhasil menghapus template pesan whatsapp",
                error: false,
                error_msg: null,
            });
        } else {
            res.status(400).json({
                status: "failed",
                message: model.message || "Gagal menghapus template pesan whatsapp",
                error: true,
                error_msg: model.message || "Proses gagal",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat menghapus template pesan whatsapp:", error);
        handleServerError(res, error);
    }
};

// ambil detail template pesan whatsapp
exports.detail = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_r(req);
        const data = await model.detail_template_pesan_whatsapp();

        if (data) {
            res.status(200).json({
                status: "success",
                message: "Berhasil mengambil detail template pesan whatsapp",
                data,
                error: false,
                error_msg: null,
            });
        } else {
            res.status(404).json({
                status: "failed",
                message: "Template pesan whatsapp tidak ditemukan",
                error: true,
                error_msg: "Data tidak ditemukan",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat mengambil detail template pesan whatsapp:", error);
        handleServerError(res, error);
    }
};
