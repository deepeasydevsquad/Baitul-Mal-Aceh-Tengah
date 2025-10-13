const {
  Op,
  Setting,
  Whatsapp_template,
  Whatsapp_message,
} = require("../../../models");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  // ambil data untuk template pesan
  async jenis_pesan() {
    try {
      // ambil nomor asal
      const jenisPesan = await Whatsapp_message.findAll({
        attributes: ["name", "message"],
      });
      console.log(jenisPesan);
    } catch (error) {
      console.error("Error fetching Whatsapp_template data:", error);
      return {
        jenis_pesan: ["name", "message"],
      };
    }
  }

  async get_template_pesan_whatsapp() {
    try {
      let data = [];
      // ambil nomor asal
      await Whatsapp_template.findAll({
        where: { type: this.req.body.type },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            data.push({ id: e.id, name: e.name });
          })
        );
      });
      return data;
    } catch (error) {
      console.error("Error fetching Whatsapp_template data:", error);
      return {};
    }
  }

  async get_pesan_template_pesan_whatsapp() {
    try {
      var q = await Whatsapp_template.findOne({
        where: {
          id: this.req.body.template_id,
        },
      });
      return q.message;
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  }

  // ambil data untuk Jenis pesan, status dan tanggal pengiriman
  async list() {
    const body = this.req.body;
    const limit = parseInt(body.perpage, 10) || 10;
    const page =
      body.pageNumber && body.pageNumber !== "0"
        ? parseInt(body.pageNumber, 10)
        : 1;
    console.log(body.search);
    const where = body.search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${body.search}%` } }],
        }
      : {};

    try {
      // ambil info pesan whatsapp
      const whatsapp_message = await Whatsapp_message.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        attributes: [
          "id",
          "sender_number",
          "destination_number",
          "message",
          "updatedAt",
          "status",
          "type",
        ],
        where,
      });

      return {
        data: whatsapp_message.rows.map((e) => ({
          id: e.id,
          sender_number: e.sender_number,
          destination_number: e.destination_number,
          message: e.message,
          status: e.status,
          type: e.type,
          updatedAt: moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        })),
        total: whatsapp_message.count,
      };
    } catch (error) {
      console.error("Error fetching Whatsapp_message data:", error);
      return { data: [], total: 0 };
    }
  }
}

module.exports = Model_r;
