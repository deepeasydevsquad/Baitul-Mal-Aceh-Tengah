const {
  sequelize,
  Surveyor_kegiatan,
  Syarat_kegiatan,
  Kriteria,
} = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");
const crypto = require("crypto");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  // generate access_code random 200 char
  async access_code() {
    const length = 200;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = crypto.randomBytes(length);
    let out = "";
    for (let i = 0; i < length; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  }

  // =============================
  // Syarat
  // =============================
  async editSyarat() {
    const body = this.req.body; // array of syarat baru
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("body:", body);

    try {
      if (!Array.isArray(body) || body.length === 0) {
        throw new Error("Data syarat tidak boleh kosong");
      }

      // ambil kegiatan_id dari item pertama
      const kegiatanId = body[0].kegiatan_id;

      // 1. Hapus semua syarat lama untuk kegiatan_id ini
      await Syarat_kegiatan.destroy({
        where: { kegiatan_id: kegiatanId },
        transaction: this.t,
      });

      // 2. Insert ulang syarat baru
      const payload = body.map((item) => ({
        kegiatan_id: kegiatanId,
        syarat_id: item.syarat_id,
        createdAt: myDate,
        updatedAt: myDate,
      }));

      const insert = await Syarat_kegiatan.bulkCreate(payload, {
        transaction: this.t,
      });

      this.message = `Syarat kegiatan dengan kegiatan_id ${kegiatanId} berhasil diperbarui (${insert.length} syarat baru).`;
      return insert;
    } catch (error) {
      console.error("Error in editSyarat:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  // =============================
  // Kriteria
  // =============================
  async editKriteria() {
    const body = this.req.body; // array of kriteria baru
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    await this.initialize();

    try {
      if (!Array.isArray(body) || body.length === 0) {
        throw new Error("Data kriteria tidak boleh kosong");
      }

      // ambil kegiatan_id dari item pertama
      const kegiatanId = body[0].kegiatan_id;

      // 1. Hapus semua kriteria lama
      await Kriteria.destroy({
        where: { kegiatan_id: kegiatanId },
        transaction: this.t,
      });

      // 2. Insert ulang kriteria baru
      const payload = body.map((item) => ({
        kegiatan_id: kegiatanId,
        name: item.name,
        createdAt: myDate,
        updatedAt: myDate,
      }));

      const insert = await Kriteria.bulkCreate(payload, {
        transaction: this.t,
      });

      this.message = `Kriteria kegiatan dengan kegiatan_id ${kegiatanId} berhasil diperbarui (${insert.length} kriteria baru).`;
      return insert;
    } catch (error) {
      console.error("Error in editKriteria:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async addSurveyor() {
    const body = this.req.body;
    const file = this.req.file; // misal pake multer untuk handle upload
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("body:", body);
    console.log("file:", file);

    await this.initialize();

    try {
      // validasi
      if (!body || !body.surveyor) {
        throw new Error("Data surveyor tidak boleh kosong");
      }

      // konversi surveyor ke array kalo masih string (FormData biasanya string)
      let surveyorArray = body.surveyor;
      if (typeof body.surveyor === "string") {
        surveyorArray = JSON.parse(body.surveyor);
      }

      if (!Array.isArray(surveyorArray) || surveyorArray.length === 0) {
        throw new Error("Data surveyor tidak boleh kosong");
      }

      const kegiatanId = body.kegiatan_id;
      const skFileName = file ? file.filename : body.sk; // ambil nama file dari upload

      // hapus surveyor lama
      await Surveyor_kegiatan.destroy({
        where: { kegiatan_id: kegiatanId },
        transaction: this.t,
      });

      // insert surveyor baru
      const payload = await Promise.all(
        surveyorArray.map(async (item) => ({
          kegiatan_id: kegiatanId,
          sk: skFileName,
          surveyor_id: item.surveyor_id,
          status: "active",
          access_code: await this.access_code(),
          createdAt: myDate,
          updatedAt: myDate,
        }))
      );

      const insert = await Surveyor_kegiatan.bulkCreate(payload, {
        transaction: this.t,
      });

      this.message = `Surveyor kegiatan dengan kegiatan_id ${kegiatanId} berhasil diperbarui (${insert.length} surveyor baru).`;
      return insert;
    } catch (error) {
      console.error("Error in addSurveyor:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  // =============================
  // Response handler
  // =============================
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
