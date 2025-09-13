"use strict";

const { Syarat, sequelize, } = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_syarat() {
        const body = this.req.body;
        const limit = parseInt(body.perpage) || 10;
        const page =
            body.pageNumber && body.pageNumber !== "0"
                ? parseInt(body.pageNumber)
                : 1;

        let where = {};

        // filter status kalau dikirim
        if (body.status && body.status !== "") {
            where.status = body.status;
        }

        // filter search kalau dikirim
        if (body.search && body.search !== "") {
            where.syarat = { [Op.like]: `%${body.search}%` };
            // NOTE: lu tadi pake `where.name`, padahal di attributes ga ada field `name`
            // harusnya `fullname` atau field lain yg sesuai model lu
        }

        const sql = {
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: [
                "syarat",
                "path",
                "datetimes",
                "aksi",
                "createdAt",
                "updatedAt",
            ],
            where,
        };

        try {
            const q = await Syarat.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    syarat: row.syarat,
                    path: row.path,
                    datetimes: row.datetimes,
                    aksi: row.aksi,
                    createdAt: moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                };
            });
            return {
                data,
                total,
            };
        } catch (error) {
            console.error("🔥 ERROR :", error);
            return {
                data: [],
                total: 0,
            };
        }
    }
}

module.exports = Model_r;