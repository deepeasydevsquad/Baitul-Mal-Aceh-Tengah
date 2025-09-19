"use strict";

const { Program, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_program() {
        const body = this.req.body;
        const limit = parseInt(body.perpage) || 20;
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
            attributes: ["id", "name", "desc", "createdAt", "updatedAt"],
            where,
        };

        try {
            const q = await Program.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    name: row.name,
                    desc: row.desc,
                    createdAt: moment(row.createdAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                    updatedAt: moment(row.updatedAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
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

    async detail_program() {
        const { id } = this.req.body;

        try {
            const item = await Program.findOne({
                where: { id },
                attributes: ["id", "name", "desc", "createdAt", "updatedAt"],
            });

            if (!item) {
                return null; // kalau tidak ketemu
            }

            const row = item.toJSON();
            return {
                id: row.id,
                name: row.name,
                desc: row.desc,
                createdAt: moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            };
        } catch (error) {
            console.error("🔥 ERROR detail_program :", error);
            return null;
        }
    }
}

module.exports = Model_r;

