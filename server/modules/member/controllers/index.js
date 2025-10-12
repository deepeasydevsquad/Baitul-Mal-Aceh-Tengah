const jwt = require("jsonwebtoken");
const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");
const controllers = {};
let refreshTokens = [];

controllers.login_member_process = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model = new Model_r(req);
    const data = await model.getInfoMember(); // insert new visa
    const userPayload = { username: data.username, fullname: data.fullname };
    const access_token = jwt.sign(
      userPayload,
      process.env.MEMBERSHIP_SECRET_KEY,
      { expiresIn: "10m" }
    );
    const refresh_token = jwt.sign(
      userPayload,
      process.env.MEMBERSHIP_REFRESH_SECRET_KEY,
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
    process.env.MEMBERSHIP_REFRESH_SECRET_KEY,
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
        process.env.MEMBERSHIP_SECRET_KEY,
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


controllers.get_info_edit_profile_member = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;
  try {
    const model_r = new Model_r(req);
    const data = await model_r.get_profile_member();
    res.status(200).json({
      error: false,
      message: "Data Berhasil Ditemukan.",
      data: data,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};


controllers.edit_profile_member = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_profile_member();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Member Profile berhasil diperbaharui.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Member Profile gagal diperbaharui.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
