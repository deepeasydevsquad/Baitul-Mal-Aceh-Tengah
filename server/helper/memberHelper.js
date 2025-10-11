const { Member } = require("../models");
const jwt = require("jsonwebtoken");

const memberHelper = {};

memberHelper.get_member_id = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.username) return null;

    const username = decoded.username;

    const member = await Member.findOne({
      where: { username },
      attributes: ["id"],
      raw: true, // ✅ tambahkan ini
    });

    // ✅ pastikan return angka murni
    return member ? member.id : null;
  } catch (error) {
    console.error("Error get_member_id:", error);
    return null;
  }
};

module.exports = memberHelper;
