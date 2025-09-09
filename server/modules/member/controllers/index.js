// const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

let refreshTokens = [];


controllers.login_member_process = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.getInfoMember(); // insert new visa
    const userPayload = { username : data.username, fullname : data.fullname };
    const access_token = jwt.sign(userPayload, process.env.MEMBERSHIP_SECRET_KEY, { expiresIn: "10s" });
    const refresh_token = jwt.sign(userPayload, process.env.MEMBERSHIP_REFRESH_SECRET_KEY, { expiresIn: "7d" });
    
    refreshTokens.push(refresh_token);

    res.status(200).json({
        access_token,
        refresh_token,
        error: false,
        message: "Proses login berhasil dilakukan.",
    });
  } catch (error) {
    handleServerError(res, error);
  }
};




// const body = req.body;
// const model_r = new Model_r(req);
// const data = await model_r.get_user_information();
// var error = false;
// var error_msg = '';

// console.log("======data");
// console.log(data);
// console.log("======data");

// if (Object.keys(data).length > 0) {

//   console.log("======Password");
//   console.log(body.password);
//   console.log(data.password);
//   console.log("======Password");

//   const valid_password = await bcrypt.compare(body.password, data.password);
//   if (!valid_password) {
//     return res.status(400).json({
//       error: true,
//       error_msg: "Username atau Password anda tidak valid.",
//     });
//   }

//   const userPayload = {
//     company_code: data.company_code,
//     type: body.type,
//     ...(body.type === "staff" && { division_id: data.division_id }),
//     ...(body.type === 'staff' ? { nomor_whatsapp: body.nomor_whatsapp} : { username : body.username })
//   };

//   if( data.type_subscribtion == 'limited') {
//     const endDate = moment(data.end_subscribtion);
//     const now = moment();
//     if (endDate.isBefore(now, 'day')) {
//       error = true;
//       error_msg = "Masa Berlangganan Anda Sudah Berakhir. Silahkan Hubungi Administrator.";
//     }
//   }
    
//   if( error == false ) {
//     const accessToken = jwt.sign(userPayload, process.env.SECRET_KEY, { expiresIn: "10s" });
//     const refreshToken = jwt.sign(userPayload, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });

//     refreshTokens.push(refreshToken);

//     res.status(200).json({
//       access_token: accessToken,
//       refresh_token: refreshToken,
//       error: false,
//       error_msg: "Sukses.",
//     });
//   }
// } else {
//   error = true;
//   error_msg = "Username atau Password anda tidak ditemukan di pangkalan data.";
// }

// if( error ) {
//   res.status(400).json({
//     error: true,
//     error_msg: error_msg,
//   });
// }
// else{
//   res.status(200).json({
//     error: false,
//     error_msg: "Login berhasil dilakukan.",
//   });
// }

// controllers.user = async (req, res) => {
//   try {
//     const model_r = new Model_r(req);
//     const data = await model_r.get_menu_submenu_tab();

//     res.status(200).json({
//       error: false,
//       error_msg: "Data Berhasil Ditemukan.",
    
//       menu_info: data.menu_info,
//       user_info: data.user_info,
//     });
//   } catch (error) {
//     handleServerError(res, error);
//   }
// };

// controllers.refreshToken = async (req, res) => {
//   const { refresh_token } = req.body;

//   if (!refresh_token) {
//     return res.status(401).json({ error: true, error_msg: "Token diperlukan" });
//   }

//   // Optional: validasi kalau token memang tersimpan
//   if (!refreshTokens.includes(refresh_token)) {
//     return res.status(403).json({ error: true, error_msg: "Token tidak dikenali" });
//   }

//   jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: true, error_msg: "Token kadaluarsa atau tidak valid" });
//     }

//     const { exp, iat, ...cleanUser } = user;

//     const accessToken = jwt.sign(cleanUser, process.env.SECRET_KEY, { expiresIn: "15m" });

//     res.status(200).json({
//       access_token: accessToken,
//       error: false,
//       error_msg: "Token baru berhasil dibuat",
//     });
//   });
// };

module.exports = controllers;
