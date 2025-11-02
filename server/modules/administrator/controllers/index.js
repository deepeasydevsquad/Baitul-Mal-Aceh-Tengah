const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");
const controllers = {};
let refreshTokens = [];

controllers.login_administrator_process = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model = new Model_r(req);
    const data = await model.getInfoUser(); // insert new visa
    const userPayload = {
      id: data.id,
      username: data.username,
      name: data.name,
      jabatan: data.jabatan,
    };
    const access_token = jwt.sign(
      userPayload,
      process.env.ADMINISTRATOR_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const refresh_token = jwt.sign(
      userPayload,
      process.env.ADMINISTRATOR_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

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

controllers.logout_administrator_process = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ error: true, error_msg: "Token diperlukan" });
  }
  if (!refreshTokens.includes(refresh_token)) {
    return res
      .status(403)
      .json({ error: true, error_msg: "Token tidak dikenali" });
  }
  refreshTokens = refreshTokens.filter((token) => token !== refresh_token);
  res
    .status(200)
    .json({ error: false, error_msg: "Logout berhasil dilakukan" });
};

controllers.administrator = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const data = await model_r.get_menu_submenu_tab();
    res.status(200).json({
      error: false,
      message: "Data Berhasil Ditemukan.",
      menu_info: data.menu_info,
      user_info: data.user_info,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ error: true, error_msg: "Token diperlukan" });
  }
  if (!refreshTokens.includes(refresh_token)) {
    return res
      .status(403)
      .json({ error: true, error_msg: "Token tidak dikenali" });
  }
  jwt.verify(
    refresh_token,
    process.env.ADMINISTRATOR_REFRESH_SECRET_KEY,
    (err, user) => {
      if (err) {
        return res.status(403).json({
          error: true,
          error_msg: "Token kadaluarsa atau tidak valid",
        });
      }
      const { exp, iat, ...cleanUser } = user;
      const accessToken = jwt.sign(
        cleanUser,
        process.env.ADMINISTRATOR_SECRET_KEY,
        { expiresIn: "5m" }
      );
      res.status(200).json({
        access_token: accessToken,
        error: false,
        error_msg: "Token baru berhasil dibuat",
      });
    }
  );
};

controllers.edit_profile = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_profile();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Profile berhasil diperbaharui.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Profile gagal diperbaharui.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_info_edit_profile = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_r = new Model_r(req);
    const data = await model_r.get_info_edit_profile();
    res.status(200).json({
      error: false,
      message: "Data Berhasil Ditemukan.",
      data: data,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
