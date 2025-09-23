const { Op, Setting } = require("../../../models");
const axios = require("axios");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async get_info_pengaturan_whatsapp() {
    const mappingKey = ["api_key", "device_key", "whatsapp_number"];

    try {
      const where = {
        name: {
          [Op.in]: mappingKey,
        },
      };

      const result = await Setting.findAll({
        where,
        attributes: ["id", "name", "value"],
      });

      // ubah array jadi object key-value
      const settings = result.reduce((acc, row) => {
        acc[row.name] = row.value;
        return acc;
      }, {});

      // cek hasil mapping
      console.log(settings);
      // output: { api_key: "xxx", device_key: "yyy", ... }

      // panggil API Wapisender
      const wapisenderResponse = await axios.post(
        "https://wapisender.id/api/v5/device/info",
        {
          api_key: settings["api_key"],
          device_key: settings["device_key"],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        device_key: settings["device_key"] || null,
        whatsapp_number: settings["whatsapp_number"] || null,
        status: wapisenderResponse.data.data.status || null,
        created_at: wapisenderResponse.data.data.created_at || null,
        expired_at: wapisenderResponse.data.data.expired_at || null,
      };
    } catch (error) {
      console.error("Error fetching data settings:", error);
      return {};
    }
  }
}

module.exports = Model_r;
