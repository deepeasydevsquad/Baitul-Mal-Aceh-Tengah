"use strict";

const { sequelize, System_log_surveyor, Surveyor, Sequelize } = require("../../../models");
const { Op } = Sequelize;
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false;
        this.message = null;
        this.t = null;
    }

    async system_log_surveyor() {
        const body = this.req.body;
        const limit = parseInt(body.perpage) || 10;
        const page = body.pageNumber && body.pageNumber !== "0"
            ? parseInt(body.pageNumber)
            : 1;

        let where = {};

        if (body.search && body.search !== "") {
            where.fullname = { [Op.like]: `%${body.search}%` }; // ganti sesuai kolom
        }

        const include = [
            {
                model: Surveyor,
                attributes: ["id", "name"],
            },
        ];

        const sql = {
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: ["id", "message", "ip", "createdAt", "updatedAt"],
            where,
            include,
        };

        try {
            const q = await System_log_surveyor.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    message: row.message,
                    ip: row.ip,
                    nama_surveyor: row.Surveyor?.name || null,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                };
            });
            return { data, total };
        } catch (error) {
            console.error("🔥 ERROR in daftar request member:", error);
            return { data: [], total: 0 };
        }
    }
}

module.exports = Model_r;
