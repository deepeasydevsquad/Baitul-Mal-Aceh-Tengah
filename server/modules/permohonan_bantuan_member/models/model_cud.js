const {
  sequelize,
  Bank,
  Realisasi_permohonan,
  Permohonan,
  Syarat_kegiatan,
  Validasi_syarat_permohonan,
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

  async sisaBulanTahunIni() {
    const bulanSekarang = moment().month() + 1; // month() is zero-based
    const bulans = Array.from(
      { length: 12 - bulanSekarang + 1 },
      (v, k) => k + bulanSekarang
    );
    return bulans;
  }

  async add() {
    await this.initialize();
    const myDate = new Date();
    const body = this.req.body;

    const sisaBulan = await this.sisaBulanTahunIni();
    const arr_filepath = body.arr_path || [];

    console.log("----- DEBUG ADD PERMOHONAN -----");
    console.log(sisaBulan);
    console.log(body);
    console.log("----- END DEBUG ADD PERMOHONAN -----");

    try {
      const model_r = new Model_r(this.req);
      const info_kegiatan = await model_r.info_kegiatan(body.kegiatan_id);
      const info_member = await model_r.info_member_cud(body.member_id);

      let insert_permohonan = [];
      let insert_realisasi = [];

      // ================= BULANAN =================
      if (info_kegiatan.periode_bantuan === "bulanan") {
        console.log("================ Processing bulanan =================");

        // 1. Insert semua permohonan sekaligus
        const permohonanData = sisaBulan.map(() => ({
          member_id: body.member_id,
          kegiatan_id: body.kegiatan_id,
          bank_id: body.bank_id,
          nomor_akun_bank: body.nomor_rekening,
          nama_akun_bank: body.atas_nama,
          status: "sedang_berlangsung",
          createdAt: myDate,
          updatedAt: myDate,
        }));

        insert_permohonan = await Permohonan.bulkCreate(permohonanData, {
          transaction: this.t,
        });

        // 2. Insert semua realisasi sekaligus (pakai mapping ke permohonan yang barusan dibuat)
        const realisasiData = sisaBulan.map((bulan, idx) => ({
          permohonan_id: insert_permohonan[idx].id,
          status: "process",
          status_realisasi: "belum_direalisasi",
          bulan,
          createdAt: myDate,
          updatedAt: myDate,
        }));

        insert_realisasi = await Realisasi_permohonan.bulkCreate(
          realisasiData,
          { transaction: this.t }
        );

        // 3. Insert file validasi paralel per realisasi
        await Promise.all(
          insert_realisasi.map((realisasi) =>
            Promise.all(
              arr_filepath.map((fileObj) =>
                Validasi_syarat_permohonan.create(
                  {
                    realisasi_permohonan_id: realisasi.id,
                    file_name: fileObj.basename,
                    path: fileObj.path,
                    status: "process",
                    createdAt: myDate,
                    updatedAt: myDate,
                  },
                  { transaction: this.t }
                )
              )
            )
          )
        );

        this.message = `Berhasil menambahkan ${sisaBulan.length} Permohonan Bantuan bulanan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan}`;
      }

      // ================= TAHUNAN =================
      else {
        console.log("================== Processing tahunan ==================");

        // 1. Insert permohonan tunggal
        const permohonanData = {
          member_id: body.member_id,
          kegiatan_id: body.kegiatan_id,
          bank_id: body.bank_id,
          nomor_akun_bank: body.nomor_rekening,
          nama_akun_bank: body.atas_nama,
          status: "sedang_berlangsung",
          createdAt: myDate,
          updatedAt: myDate,
        };

        const insert_permohonan_single = await Permohonan.create(
          permohonanData,
          { transaction: this.t }
        );

        // 2. Insert realisasi tunggal
        const insert_realisasi_single = await Realisasi_permohonan.create(
          {
            permohonan_id: insert_permohonan_single.id,
            status: "process",
            status_realisasi: "belum_direalisasi",
            createdAt: myDate,
            updatedAt: myDate,
          },
          { transaction: this.t }
        );

        // 3. Insert file validasi paralel
        await Promise.all(
          arr_filepath.map((fileObj) =>
            Validasi_syarat_permohonan.create(
              {
                realisasi_permohonan_id: insert_realisasi_single.id,
                file_name: fileObj.basename,
                path: fileObj.path,
                status: "process",
                createdAt: myDate,
                updatedAt: myDate,
              },
              { transaction: this.t }
            )
          )
        );

        this.message = `Menambahkan Permohonan Bantuan tahunan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dan ID Permohonan: ${insert_permohonan_single.id}`;
      }
    } catch (error) {
      console.error("Error in add():", error);
      this.state = false;
      this.message = error.message;
    }
  }

  // response
  async response() {
    if (this.state) {
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
