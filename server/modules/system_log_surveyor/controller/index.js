const Model_r = require("../models/model_r");
const {
    handleValidationErrors,
    handleServerError,
} = require("../../../helper/handleError");

// list agen
exports.list = async (req, res) => {
    console.log("controller item");
    try {
        const model = new Model_r(req);
        const data = await model.system_log_surveyor();
        return res.status(200).json(data); // pake return
    } catch (error) {
        console.error("DDDDD");
        console.error(error);
        console.error("DDDDD");
        return handleServerError(res, error); // kasih full error object
    }
};


