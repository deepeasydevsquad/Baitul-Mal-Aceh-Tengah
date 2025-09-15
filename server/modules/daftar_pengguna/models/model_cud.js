const moment = require("moment");
const { User, sequelize } = require("../../../models");

class Model_cud {
    constructor(req) {
        this.req = req;
        this.state = false;
        this.message = null;
        this.t = null;
    }

    async generate_kode() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async create() {
        const body = this.req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        this.t = await sequelize.transaction();
        try {
            await User.create({
                name: body.name,
                grup_id: body.grup_id,
                kode: await this.generate_kode(),
                username: body.username,
                password: body.password,
                createdAt: date,
                updatedAt: date,
            }, { transaction: this.t });

            this.state = true;
            this.message = "Data berhasil disimpan";
        } catch (err) {
            this.message = err.message;
        }
    }

    async update() {
        const body = this.req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        this.t = await sequelize.transaction();
        try {
            const user = await User.findByPk(body.id, { transaction: this.t });
            if (!user) throw new Error("Data tidak ditemukan");

            await user.update({
                name: body.name,
                grup_id: body.grup_id,
                username: body.username,
                password: body.password,
                createdAt: date,
                updatedAt: date,
            }, { transaction: this.t });

            this.state = true;
            this.message = "Data berhasil diperbarui";
        } catch (err) {
            this.message = err.message;
        }
    }

    async delete() {
        const { id } = this.req.body;
        this.t = await sequelize.transaction();
        try {
            const user = await User.findByPk(id, { transaction: this.t });
            if (!user) throw new Error("Data tidak ditemukan");

            await user.destroy({ transaction: this.t });

            this.state = true;
            this.message = "Data berhasil dihapus";
        } catch (err) {
            this.message = err.message;
        }
    }

    async response() {
        if (this.state) {
            await this.t.commit();
            return true;
        } else {
            if (this.t) await this.t.rollback();
            return false;
        }
    }
}

module.exports = Model_cud;
