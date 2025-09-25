const {
  sequelize,
  Riwayat_pengumpulan
} = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");

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
      console.log(body);
      const insert = await Riwayat_pengumpulan.create(
        {
          member_id: body.member_id,
          invoice: invoice,
          tipe: "infaq",
          nominal: body.nominal,
          kode: "000",
          konfirmasi_pembayaran: body.status_pemasukan,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );

      this.message = `Menambahkan Riwayat Infaq Baru dengan Invoice Riwayat Infaq: ${body.name} dan ID Riwayat Infaq: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_riwayat_infaq = await model_r.info_riwayat_infaq(body.id);

      await Riwayat_pengumpulan.destroy({
        where: {
          id: body.id,
        },
        transaction: this.t,
      });

      this.message = `Menghapus Riwayat Infaq dengan Nama Riwayat Infaq: ${info_riwayat_infaq.member_name} dan ID Riwayat Infaq: ${info_riwayat_infaq.id}`;
    } catch (error) {
      this.state = false;
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
