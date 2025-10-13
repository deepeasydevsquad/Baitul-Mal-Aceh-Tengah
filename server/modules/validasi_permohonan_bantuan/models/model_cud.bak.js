const {
  sequelize,
  Bank,
  Realisasi_permohonan,
  Permohonan,
  Syarat_kegiatan,
  Validasi_syarat_permohonan,
} = require("../../../models");
const Model_r = require("./model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async edit_file() {
    await this.initialize();
    const body = this.req.body;
    const file = this.req.body.file; // Dari multer

    try {
      // Cari data validasi syarat
      const dataValidasi = await Validasi_syarat_permohonan.findOne({
        where: {
          realisasi_permohonan_id: body.id,
          id: body.validasi_id,
        },
      });

      // Hapus file lama
      if (dataValidasi.path) {
        const oldFilePath = path.join(
          __dirname,
          "../../../uploads/dokumen/permohonan_bantuan/",
          dataValidasi.path
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update dengan file baru
      await dataValidasi.update(
        {
          file_name: file.basename,
          path: file.path, // atau file URL
          status: "process", // Reset status jadi process lagi
          alasan_penolakan: null, // Reset alasan penolakan
          updatedAt: new Date(),
        },
        { transaction: this.t }
      );

      this.message = `Memperbarui file syarat permohonan dengan ID Permohonan: ${body.id}`;
    } catch (error) {
      this.state = false;
      console.error("Error editing file:", error);
    }
  }

  async approve_berkas() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      await Validasi_syarat_permohonan.update(
        {
          status: "approve",
          updatedAt: new Date(),
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Menyetujui Berkas Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id}`;
    } catch (error) {
      this.state = false;
      console.error("Error editing file:", error);
    }
  }

  async approve_permohonan() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      await Realisasi_permohonan.update(
        {
          status: "approve",
          updatedAt: new Date(),
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Menyetujui Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id}`;
    } catch (error) {
      this.state = false;
      console.error("Error editing file:", error);
    }
  }

  async reject_permohonan() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      await Realisasi_permohonan.update(
        {
          status: "reject",
          alasan_penolakan: body.alasan_penolakan,
          updatedAt: new Date(),
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Menolak Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id} dan Alasan Penolakan: ${body.alasan_penolakan}`;
    } catch (error) {
      this.state = false;
      console.error("Error editing file:", error);
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
