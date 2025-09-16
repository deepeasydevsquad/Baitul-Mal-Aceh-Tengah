const { Op, Setting } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    //
  }

  async get_info_pengaturan_umum() {
    const mappingKey = [
      "icon",
      "logo",
      "hero_logo",
      "nama_kabupaten_kota",
      "alamat",
      "quote",
      "nama_jabatan1",
      "nama_jabatan2",
      "nama_jabatan3",
      "nama_pejabat1",
      "nama_pejabat2",
      "nama_pejabat3",
    ];

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

      console.log("Result:", result);

      const settings = {};
      result.forEach((item) => {
        settings[item.name] = item.value;
      });

      return settings;
    } catch (error) {
      console.error("Error fetching data settings:", error);
      return {};
    }
  }
}

module.exports = Model_r;
