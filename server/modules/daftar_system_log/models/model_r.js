"use strict";

const { System_log, User } = require("../../../models");
const { Op } = require("sequelize");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async list_system_log() {
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

        // filter search kalau dikirim (misal by id)
        if (body.search && body.search !== "") {
            where.id = { [Op.like]: `%${body.search}%` };
        }

        try {
            const q = await System_log.findAndCountAll({
                attributes: [
                    "id",
                    "msg",
                    "user_id",
                    "ip",
                    "createdAt",
                    "updatedAt",
                ],
                where,
                include: [
                    {
                        model: User,
                        attributes: ["id", "name"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit,
                offset: (page - 1) * limit,
            });

            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    msg: row.msg,
                    name: row.User ? row.User.name : null,
                    ip: row.ip,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                };
            });

            return {
                data,
                total,
            };
        } catch (error) {
            console.error("ERROR in daftar system log:", error);
            return {
                data: [],
                total: 0,
            };
        }
    }
}

module.exports = Model_r;
