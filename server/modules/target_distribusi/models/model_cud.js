const { Target_distribusi, sequelize } = require("../../../models");
const { writeLog } = require("../../../helper/writeLogHelper");
const moment = require("moment");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async add() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      if (!body.tahun) {
        this.state = false;
        this.message = "Tahun harus diisi";
        return;
      }

      if (!body.bulan) {
        this.state = false;
        this.message = "Bulan harus diisi";
        return;
      }

      const dataInsert = [];

      // --- Bulk insert untuk Zakat (dari daftar asnaf) ---
      if (body.targets && Array.isArray(body.targets)) {
        body.targets.forEach((t) => {
          dataInsert.push({
            tahun: body.tahun,
            bulan: body.bulan,
            tipe: "zakat",
            asnaf_id: t.asnaf_id,
            target_orang: t.target_orang || 0,
            target_rupiah: t.target_rupiah || 0,
            createdAt: myDate,
            updatedAt: myDate,
          });
        });
      }

      // --- Infaq (single row) ---
      if (body.infaq) {
        dataInsert.push({
          tahun: body.tahun,
          bulan: body.bulan,
          tipe: "infaq",
          target_orang: body.infaq.target_orang || 0,
          target_rupiah: body.infaq.target_rupiah || 0,
          createdAt: myDate,
          updatedAt: myDate,
        });
      }

      // --- Donasi (single row) ---
      if (body.donasi) {
        dataInsert.push({
          tahun: body.tahun,
          bulan: body.bulan,
          tipe: "donasi",
          target_orang: body.donasi.target_orang || 0,
          target_rupiah: body.donasi.target_rupiah || 0,
          createdAt: myDate,
          updatedAt: myDate,
        });
      }

      if (dataInsert.length === 0) {
        this.state = false;
        this.message = "Tidak ada data target distribusi yang dikirim";
        return;
      }

      const insert = await Target_distribusi.bulkCreate(dataInsert, {
        transaction: this.t,
      });

      this.state = true;
      this.message = `Berhasil menambahkan ${
        insert.length
      } target distribusi untuk ${this.getBulanName(body.bulan)} ${body.tahun}`;
    } catch (error) {
      console.error("Error in add method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async update() {
    await this.initialize();
    const myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const body = this.req.body;

    try {
      if (!body.tahun) {
        this.state = false;
        this.message = "Tahun harus diisi";
        return;
      }

      if (!body.bulan) {
        this.state = false;
        this.message = "Bulan harus diisi";
        return;
      }

      // --- Update zakat per asnaf ---
      if (body.targets && Array.isArray(body.targets)) {
        for (const t of body.targets) {
          await Target_distribusi.update(
            {
              target_orang: t.target_orang,
              target_rupiah: t.target_rupiah,
              updatedAt: myDate,
            },
            {
              where: {
                tahun: body.tahun,
                bulan: body.bulan,
                tipe: "zakat",
                asnaf_id: t.asnaf_id,
              },
              transaction: this.t,
            }
          );
        }
      }

      // --- Update infaq ---
      if (body.infaq) {
        await Target_distribusi.update(
          {
            target_orang: body.infaq.target_orang,
            target_rupiah: body.infaq.target_rupiah,
            updatedAt: myDate,
          },
          {
            where: { tahun: body.tahun, bulan: body.bulan, tipe: "infaq" },
            transaction: this.t,
          }
        );
      }

      // --- Update donasi ---
      if (body.donasi) {
        await Target_distribusi.update(
          {
            target_orang: body.donasi.target_orang,
            target_rupiah: body.donasi.target_rupiah,
            updatedAt: myDate,
          },
          {
            where: { tahun: body.tahun, bulan: body.bulan, tipe: "donasi" },
            transaction: this.t,
          }
        );
      }

      this.state = true;
      this.message = `Berhasil update target distribusi ${this.getBulanName(
        body.bulan
      )} ${body.tahun}`;
    } catch (error) {
      console.error("Error in update method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  async delete() {
    await this.initialize();
    const body = this.req.body;

    try {
      if (!body.tahun) {
        this.state = false;
        this.message =
          "Tahun harus diisi untuk menghapus data target distribusi";
        return;
      }

      if (!body.bulan) {
        this.state = false;
        this.message =
          "Bulan harus diisi untuk menghapus data target distribusi";
        return;
      }

      const deleted = await Target_distribusi.destroy({
        where: { tahun: body.tahun, bulan: body.bulan },
        transaction: this.t,
      });

      if (deleted > 0) {
        this.state = true;
        this.message = `Berhasil menghapus ${deleted} target distribusi untuk ${this.getBulanName(
          body.bulan
        )} ${body.tahun}`;
      } else {
        this.state = false;
        this.message = `Tidak ada data target distribusi untuk ${this.getBulanName(
          body.bulan
        )} ${body.tahun}`;
      }
    } catch (error) {
      console.error("Error in delete method:", error);
      this.state = false;
      this.message = error.message;
    }
  }

  getBulanName(bulan) {
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return namaBulan[parseInt(bulan) - 1] || bulan;
  }

  async response() {
    if (this.state) {
      await writeLog(this.req, this.t, { msg: this.message });
      await this.t.commit();
      return true;
    } else {
      await this.t.rollback();
      return false;
    }
  }
}

module.exports = Model_cud;
