"use strict";

const {
    sequelize,
    Op,
    System_log_surveyor,
    Surveyor,
    Sequelize,
} = require("../../../models");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false;
        this.message = null;
        this.t = null;
    }

    async daftar_surveyor() {
        const body = this.req.body;
        const limit = parseInt(body.perpage, 10) || 10;
        const page =
            body.pageNumber && body.pageNumber !== "0"
                ? parseInt(body.pageNumber, 10)
                : 1;

        const where = body.search
            ? {
                  [Op.or]: [{ name: { [Op.like]: `%${body.search}%` } }],
              }
            : {};

        const sql = {
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: ["id", "message", "ip", "createdAt", "updatedAt"],
            include: [
                {
                    model: Surveyor,
                    attributes: ["id", "name"],
                    where: where,
                    required: true,
                },
            ],
        };

        try {
            const q = await System_log_surveyor.findAndCountAll(sql);
            const total = q.count;
            console.log("total", total);

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
            console.log("data", data);
            return { data, total };
        } catch (error) {
            console.error("🔥 ERROR in daftar request member:", error);
            return { data: [], total: 0 };
        }
    }
}

module.exports = Model_r;
