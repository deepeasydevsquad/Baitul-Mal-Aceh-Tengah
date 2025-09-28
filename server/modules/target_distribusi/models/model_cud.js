const { Asnaf, Target_distribusi, sequelize } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");

const { Op } = require("sequelize");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async add() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      // validasi minimal
      if (
        !body.tahun ||
        !body.targets ||
        !Array.isArray(body.targets) ||
        body.targets.length === 0
      ) {
        this.state = false;
        this.message = "Data target distribusi tidak valid";
        return;
      }

      // mapping data dari frontend
      const dataInsert = body.targets.map((t) => ({
        tahun: body.tahun, // tahun dikirim sekali dari frontend
        asnaf_id: t.asnaf_id,
        target_orang: t.target_orang || 0,
        target_rupiah: t.target_rupiah || 0,
        createdAt: myDate,
        updatedAt: myDate,
      }));

      // bulk insert
      const insert = await Target_distribusi.bulkCreate(dataInsert, {
        transaction: this.t,
      });

      this.state = true;
      this.message = `Berhasil menambahkan ${insert.length} target distribusi untuk tahun ${body.tahun}`;
    } catch (error) {
      console.error("Error in add method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async update() {
    await this.initialize();
    const body = this.req.body;

    console.log("_____________Ddddddddddddddddddddd____________");
    console.log(body);
    console.log("_____________Ddddddddddddddddddddd____________");
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      if (
        !body.tahun ||
        !body.targets ||
        !Array.isArray(body.targets) ||
        body.targets.length === 0
      ) {
        this.state = false;
        this.message = "Data target distribusi tidak valid";
        return;
      }

      // loop update per target
      for (const t of body.targets) {
        await Target_distribusi.update(
          {
            target_orang: t.target_orang,
            target_rupiah: t.target_rupiah,
            updatedAt: myDate,
          },
          {
            where: { tahun: body.tahun, asnaf_id: t.asnaf_id },
            transaction: this.t,
          }
        );
      }

      this.state = true;
      this.message = `Berhasil update ${body.targets.length} target distribusi untuk tahun ${body.tahun}`;
    } catch (error) {
      console.error("Error in update method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  // response
  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, {
        msg: this.message,
      });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
