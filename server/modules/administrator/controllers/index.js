// const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const { handleValidationErrors, handleServerError } = require("../../../helper/handleError");

const controllers = {};

let refreshTokens = [];


controllers.login_administrator_process = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.getInfoUser(); // insert new visa
    const userPayload = { id: data.id, username : data.username, name : data.name };

    console.log('-----Payload-----');
    console.log(userPayload);
    console.log('-----Payload-----');

    const access_token = jwt.sign(userPayload, process.env.ADMINISTRATOR_SECRET_KEY, { expiresIn: "1000s" });
    const refresh_token = jwt.sign(userPayload, process.env.ADMINISTRATOR_REFRESH_SECRET_KEY, { expiresIn: "7d" });
    
    refreshTokens.push(refresh_token);

    res.status(200).json({
        access_token,
        refresh_token,
        error: false,
        message: "Proses login berhasil dilakukan.",
    });
  } catch (error) {
    console.log("----------");
    console.log(error);
    console.log("----------");
    handleServerError(res, error);
  }
};


controllers.administrator = async (req, res) => {
    try {
    const model_r = new Model_r(req);
    const data = await model_r.get_menu_submenu_tab();

    console.log("DDDDD");
    console.log(data);
    console.log("DDDDD");

    res.status(200).json({
      error: false,
      message: "Data Berhasil Ditemukan.",
      menu_info: data.menu_info,
      user_info: data.user_info,
    });
  } catch (error) {

    console.log("**************qqq");
    console.log(error);
    console.log("**************qqq");
    handleServerError(res, error);
  }
}

module.exports = controllers;
