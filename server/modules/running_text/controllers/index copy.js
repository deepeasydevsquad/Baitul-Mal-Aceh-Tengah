const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const runningTextValidation = require("../../../validation/running_text");
const {
    handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

const validateInput = async (validationFunction, value, req = null) => {
    try {
        await validationFunction(value, { req });
        return { valid: true };
    } catch (error) {
        return { valid: false, message: error.message };
    }
};

controllers.running_text = async (req, res) => {
    try {
        const { search, perpage, pageNumber, activeOnly } = req.body;

        if (search) {
            const searchValidation = await validateInput(runningTextValidation.search_query, search);
            if (!searchValidation.valid) {
                return res.status(400).json({
                    error: true,
                    message: searchValidation.message
                });
            }
        }

        const model_r = new Model_r(req);
        const { data, total } = await model_r.content_text(search, perpage, pageNumber, activeOnly);

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

controllers.get_info_add_running_text = async (req, res) => {
    try {
        const model_r = new Model_r(req);
        const result = await model_r.get_info_add();

        if (result.success) {
            res.status(200).json({
                error: false,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(400).json({
                error: true,
                message: result.message
            });
        }
    } catch (error) {
        console.error('[controller] Error in get_info_add_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat mengambil info add.",
            details: error.message
        });
    }
};

controllers.add_running_text = async (req, res) => {
    console.log('[controller] add_running_text called with:', req.body);

    try {

        const model_cud = new Model_cud();
        const result = await model_cud.add_running_text(req);

        console.log('[controller] Model result:', result);

        if (result.success) {
            res.status(201).json({
                error: false,
                message: "Teks berhasil ditambahkan.",
                data: result.data
            });
        } else {
            res.status(400).json({
                error: true,
                message: result.message
            });
        }

    } catch (error) {
        console.error('[controller] Error in add_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat menambahkan teks.",
            details: error.message
        });
    }
};

controllers.get_info_edit_running_text = async (req, res) => {
    try {
        const { id } = req.body;
        const idInt = parseInt(id, 10);


        const model_r = new Model_r(req);
        const result = await model_r.get_info_edit(idInt);

        if (result.success) {
            res.status(200).json({
                error: false,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(404).json({
                error: true,
                message: result.message
            });
        }
    } catch (error) {
        console.error('[controller] Error in get_info_edit_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat mengambil info edit.",
            details: error.message
        });
    }
};

controllers.edit_running_text = async (req, res) => {
    console.log('[controller] edit_running_text called with data:', req.body);

    try {
        const { id } = req.body;
        const idInt = parseInt(id, 10);


        const model_cud = new Model_cud();
        const result = await model_cud.edit_running_text(idInt, req);

        console.log('[controller] Model edit result:', result);

        if (result.success) {
            res.status(200).json({
                error: false,
                message: "Teks berhasil diperbarui.",
                data: result.data
            });
        } else {
            const statusCode = result.message.includes('tidak ditemukan') ? 404 : 400;
            res.status(statusCode).json({
                error: true,
                message: result.message
            });
        }

    } catch (error) {
        console.error('[controller] Error in edit_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat mengedit teks.",
            details: error.message
        });
    }
};

controllers.delete_running_text = async (req, res) => {
    try {
        const { id } = req.body;
        const idInt = parseInt(id, 10);

        console.log('[controller] delete_running_text called for ID:', idInt);

        const model_cud = new Model_cud();
        const result = await model_cud.delete_running_text(idInt);

        if (result.success) {
            res.status(200).json({
                error: false,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(404).json({
                error: true,
                message: result.message
            });
        }
    } catch (error) {
        console.error('[controller] Error in delete_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat menghapus data.",
            details: error.message
        });
    }
};

controllers.toggle_status_running_text = async (req, res) => {
    try {
        const { id } = req.body;
        const idInt = parseInt(id, 10);

        const model_cud = new Model_cud();
        const result = await model_cud.toggle_status(idInt);

        if (result.success) {
            res.status(200).json({
                error: false,
                message: "Status berhasil diubah.",
                data: result.data
            });
        } else {
            res.status(404).json({
                error: true,
                message: result.message
            });
        }
    } catch (error) {
        console.error('[controller] Error in toggle_status_running_text:', error);
        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat mengubah status.",
            details: error.message
        });
    }
};

controllers.update_order_running_text = async (req, res) => {
    console.log("=== CONTROLLER update_order_running_text START ===");

    try {
        const { order } = req.body;

        const model_cud = new Model_cud();
        const result = await model_cud.update_order(order);

        console.log("=== CONTROLLER SUCCESS ===");

        res.status(200).json({
            error: false,
            message: "Urutan berhasil diperbarui.",
            data: result
        });

    } catch (error) {
        console.error("=== CONTROLLER ERROR ===");
        console.error("Error message:", error.message);

        res.status(500).json({
            error: true,
            message: "Terjadi kesalahan saat memperbarui urutan.",
            details: error.message
        });
    }
};

module.exports = controllers;
