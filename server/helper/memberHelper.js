const { where } = require("sequelize");
const { Member } = require("../models"); // Sesuaikan dengan model Company
const jwt = require("jsonwebtoken");

const memberHelper = {};

memberHelper.get_member_id = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const username = decoded.username;
    console.log("====================");
    console.log("username:", username);
    console.log("====================");

    const member = await Member.findOne({
      where: {
        username: username,
      },
      attributes: ["id"],
    });
    console.log("====================");
    console.log("member:", member.id);
    console.log("====================");

    return member ? member.id : null;
  } catch (error) {
    throw error;
  }
};

module.exports = memberHelper;
