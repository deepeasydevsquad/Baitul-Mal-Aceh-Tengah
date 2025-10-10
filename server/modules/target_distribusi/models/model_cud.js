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

      const dataInsert = [];

      // --- Bulk insert untuk Zakat (dari daftar asnaf) ---
      if (body.targets && Array.isArray(body.targets)) {
        body.targets.forEach((t) => {
          dataInsert.push({
            tahun: body.tahun,
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
      this.message = `Berhasil menambahkan ${insert.length} target distribusi untuk tahun ${body.tahun}`;
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
            where: { tahun: body.tahun, tipe: "infaq" },
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
            where: { tahun: body.tahun, tipe: "donasi" },
            transaction: this.t,
          }
        );
      }

      this.state = true;
      this.message = `Berhasil update target distribusi tahun ${body.tahun}`;
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

      const deleted = await Target_distribusi.destroy({
        where: { tahun: body.tahun },
        transaction: this.t,
      });

      if (deleted > 0) {
        this.state = true;
        this.message = `Berhasil menghapus ${deleted} target distribusi untuk tahun ${body.tahun}`;
      } else {
        this.state = false;
        this.message = `Tidak ada data target distribusi untuk tahun ${body.tahun}`;
      }
    } catch (error) {
      console.error("Error in delete method:", error);
      this.state = false;
      this.message = error.message;
    }
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
