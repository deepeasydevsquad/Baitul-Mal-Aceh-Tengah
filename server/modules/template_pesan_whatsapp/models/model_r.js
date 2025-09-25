"use strict";

const { Whatsapp_template, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_template_pesan_whatsapp() {
        const body = this.req.body;
        const limit = parseInt(body.perpage) || 10;
        const page =
            body.pageNumber && body.pageNumber !== "0"
                ? parseInt(body.pageNumber)
                : 1;

        let where = {};

        // filter search kalau dikirim
        if (body.search && body.search !== "") {
            where.name = { [Op.like]: `%${body.search}%` };
        }

        const sql = {
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: ["id", "name", "type", "message", "variable", "createdAt", "updatedAt"],
            where,
        };

        try {
            const q = await Whatsapp_template.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                    message: row.message,
                    variable: row.variable,
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

    async detail_template_pesan_whatsapp() {
        const { id } = this.req.body;

        try {
            const item = await Whatsapp_template.findOne({
                where: { id },
                attributes: ["id", "name", "type", "message", "variable", "createdAt", "updatedAt"],
            });

            if (!item) {
                return null; // kalau tidak ketemu
            }

            const row = item.toJSON();
            return {
                id: row.id,
                name: row.name,
                type: row.type,
                message: row.message,
                variable: row.variable,
                createdAt: moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            };
        } catch (error) {
            console.error("🔥 ERROR detail_template_pesan_whatsapp :", error);
            return null;
        }
    }
}

module.exports = Model_r;

