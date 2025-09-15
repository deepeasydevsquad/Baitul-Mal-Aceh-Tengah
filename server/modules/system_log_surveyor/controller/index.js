const Model_r = require("../models/model_r");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.daftar_surveyor = async (req, res) => {
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model_r = new Model_r(req);
        const feedBack = await model_r.daftar_surveyor();

        res.status(200).json({
            error: false,
            data: feedBack.data,
            total: feedBack.total,
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

module.exports = controllers;
