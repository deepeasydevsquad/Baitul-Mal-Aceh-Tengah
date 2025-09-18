const moment = require('moment');
const { Sequelize, Tab, sequelize } = require("../../../models");

class Model_cud {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async update() {
        const body = this.req.body;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        this.t = await sequelize.transaction();
        try {
            const tab = await Tab.findByPk(body.id, { transaction: this.t });
            if (!tab) {
                throw new Error('Data tidak ditemukan');
            }

            await tab.update({
                desc: body.desc
            }, { transaction: this.t });

            this.state = true;
            this.message = 'Data berhasil diperbarui';
        } catch (err) {
            this.message = err.message;
        }
    }

    async response() {
        if (this.state) {
            await this.t.commit(); // simpan perubahan
            return true;
        } else {
            if (this.t) await this.t.rollback(); // batalkan kalau error
            return false;
        }
    }
}

module.exports = Model_cud;
