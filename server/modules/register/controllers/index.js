const Model_cud = require("../models/model_cud");
const Model_r = require("../models/model_r");
const {
    handleServerError,
    handleValidationErrors,
} = require("../../../helper/handleError");

exports.register = async (req, res) => {
    // filter error
    if (!(await handleValidationErrors(req, res))) return;

    try {
        const model = new Model_cud(req);
        await model.register();

        if (await model.response()) {
            res.status(200).json({
                message:
                    model.message ||
                    "Registrasi Berhasil, Menunggu Persetujuan Admin",
                status: "success",
            });
        } else {
            res.status(400).json({
                message: model.message || "Gagal melakukan Registrasi",
                status: "failed",
            });
        }
    } catch (error) {
        console.error("Terjadi error saat Regisrasi Fee:", error);
        handleServerError(res, error);
    }
};

exports.list_desa = async (req, res) => {
    console.log("controller item");
    try {
        const model = new Model_r(req);
        const data = await model.daftar_desa();
        return res.status(200).json(data); // pake return
    } catch (error) {
        console.error("_____DDDDD_______");
        console.error(error);
        console.error("_____DDDDD_______");
        return handleServerError(res, error); // kasih full error object
    }
};

exports.list_kecamatan = async (req, res) => {
    console.log("controller item");
    try {
        const model = new Model_r(req);
        const data = await model.daftar_kecamatan();
        return res.status(200).json(data); // pake return
    } catch (error) {
        console.error("_____DDDDD_______");
        console.error(error);
        console.error("_____DDDDD_______");
        return handleServerError(res, error); // kasih full error object
    }
};

