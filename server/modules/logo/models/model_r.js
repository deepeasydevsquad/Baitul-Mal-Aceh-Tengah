const { Setting, sequelize, Op } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
    this.state = false;
    this.message = null;
  }

  async logo() {
    try {
      const data = await Setting.findOne({
        where: { name: "logo" },
        attributes: ["value"],
      });

      if (!data) {
        this.state = false;
        this.message = "Logo tidak ditemukan";
        return null;
      }

      this.state = true;
      this.message = "Logo berhasil diambil";
      return data.value; // return cuma nilai logo-nya
    } catch (err) {
      this.state = false;
      this.message = err.message;
      return null;
    }
  }
}

module.exports = Model_r;
