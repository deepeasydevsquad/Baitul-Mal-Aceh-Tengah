"use strict";

const { Desa, Kecamatan } = require("../../../models");
const moment = require("moment");

class Model_r {

    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_desa() {
        const body = this.req.body;
        try {
            const sql = await Desa.findAll({
                where: {
                    kecamatan_id: body.kecamatan_id,
                },
            });

            const data = sql.map((d) => ({
                id: d.id,
                name: d.name,
            }));
            return data;
        } catch (error) {
            console.error("Gagal ambil daftar kostumer:", error);
            return [];
        }
    }

    async daftar_kecamatan() {
        try {
            const sql = await Kecamatan.findAll({});

            const data = sql.map((d) => ({
                id: d.id,
                name: d.name,
            }));
            return data;
        } catch (error) {
            console.error("Gagal ambil daftar kostumer:", error);
            return [];
        }
    }
}

module.exports = Model_r;

