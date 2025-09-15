"use strict";

const { Request_member, sequelize } = require("../../../models");
const moment = require("moment");
const bcryptjs = require("bcryptjs");

class Model_cud {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async register() {
        const body = this.req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");

        this.t = await sequelize.transaction();

        try {
            // hash password
            const hashedPassword = await bcryptjs.hash(body.password, 10);

            await Request_member.create(
                {
                    desa_id: body.desa_id,
                    tipe: body.tipe,
                    status: "process",
                    fullname: body.fullname,
                    nomor_ktp: body.nomor_ktp,
                    nomor_kk: body.nomor_kk,
                    whatsapp_number: body.whatsapp_number,
                    birth_date: body.birth_date,
                    alamat: body.alamat,
                    username: body.username,
                    password: hashedPassword,
                    created_at: date,
                    updated_at: date,
                },
                { transaction: this.t }
            );

            this.state = true;
            this.message = "Registrasi berhasil, menunggu persetujuan admin";
        } catch (error) {
            console.error("Error saat register Request_member:", error);
            this.state = false;
            this.message = "Terjadi kesalahan saat registrasi";
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

