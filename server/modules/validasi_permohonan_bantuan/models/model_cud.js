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
      const info_member = await model_r.info_member(body.member_id);

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

  // Masih maintenance ini
  async edit() {
    await this.initialize();
    const myDate = new Date();
    const body = this.req.body;

    console.log("_____________Edit Permohonan____________");
    console.log("body: ", body);
    console.log("_______________________________________");

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

      // Cek apakah kegiatan berubah
      const kegiatanBerubah = info_permohonan.kegiatan_id !== body.kegiatan_id;

      // --- Update permohonan utama ---
      await Permohonan.update(
        {
          kegiatan_id: body.kegiatan_id,
          bank_id: body.bank_id,
          member_id: body.member_id,
          nomor_akun_bank: body.nomor_rekening,
          nama_akun_bank: body.atas_nama,
          updatedAt: myDate,
        },
        { where: { id: info_realisasi.permohonan_id }, transaction: this.t }
      );

      // --- Jika kegiatan berubah, handle syarat ---
      if (kegiatanBerubah) {
        console.log("Kegiatan berubah - validasi syarat dokumen");

        // Ambil syarat kegiatan LAMA
        const syaratLama = await Syarat_kegiatan.findAll({
          where: { kegiatan_id: info_permohonan.kegiatan_id },
          include: [
            {
              model: Syarat,
              as: "syarat",
              attributes: ["id", "nama_syarat"],
            },
          ],
          order: [["id", "ASC"]],
        });

        // Ambil syarat kegiatan BARU
        const syaratBaru = await Syarat_kegiatan.findAll({
          where: { kegiatan_id: body.kegiatan_id },
          include: [
            {
              model: Syarat,
              as: "syarat",
              attributes: ["id", "nama_syarat"],
            },
          ],
          order: [["id", "ASC"]],
        });

        // Ambil dokumen existing
        const dokumenExisting = await Validasi_syarat_permohonan.findAll({
          where: { realisasi_permohonan_id: info_realisasi.id },
          order: [["id", "ASC"]],
        });

        // Buat map syarat lama dan baru berdasarkan syarat_id
        const syaratLamaMap = new Map(
          syaratLama.map((sk, index) => [
            sk.syarat_id,
            { ...sk.toJSON(), index },
          ])
        );

        const syaratBaruMap = new Map(
          syaratBaru.map((sk, index) => [
            sk.syarat_id,
            { ...sk.toJSON(), index },
          ])
        );

        // Analisis dokumen existing
        const dokumenDipertahankan = [];
        const dokumenDihapus = [];

        for (let i = 0; i < dokumenExisting.length; i++) {
          const dok = dokumenExisting[i];

          // Cari syarat lama yang sesuai dengan urutan dokumen
          const syaratLamaItem = syaratLama[i];

          if (!syaratLamaItem) {
            // Dokumen berlebih, hapus
            dokumenDihapus.push(dok);
            continue;
          }

          const syaratId = syaratLamaItem.syarat_id;

          // Cek apakah syarat_id ini masih ada di kegiatan baru
          if (syaratBaruMap.has(syaratId)) {
            // Syarat masih sama, pertahankan dokumen
            dokumenDipertahankan.push({
              dokumen: dok,
              syaratLama: syaratLamaItem,
              syaratBaru: syaratBaruMap.get(syaratId),
            });
            console.log(
              `✓ Dokumen dipertahankan: ${dok.file_name} (${syaratLamaItem.syarat?.nama_syarat})`
            );
          } else {
            // Syarat tidak ada di kegiatan baru, hapus dokumen
            dokumenDihapus.push(dok);
            console.log(
              `✗ Dokumen akan dihapus: ${dok.file_name} (syarat tidak sesuai)`
            );
          }
        }

        // Hapus dokumen yang tidak sesuai
        for (const dok of dokumenDihapus) {
          if (dok.path) {
            const filePath = path.join(
              __dirname,
              "../../../uploads/dokumen/permohonan_bantuan/",
              dok.path
            );
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`File dihapus: ${dok.path}`);
            }
          }
          await Validasi_syarat_permohonan.destroy({
            where: { id: dok.id },
            transaction: this.t,
          });
        }

        // Cek syarat baru yang belum ada dokumennya
        const syaratPerluUpload = [];
        for (const [syaratId, syaratItem] of syaratBaruMap) {
          const sudahAdaDokumen = dokumenDipertahankan.some(
            (d) => d.syaratBaru.syarat_id === syaratId
          );
          if (!sudahAdaDokumen) {
            syaratPerluUpload.push(syaratItem);
          }
        }

        console.log(`\nRingkasan:`);
        console.log(`- Dokumen dipertahankan: ${dokumenDipertahankan.length}`);
        console.log(`- Dokumen dihapus: ${dokumenDihapus.length}`);
        console.log(`- Syarat perlu upload: ${syaratPerluUpload.length}`);

        // Simpan info untuk response (optional)
        this.syaratInfo = {
          dipertahankan: dokumenDipertahankan.map((d) => ({
            id: d.dokumen.id,
            file_name: d.dokumen.file_name,
            syarat: d.syaratBaru.syarat?.nama_syarat,
          })),
          dihapus: dokumenDihapus.map((d) => d.file_name),
          perlu_upload: syaratPerluUpload.map((s) => ({
            syarat_kegiatan_id: s.id,
            nama_syarat: s.syarat?.nama_syarat,
          })),
        };
      }

      // --- Handle dokumen via dokumenMap (upload baru/update) ---
      const dokumenMap = body.dokumenMap || {};

      // Merge file + meta berdasarkan prefix
      const mergedDocs = [];
      for (const [key, val] of Object.entries(dokumenMap)) {
        if (key.endsWith("_meta")) {
          const baseKey = key.replace("_meta", "");
          const fileObj = dokumenMap[baseKey] || {};
          mergedDocs.push({ ...val, ...fileObj });
        }
      }

      const allDocs = mergedDocs;

      // Bikin map existing dari DB
      const ids = allDocs.filter((f) => f.id).map((f) => f.id);
      const existingDocs = ids.length
        ? await Validasi_syarat_permohonan.findAll({ where: { id: ids } })
        : [];
      const docMap = Object.fromEntries(existingDocs.map((d) => [d.id, d]));

      for (const fileObj of allDocs) {
        const {
          id,
          file: newPath,
          file_name: basename,
          status = "new",
          syarat_index, // Indeks urutan syarat (0, 1, 2, ...)
        } = fileObj;

        if (status === "replace" && id) {
          // Hapus file lama
          const oldDoc = docMap[id];
          if (oldDoc?.path) {
            const oldFile = path.join(
              __dirname,
              "../../../uploads/dokumen/permohonan_bantuan/",
              oldDoc.path
            );
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          // Update ke file baru
          await Validasi_syarat_permohonan.update(
            {
              file_name: basename,
              path: newPath,
              updatedAt: myDate,
            },
            { where: { id }, transaction: this.t }
          );
        } else if (status === "keep" && id) {
          // Skip - file tetap
        } else if (status === "remove" && id) {
          const oldDoc = docMap[id];
          if (oldDoc?.path) {
            const oldFile = path.join(
              __dirname,
              "../../../uploads/dokumen/permohonan_bantuan/",
              oldDoc.path
            );
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          await Validasi_syarat_permohonan.destroy({
            where: { id },
            transaction: this.t,
          });
        } else if (status === "new") {
          // Upload dokumen baru
          await Validasi_syarat_permohonan.create(
            {
              realisasi_permohonan_id: info_realisasi.id,
              file_name: basename,
              path: newPath,
              status: "process",
              createdAt: myDate,
              updatedAt: myDate,
            },
            { transaction: this.t }
          );
        }
      }

      this.message = `Berhasil mengubah Permohonan Bantuan tahunan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dan ID Permohonan: ${info_realisasi.id}`;

      // Tambahkan info syarat jika kegiatan berubah
      if (kegiatanBerubah && this.syaratInfo) {
        this.message += `\n\nInfo Perubahan Syarat:\n`;
        this.message += `- ${this.syaratInfo.dipertahankan.length} dokumen dipertahankan\n`;
        this.message += `- ${this.syaratInfo.dihapus.length} dokumen dihapus\n`;
        this.message += `- ${this.syaratInfo.perlu_upload.length} syarat perlu dokumen baru`;
      }
    } catch (error) {
      console.error("Error in edit():", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async edit_status() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
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

      await Permohonan.update(
        {
          status: "terhenti",
          alasan_penolakan: body.alasan_penolakan,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Menghentikan Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id} dan Alasan Penolakan: ${body.alasan_penolakan}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async persetujuan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
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
          biaya_disetujui: body.nominal_yang_disetujui,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Menyetujui Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id} dan Nominal Yang Disetujui: ${body.nominal_yang_disetujui}`;
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
      const info_permohonan = await model_r.info_permohonan(body.id);
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      // Ambil validasi dulu
      const validasi = await Validasi_syarat_permohonan.findAll({
        attributes: ["id", "file_name", "path"],
        where: { realisasi_permohonan_id: body.id },
        raw: true,
      });

      // Hapus validasi
      await Validasi_syarat_permohonan.destroy({
        where: { realisasi_permohonan_id: body.id },
        transaction: this.t,
      });

      // Hapus realisasi & permohonan
      await Realisasi_permohonan.destroy({
        where: { id: body.id },
        transaction: this.t,
      });
      await Permohonan.destroy({
        where: { id: info_permohonan.id },
        transaction: this.t,
      });

      // Hapus file (di luar DB transaction)
      for (const item of validasi) {
        const oldFile = path.join(
          __dirname,
          "../../../uploads/dokumen/permohonan_bantuan/",
          item.path
        );

        try {
          // cek apakah masih dipakai record lain
          const count = await Validasi_syarat_permohonan.count({
            where: { path: item.path },
          });

          if (count === 0 && fs.existsSync(oldFile)) {
            fs.unlinkSync(oldFile);
          }
        } catch (err) {
          console.error(`Gagal hapus file ${oldFile}:`, err);
        }
      }

      this.message = `Menghapus Permohonan Bantuan atas nama ${info_member.fullname} untuk Kegiatan ${info_kegiatan.nama_kegiatan} dengan ID Permohonan: ${body.id}`;
    } catch (error) {
      this.state = false;
      console.error("Failed to delete data:", error);
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
