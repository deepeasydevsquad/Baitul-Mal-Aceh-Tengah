const { sequelize, Riwayat_pengumpulan, Member } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async add(invoice) {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const insert = await Riwayat_pengumpulan.add(
        {
          member_id: body.member_id,
          invoice: body.invoice,
          tipe: body.tipe,
          nominal: body.nominal,
          kode: 500000,
          status: body.status,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Riwayat_pengumpulan Baru dengan Invoice Riwayat_pengumpulan: ${body.name} dan ID Riwayat_pengumpulan: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }


  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const Riwayat_pengumpulan = await model_r.Riwayat_pengumpulan(body.id);

      await Riwayat_pengumpulan.destroy({
        where: { id: body.id },
        transaction: this.t,
      });

      this.message = `Menghapus Riwayat_pengumpulan dengan Nama Riwayat_pengumpulan: ${Riwayat_pengumpulan.name} dan ID Riwayat_pengumpulan: ${Riwayat_pengumpulan.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  response
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
