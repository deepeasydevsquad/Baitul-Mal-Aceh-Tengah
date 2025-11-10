const { Running_text, sequelize } = require("../../../models");
const Model_r = require("../models/model_r");
const { writeLog } = require("../../../helper/writeLogHelper");

class Model_cud {
  constructor(req) {
    this.req = req;
  }

  async initialize() {
    this.t = await sequelize.transaction();
    this.state = true;
  }

  async add_running_text() {
    await this.initialize();
    const body = this.req.body;

    try {
      // Buat record baru dengan status non-aktif dan order 0
      const insert = await Running_text.create({
        content: body.content.trim(),
        is_active: false,
        order: 0,
        speed: 80, // default speed
      });

      this.message = `Menambahkan running text dengan content ${body.content.trim()} dengan ID ${
        insert.id
      }`;
    } catch (error) {
      console.log("xxxx222");
      console.log(error);
      console.log("xxxx222");
      this.state = false;
      this.message = error.message;
    }
  }

  async edit_running_text() {
    await this.initialize();
    const body = this.req.body;

    try {
      const model_r = new Model_r(this.req);
      const info_runningtext = await model_r.info_runningtext(body.id);

      await Running_text.update(
        {
          content: body.content.trim(),
        },
        {
          where: { id: body.id },
          transaction: this.t,
        }
      );

      this.message = `Memperbaharui Data Running Text dengan Content: ${
        info_runningtext.name
      } dan ID Bank: ${body.id} menjadi Nama Bank ${body.content.trim()}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async toggle_status() {
    await this.initialize();
    const body = this.req.body;

    try {
      const runningText = await Running_text.findByPk(body.id, {
        transaction: this.t,
      });

      // Toggle status dengan menggunakan negasi
      const newIsActive = !runningText.is_active;
      runningText.is_active = newIsActive;
      await runningText.save({ transaction: this.t });

      this.message = `Memperbaharui Status running Text dengan ID ${
        body.id
      } menjadi ${newIsActive ? "Aktif" : "Tidak Aktif"}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async update_order() {
    await this.initialize();
    const { order: orderArray = [] } = this.req.body;

    try {
      console.log("Received order updates:", orderArray);

      const records = await Running_text.findAll({
        where: {
          id: orderArray.map((id) => parseInt(id, 10)),
          is_active: true,
        },
      });

      // Bikin mapping id record
      const recordMap = new Map(records.map((r) => [r.id, r]));

      // Build data baru untuk update
      const updates = orderArray
        .map((id, idx) => {
          const parsedId = parseInt(id, 10);
          if (!parsedId || !recordMap.has(parsedId)) return null;
          return { id: parsedId, order: idx + 1 };
        })
        .filter(Boolean);

      if (updates.length === 0) {
        this.state = false;
        this.message = "Tidak ada data valid untuk diperbarui.";
        return;
      }

      // Bulk update pakai transaction
      await sequelize.transaction(async (t) => {
        for (const u of updates) {
          await Running_text.update(
            { order: u.order },
            { where: { id: u.id }, transaction: t }
          );
        }
      });

      this.message = `Order Running Text berhasil diperbaharui (${updates.length} records).`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async update_speed() {
    await this.initialize();
    const body = this.req.body;

    try {
      // Update speed untuk semua record
      await Running_text.update(
        { speed: body.speed },
        {
          where: {},
          transaction: this.t,
        }
      );

      this.message = `Memperbaharui kecepatan running text menjadi ${body.speed} pixel/detik`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
    }
  }

  async delete_running_text() {
    await this.initialize();
    const body = this.req.body;

    try {
      await Running_text.destroy({
        where: { id: body.id },
        transaction: this.t,
      });

      this.message = `Menghapus Running Text dengan ID Running Text: ${body.id}`;
    } catch (error) {
      this.state = false;
      this.message = error.message;
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
