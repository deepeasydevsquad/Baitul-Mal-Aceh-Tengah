// const express = require("express");
// const { body } = require("express-validator");
// const controllers = require("../modules/kecamatan/controllers/index");
// const validation = require("../validation/kecamatan");
// const {
//     authenticateTokenAdministrator,
// } = require("../middleware/authenticateToken");
// const router = express.Router();

// router.post(
//     "/kecamatan/list",
//     authenticateTokenAdministrator,
//     [
//         body("perpage")
//             .notEmpty()
//             .withMessage("Perpage Tidak Boleh Kosong")
//             .isInt()
//             .withMessage("Perpage Harus Angka"),
//         body("pageNumber")
//             .notEmpty()
//             .withMessage("Page Number Tidak Boleh Kosong")
//             .isInt()
//             .withMessage("Page Number Harus Angka"),
//         body("search").optional().isString().withMessage("Search Harus String"),
//     ],
//     controllers.daftar_kecamatan
// );

// router.post(
//   "/kecamatan/add",
//   authenticateTokenAdministrator,
//   [
//     body("kode")
//       .notEmpty().withMessage("Kode Tidak Boleh Kosong")
//       .isString().withMessage("Kode Harus String"),
//     //   .custom(validation.check_kode_kecamatan),
//     body("name")
//       .notEmpty().withMessage("Name Tidak Boleh Kosong")
//       .isString().withMessage("Name Harus String")
//     //   .custom(validation.check_nama_kecamatan),
//   ],
//   controllers.add
// );


// // router.post(
// //     "/kecamatan/delete",
// //     authenticateTokenAdministrator,
// //     [
// //         body("id")
// //             .notEmpty()
// //             .withMessage("ID Tidak Boleh Kosong")
// //             .isInt()
// //             .withMessage("ID Harus Angka")
// //             .custom(validation.check_id_kecamatan),
// //     ],
// //     controllers.delete
// // );

// router.post("/kecamatan/delete", async (req, res) => {
//   try {
//     const model = new Model_cud(req);
//     await model.deleteKecamatan();   // method hapus di model_cud
//     res.json({ success: true, message: "Kecamatan berhasil dihapus" });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/kecamatan/controllers/index");
const validation = require("../validation/kecamatan");
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
    "/kecamatan/list",
    authenticateTokenAdministrator,
    [
        body("perpage")
            .notEmpty()
            .withMessage("Perpage Tidak Boleh Kosong")
            .isInt()
            .withMessage("Perpage Harus Angka"),
        body("pageNumber")
            .notEmpty()
            .withMessage("Page Number Tidak Boleh Kosong")
            .isInt()
            .withMessage("Page Number Harus Angka"),
        body("search").optional().isString().withMessage("Search Harus String"),
    ],
    controllers.daftar_kecamatan
);

router.post(
    "/kecamatan/add",
    authenticateTokenAdministrator,
    [
        body("kode")
            .notEmpty().withMessage("Kode Tidak Boleh Kosong")
            .isString().withMessage("Kode Harus String"),
        body("name")
            .notEmpty().withMessage("Name Tidak Boleh Kosong")
            .isString().withMessage("Name Harus String")
    ],
    controllers.add
);

router.post(
    "/kecamatan/edit",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty().withMessage("ID Tidak Boleh Kosong")
            .isInt().withMessage("ID Harus Angka"),
        body("kode")
            .notEmpty().withMessage("Kode Tidak Boleh Kosong")
            .isString().withMessage("Kode Harus String"),
        body("name")
            .notEmpty().withMessage("Name Tidak Boleh Kosong")
            .isString().withMessage("Name Harus String")
    ],
    controllers.edit
);

router.post(
    "/kecamatan/delete",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID Harus Angka")
    ],
    controllers.delete
);

router.post(

    '/kecamatan/get_info_edit_kecamatan',
    
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID Harus Angka")
    ],
    controllers.get_info_edit_kecamatan
);

module.exports = router;