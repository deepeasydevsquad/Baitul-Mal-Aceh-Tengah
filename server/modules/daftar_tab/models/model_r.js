"use strict";

const { Tab, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {

    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_tab() {
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
            attributes: ["id","name","icon", "path", "desc"],
            where,
        };

        try {
            const q = await Tab.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    name: row.name,
                    icon: row.icon,
                    path: row.path,
                    desc: row.desc
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

    async detail_tab() {
        const { id } = this.req.body;

        try {
            const item = await Tab.findOne({
                where: { id },
                attributes: ["id", "desc"],
            });

            if (!item) {
                return null; // kalau tidak ketemu
            }

            const row = item.toJSON();
            return {
                id: row.id,
                desc: row.desc            };
        } catch (error) {
            console.error("🔥 ERROR detail_tab :", error);
            return null;
        }
    }
}

module.exports = Model_r;

