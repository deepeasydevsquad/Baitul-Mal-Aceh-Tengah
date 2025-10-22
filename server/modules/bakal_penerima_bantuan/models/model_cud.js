const {
  Op,
  sequelize,
  Realisasi_permohonan,
  Permohonan,
} = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");
const { sendWhatsApp } = require("../../../helper/waSenderHelper");
const { convertToRP } = require("../../../helper/currencyHelper");
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

  async realisasi_bantuan() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("========== REALISASI BANTUAN ==========");
    console.log("Body:", body);

    try {
      // Get info
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      console.log("body", body);

      // Prepare update data
      const updateData = {
        tanggal_realisasi: body.tanggal_realisasi,
        nominal_realisasi: parseInt(body.nominal_realisasi, 10),
        tipe: body.tipe,
        status_realisasi: "sudah_direalisasi",
        updatedAt: myDate,
      };

      // Simpan file sesuai tipe
      if (body.tipe === "transfer") {
        updateData.bukti_transfer = body.bukti_realisasi;
      } else if (body.tipe === "bantuan_langsung") {
        updateData.mou = body.bukti_realisasi;
      }

      // Update realisasi
      await Realisasi_permohonan.update(updateData, {
        where: { id: body.id },
        transaction: this.t,
      });

      // Kirim WhatsApp jika diminta
      if (body.send_wa === "true" || body.send_wa === true) {
        const message = `Halo *${
          info_member.fullname
        }*,\n\nRealisasi bantuan untuk kegiatan *"${
          info_kegiatan.nama_kegiatan
        }"* telah *BERHASIL DIREALISASIKAN*.\n\n*Detail:*\n- Tanggal: ${moment(
          body.tanggal_realisasi
        ).format("DD MMMM YYYY")}\n- Nominal: ${await convertToRP(
          body.nominal_realisasi
        )}\n- Tipe: ${
          body.tipe === "transfer" ? "Transfer" : "Bantuan Langsung"
        }\n\nTerima kasih.`;

        console.log(`Sending WA to ${info_member.whatsapp_number}: ${message}`);
        await sendWhatsApp(info_member.whatsapp_number, message);
      }

      this.message = `Realisasi bantuan berhasil untuk ${
        info_member.fullname
      } - Kegiatan: ${
        info_kegiatan.nama_kegiatan
      } dengan nominal Rp ${body.nominal_realisasi.toLocaleString("id-ID")}${
        body.send_wa === "true" || body.send_wa === true
          ? " (dengan notifikasi WA)"
          : ""
      }`;
    } catch (error) {
      this.state = false;
      console.error("Error realisasi bantuan:", error);
      this.message = error.message;

      // Hapus file jika ada error
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  async upload_berita_acara() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("========== UPLOAD BERITA ACARA ==========");
    console.log("Body:", body);

    try {
      // Get info
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      // Hapus file lama jika ada
      if (info_realisasi.berita_acara) {
        const oldFile = path.join(
          __dirname,
          "../../../uploads/dokumen/bakal_penerima_bantuan/berita_acara/",
          info_realisasi.berita_acara
        );
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      // Update dengan file baru
      await Realisasi_permohonan.update(
        {
          berita_acara: body.berita_acara,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Berita acara berhasil diupload untuk ${info_member.fullname} - Kegiatan: ${info_kegiatan.nama_kegiatan}`;
    } catch (error) {
      this.state = false;
      console.error("Error upload berita acara:", error);
      this.message = error.message;

      // Hapus file jika ada error
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  async upload_berita_acara_massal() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("========== UPLOAD BERITA ACARA MASSAL ==========");
    console.log("Body:", body);

    console.log("Selected IDs:", body.selected_ids);

    try {
      // Parse selected IDs
      const selectedIds = JSON.parse(body.selected_ids);

      // Update semua realisasi yang dipilih
      await Realisasi_permohonan.update(
        {
          berita_acara: body.berita_acara,
          updatedAt: myDate,
        },
        {
          where: {
            id: { [Op.in]: selectedIds },
            status: "approve",
            status_realisasi: "sudah_direalisasi",
          },
          transaction: this.t,
        }
      );

      this.message = `Berita acara massal berhasil diupload untuk ${selectedIds.length} permohonan`;
    } catch (error) {
      this.state = false;
      console.error("Error upload berita acara massal:", error);
      this.message = error.message;
    }
  }

  async batal_realisasi() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    console.log("========== BATAL REALISASI ==========");
    console.log("Body:", body);

    try {
      // Get info
      const model_r = new Model_r(this.req);
      const info_realisasi = await model_r.info_realisasi(body.id);
      const info_permohonan = await model_r.info_permohonan(
        info_realisasi.permohonan_id
      );
      const info_kegiatan = await model_r.info_kegiatan(
        info_permohonan.kegiatan_id
      );
      const info_member = await model_r.info_member(info_permohonan.member_id);

      // Simpan nama file untuk pengecekan nanti
      const buktiTransferFile = info_realisasi.bukti_transfer;
      const mouFile = info_realisasi.mou;
      const beritaAcaraFile = info_realisasi.berita_acara;

      await Realisasi_permohonan.update(
        {
          status_realisasi: "belum_direalisasi",
          bukti_transfer: null,
          mou: null,
          tanggal_realisasi: null,
          nominal_realisasi: null,
          tipe: null,
          berita_acara: null,
          updatedAt: myDate,
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      // 1. HAPUS BUKTI TRANSFER
      if (buktiTransferFile) {
        const buktiTransferPath = path.join(
          __dirname,
          "../../../uploads/dokumen/bakal_penerima_bantuan/bukti_realisasi/",
          buktiTransferFile
        );
        try {
          if (fs.existsSync(buktiTransferPath)) {
            fs.unlinkSync(buktiTransferPath);
            console.log(`Bukti transfer ${buktiTransferFile} berhasil dihapus`);
          }
        } catch (err) {
          console.error(`Gagal menghapus bukti transfer:`, err);
        }
      }

      // 2. HAPUS MOU
      if (mouFile) {
        const mouPath = path.join(
          __dirname,
          "../../../uploads/dokumen/bakal_penerima_bantuan/bukti_realisasi/",
          mouFile
        );
        try {
          if (fs.existsSync(mouPath)) {
            fs.unlinkSync(mouPath);
            console.log(`MOU ${mouFile} berhasil dihapus`);
          }
        } catch (err) {
          console.error(`Gagal menghapus MOU:`, err);
        }
      }

      // 3. CEK & HAPUS BERITA ACARA
      if (beritaAcaraFile) {
        try {
          const countUsage = await Realisasi_permohonan.count({
            where: { berita_acara: beritaAcaraFile },
            include: [
              {
                model: Permohonan,
                where: { kegiatan_id: info_permohonan.kegiatan_id },
                required: true,
              },
            ],
          });

          console.log(
            `Berita acara ${beritaAcaraFile} masih digunakan oleh ${countUsage} realisasi`
          );

          // Jika tidak ada yang pakai lagi, hapus file-nya
          if (countUsage <= 1) {
            const beritaAcaraPath = path.join(
              __dirname,
              "../../../uploads/dokumen/bakal_penerima_bantuan/berita_acara/",
              beritaAcaraFile
            );

            if (fs.existsSync(beritaAcaraPath)) {
              fs.unlinkSync(beritaAcaraPath);
              console.log(`Berita acara ${beritaAcaraFile} berhasil dihapus`);
            }
          } else {
            console.log(
              `Berita acara ${beritaAcaraFile} masih digunakan, tidak dihapus`
            );
          }
        } catch (error) {
          console.error(
            "Error saat mengecek atau menghapus berita acara:",
            error
          );
        }
      }

      this.message = `Realisasi berhasil dibatalkan untuk ${info_member.fullname} - Kegiatan: ${info_kegiatan.nama_kegiatan}`;
      this.state = true;
    } catch (error) {
      this.state = false;
      console.error("Error batal realisasi:", error);
      this.message = error.message;
    }
  }

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
