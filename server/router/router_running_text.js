const express = require("express");
const { body, validationResult } = require("express-validator");
const controllers = require("../modules/running_text/controllers/index");
const runningTextValidation = require("../validation/running_text");
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors found in router:", errors.array());
        return res.status(400).json({
            error: true,
            message: "Data tidak valid",
            errors: errors.array()
        });
    }
    next();
};

const customValidation = (validationFunction) => {
    return async (req, res, next) => {
        try {
            const fieldName = validationFunction.name.replace('validation_', '');
            let value;
            
            // Tentukan value berdasarkan jenis validasi
            if (validationFunction === runningTextValidation.content) {
                value = req.body.content;
            } else if (validationFunction === runningTextValidation.content_unique) {
                value = req.body.content;
            } else if (validationFunction === runningTextValidation.id_exists) {
                value = req.body.id;
            } else if (validationFunction === runningTextValidation.order_array) {
                value = req.body.order;
            } else if (validationFunction === runningTextValidation.ids_array) {
                value = req.body.ids;
            } else if (validationFunction === runningTextValidation.search_query) {
                value = req.body.search;
            }
            
            await validationFunction(value, { req });
            next();
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: error.message
            });
        }
    };
};


router.post(
    "/running_text/list",
    authenticateTokenAdministrator,
    [
        body("search").optional(),
        body("perpage").optional().isInt({ min: 1, max: 1000 }).withMessage("Per page harus integer 1-1000"),
        body("pageNumber").optional().isInt({ min: 1 }).withMessage("Page number harus integer positif"),
        body("activeOnly").optional().isBoolean().withMessage("ActiveOnly harus boolean")
    ],
    handleValidation,
    customValidation(runningTextValidation.search_query),
    controllers.running_text
);

router.get(
    "/running_text/get_info_add",
    authenticateTokenAdministrator,
    controllers.get_info_add_running_text
);

router.post(
    "/running_text/add",
    authenticateTokenAdministrator,
    [
        body("content").notEmpty().withMessage("Content tidak boleh kosong"),
    ],
    handleValidation,
    customValidation(runningTextValidation.content),
    customValidation(runningTextValidation.content_unique),
    controllers.add_running_text
);

router.post(
    "/running_text/get_info_edit",
    authenticateTokenAdministrator,
    [
        body("id").notEmpty().withMessage("ID tidak boleh kosong"),
    ],
    handleValidation,
    customValidation(runningTextValidation.id_exists),
    controllers.get_info_edit_running_text
);

router.post(
    "/running_text/edit",
    authenticateTokenAdministrator,
    [
        body("id").notEmpty().withMessage("ID tidak boleh kosong"),
        body("content").notEmpty().withMessage("Content tidak boleh kosong"),
    ],
    handleValidation,
    customValidation(runningTextValidation.id_exists),
    customValidation(runningTextValidation.content),
    customValidation(runningTextValidation.content_unique),
    controllers.edit_running_text
);

router.post(
    "/running_text/delete",
    authenticateTokenAdministrator,
    [
        body("id").notEmpty().withMessage("ID tidak boleh kosong"),
    ],
    handleValidation,
    customValidation(runningTextValidation.id_exists),
    controllers.delete_running_text
);

router.post(
    "/running_text/toggle",
    authenticateTokenAdministrator,
    [
        body("id").notEmpty().withMessage("ID tidak boleh kosong"),
    ],
    handleValidation,
    customValidation(runningTextValidation.id_exists),
    controllers.toggle_status_running_text
);

router.post(
    "/running_text/update-order",
    authenticateTokenAdministrator,
    [
        body('order').isArray({ min: 1 }).withMessage('Order harus berupa array dan tidak boleh kosong'),
    ],
    handleValidation,
    customValidation(runningTextValidation.order_array),
    controllers.update_order_running_text
);

module.exports = router;