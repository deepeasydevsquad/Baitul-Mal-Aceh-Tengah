const {
  sequelize,
  Op,
  Kegiatan,
  Desa_area_kegiatan,
  Kecamatan_area_kegiatan,
  Asnaf,
  Program,
  Realisasi_permohonan,
  Permohonan,
} = require("../../../models");
const Model_r = require("../models/model_r");
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

  async add(result_kode, result_slug) {
    await this.initialize();
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("_____________Ddddddddddddddddddddd____________");
    console.log(body);
    console.log("_____________Ddddddddddddddddddddd____________");

    try {
      const insert = await Kegiatan.create(
        {
          asnaf_id: body.asnaf_id,
          program_id: body.program_id,
          kode: result_kode,
          nama_kegiatan: body.nama_kegiatan,
          slug: result_slug,
          status_tampil:
            body.status_tampil === "true" ? "tampil" : "tidak_tampil",
          jumlah_dana: body.jumlah_dana,
          jumlah_maksimal_nominal_bantuan: body.jumlah_maksimal_nominal_bantuan,
          jumlah_target_penerima: body.jumlah_target_penerima,
          sumber_dana: body.sumber_dana,
          area_penyaluran: body.area_penyaluran,
          jenis_penyaluran: body.jenis_penyaluran,
          tahun: body.tahun,
          name: body.name,
          banner: body.bannerPath ? body.bannerPath : null,
          desc: body.desc,
          createdAt: myDate,
          updatedAt: myDate,
        },
        {
          transaction: this.t,
        }
      );
      const promises = [];

      console.log("_____________SEBELUM Ddddddddddddddddddddd____________");
      console.log(body.kecamatan_penyaluran);
      console.log(body.desa_penyaluran);
      console.log("_____________Ddddddddddddddddddddd____________");

      if (
        typeof body.desa_penyaluran === "string" &&
        body.desa_penyaluran !== ""
      ) {
        body.desa_penyaluran = JSON.parse(body.desa_penyaluran);
      }

      if (
        typeof body.kecamatan_penyaluran === "string" &&
        body.kecamatan_penyaluran !== ""
      ) {
        body.kecamatan_penyaluran = JSON.parse(body.kecamatan_penyaluran);
      }

      console.log("_____________SAEUDAH Ddddddddddddddddddddd____________");
      console.log(body.kecamatan_penyaluran);
      console.log(body.desa_penyaluran);
      console.log("_____________Ddddddddddddddddddddd____________");

      // Desa
      if (body.desa_penyaluran && Array.isArray(body.desa_penyaluran)) {
        body.desa_penyaluran.forEach((desa) => {
          promises.push(
            Desa_area_kegiatan.create(
              {
                kegiatan_id: insert.id,
                desa_id: desa.id_desa,
                kuota: desa.kuota,
                createdAt: myDate,
                updatedAt: myDate,
              },
              {
                transaction: this.t,
              }
            )
          );
        });
      }

      // Kecamatan
      if (
        body.kecamatan_penyaluran &&
        Array.isArray(body.kecamatan_penyaluran)
      ) {
        body.kecamatan_penyaluran.forEach((kec) => {
          promises.push(
            Kecamatan_area_kegiatan.create(
              {
                kegiatan_id: insert.id,
                kecamatan_id: kec.id_kecamatan,
                kuota: kec.kuota,
                createdAt: myDate,
                updatedAt: myDate,
              },
              {
                transaction: this.t,
              }
            )
          );
        });
      }

      await Promise.all(promises);

      this.message = `Menambahkan Kegiatan Baru dengan Nama Kegiatan: ${body.nama_kegiatan} dan ID Kegiatan: ${insert.id}`;
    } catch (error) {
      this.state = false;
    }
  }

  async edit() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_program_kegiatan_bantuan =
        await model_r.info_program_kegiatan_bantuan(body.id);

      let newImg = info_program_kegiatan_bantuan.banner;

      if (body.bannerPath) {
        // === CASE 1: Upload baru ===
        if (info_program_kegiatan_bantuan.banner) {
          const oldFile = path.join(
            __dirname,
            "../../../uploads/img/program_kegiatan_bantuan/",
            info_program_kegiatan_bantuan.banner
          );
          if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        }
        newImg = body.bannerPath;
      } else if (
        body.nama_kegiatan &&
        body.nama_kegiatan !== info_program_kegiatan_bantuan.nama_kegiatan &&
        info_program_kegiatan_bantuan.banner
      ) {
        // === CASE 2: Hanya ganti nama ===
        const oldPath = path.join(
          __dirname,
          "../../../uploads/img/program_kegiatan_bantuan/",
          info_program_kegiatan_bantuan.banner
        );
        const ext = path.extname(info_program_kegiatan_bantuan.banner);
        const safeName = body.nama_kegiatan.toLowerCase().replace(/\s+/g, "_");
        const newFilename = `${safeName}${ext}`;
        const newPath = path.join(
          __dirname,
          "../../../uploads/img/program_kegiatan_bantuan/",
          newFilename
        );

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          newImg = newFilename;
        }
      }

      await Bank.update(
        {
          img: newImg,
          name: body.name,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Memperbaharui Data Bank dengan Nama Bank: ${info_program_kegiatan_bantuan.name} dan ID Bank: ${body.id} menjadi Nama Bank ${body.name}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_program_kegiatan_bantuan =
        await model_r.info_program_kegiatan_bantuan(body.id);

      await Kegiatan.destroy({
        where: { id: body.id },
        transaction: this.t,
      });

      if (info_program_kegiatan_bantuan.banner) {
        const filePath = path.join(
          __dirname,
          "../../../uploads/img/program_kegiatan_bantuan/",
          info_program_kegiatan_bantuan.banner
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      this.message = `Menghapus Program Kegiatan Bantuan dengan Nama Program Kegiatan Bantuan: ${info_program_kegiatan_bantuan.nama_kegiatan} dan ID Program Kegiatan Bantuan: ${info_program_kegiatan_bantuan.id}`;
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
