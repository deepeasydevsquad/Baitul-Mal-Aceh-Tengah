const {
  Op,
  Kegiatan,
  Syarat,
  Surveyor,
  Syarat_kegiatan,
  Kriteria,
  Surveyor_kegiatan,
} = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async daftar_syarat() {
    const data = await Syarat.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    return {
      success: true,
      data: data,
      message: "Data berhasil diambil",
    };
  }

  async detail_syarat() {
    const body = this.req.body;
    const data = await Syarat_kegiatan.findAll({
      where: { kegiatan_id: body.kegiatan_id },
      include: [
        {
          model: Syarat,
          attributes: ["id", "name"],
        },
      ],
    });

    const hasil = data.map((item) => ({
      id: item.Syarat.id,
      name: item.Syarat.name,
    }));

    return {
      success: true,
      data: hasil,
      message: "Data berhasil diambil",
    };
  }

  async detail_kriteria() {
    const body = this.req.body;
    const data = await Kriteria.findAll({
      where: { kegiatan_id: body.kegiatan_id },
    });

    return {
      success: true,
      data: data,
      message: "Data berhasil diambil",
    };
  }

  async daftar_surveyor() {
    const data = await Surveyor.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    return {
      success: true,
      data: data,
      message: "Data berhasil diambil",
    };
  }

  async detail_surveyor() {
    const body = this.req.body;
    const data = await Surveyor_kegiatan.findAll({
      where: { kegiatan_id: body.kegiatan_id },
      include: [
        {
          model: Surveyor,
          attributes: ["id", "name"],
        },
        {
          model: Kegiatan,
          attributes: ["id", "nama_kegiatan"],
        },
      ],
    });

    const hasil = data.map((item) => ({
      id: item.Surveyor.id,
      name: item.Surveyor.name,
      kegiatan: item.Kegiatan.nama_kegiatan,
    }));

    return {
      success: true,
      data: hasil,
      message: "Data berhasil diambil",
    };
  }
}
module.exports = Model_r;
