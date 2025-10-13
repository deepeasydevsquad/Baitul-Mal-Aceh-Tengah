const { Op, Setting } = require("../../../models");
const axios = require("axios");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async get_start() {
    const settingsArray = await Setting.findAll({
      where: {
        name: { [Op.in]: ["api_key", "device_key", "whatsapp_number"] },
      },
      attributes: ["name", "value"],
    });

    const settings = {};
    settingsArray.forEach((s) => (settings[s.name] = s.value));

    if (!settings.api_key || !settings.device_key) {
      throw new Error("api_key / device_key belum ada di database");
    }

    try {
      const url = "https://wapisender.id/api/v5/device/start";
      const response = await axios.post(
        url,
        {
          api_key: settings.api_key,
          device_key: settings.device_key,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = response.data;
      console.log("Start Device Response:", result);

      if (result?.data?.todo === "scan") {
        const qr_url = `https://wapisender.id/api/v5/device/qr?api_key=${settings.api_key}&device_key=${settings.device_key}`;
        return {
          status: result.status,
          message: result.message,
          todo: "scan",
          qr_url,
        };
      }

      return {
        status: result.status,
        message: result.message,
        todo: "connected",
      };
    } catch (error) {
      console.error(
        "Error start device:",
        error?.response?.data || error.message
      );
      throw new Error("Gagal mengaktifkan perangkat WhatsApp");
    }
  }

  async get_konfigurasi() {
    await this.initialize();
    const data = await Setting.findAll({
      where: {
        name: { [Op.in]: ["api_key", "device_key", "whatsapp_number"] },
      },
      attributes: ["name", "value"],
    });
    return {
      data: data.map((e) => ({
        name: e.name,
        value: e.value,
      })),
    };
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

      const qr_url = `https://wapisender.id/api/v5/device/qr?api_key=${settings["api_key"]}&device_key=${settings["device_key"]}`;

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

      let vr = {
        device_key: settings["device_key"] || null,
        whatsapp_number: settings["whatsapp_number"] || null,
      };

      if (wapisenderResponse.data.status == "ok") {
        return {
          ...vr,
          ...{
            ["status"]: wapisenderResponse.data.status || null,
            ["created_at"]: wapisenderResponse.data.created_at || null,
            ["expired_at"]: wapisenderResponse.data.expired_at || null,
            ["qr_url"]: qr_url,
          },
        };
      } else {
        return {
          ...vr,
          ...{
            ["status"]: wapisenderResponse.data.status,
            ["created_at"]: wapisenderResponse.data.created_at,
            ["expired_at"]: wapisenderResponse.data.expired_at,
            ["qr_url"]: qr_url,
          },
        };
      }
    } catch (error) {
      console.error("Error fetching data settings:", error);
      return {};
    }
  }
}

module.exports = Model_r;
