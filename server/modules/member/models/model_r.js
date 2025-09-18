"use strict";

const { Member } = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getInfoMember() {
    try {
        var q = await Member.findOne({
            where: { username : this.req.body.username }, 
        });
        return { username: q.username, fullname: q.fullname };
    } catch (error) {
        return {}
    }
  }
}

module.exports = Model_r;
