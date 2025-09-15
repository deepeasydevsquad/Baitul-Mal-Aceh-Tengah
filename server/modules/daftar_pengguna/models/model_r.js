"use strict";

const { User, sequelize, Grup } = require("../../../models");
const { Op } = require("sequelize");
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

async daftar_pengguna() {
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

    try {
        const q = await User.findAndCountAll({
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: [
                "id",
                "grup_id",
                "name",
                "kode",
                "username",
                // ⚠️ password sebaiknya jangan dikirim
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: Grup,
                    attributes: ["id", "name"],
                },
            ],
            where,
        });

        const total = q.count;
        const data = q.rows.map((item) => {
            const row = item.toJSON();
            return {
                id: row.id,
                grup_id: row.grup_id,
                grup: row.Grup ? row.Grup.name : null, // ambil nama grup
                name: row.name,
                kode: row.kode,
                username: row.username,
                createdAt: moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            };
        });

        return {
            data,
            total,
        };
    } catch (error) {
        console.error("🔥 ERROR daftar_pengguna :", error);
        return {
            data: [],
            total: 0,
        };
    }
}

    
  async list_grup() {
    try {
      const grup = await Grup.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });

      return grup;
    } catch (error) {
        console.error("Error fetching grup:", error);
        throw new Error("Failed to fetch grup");
    }
  }

    async detail_pengguna() {
        const { id } = this.req.body;

        try {
            const item = await User.findOne({
                where: { id },
                attributes: ["id", "name", "grup_id", "kode", "username", "password", "createdAt", "updatedAt"],
            });

            if (!item) {
                return null;
            }

            const row = item.toJSON();
            return {
                id: row.id,
                name: row.name,
                grup_id: row.grup_id,
                kode: row.kode,
                username: row.username,
                password: row.password,
                createdAt: moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            };
        } catch (error) {
            console.error("🔥 ERROR detail_pengguna :", error);
            return null;
        }
    }
}

module.exports = Model_r;
