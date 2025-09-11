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

module.exports = controllers;
