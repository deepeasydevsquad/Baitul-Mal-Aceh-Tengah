"use strict";

const { Request_member, sequelize, Desa } = require("../../../models");
const moment = require("moment");

class Model_r {
    constructor(req) {
        this.req = req;
        this.state = false; // default gagal
        this.message = null; // pesan default
        this.t = null; // simpan transaction
    }

    async daftar_request() {
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
            where.fullname = { [Op.like]: `%${body.search}%` };
        }

        const include = [
            {
                model: Desa,
                attributes: ["id", "name"],
            },
        ];

        const sql = {
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
            attributes: [
                "id",
                "status",
                "tipe",
                "fullname",
                "nomor_ktp",
                "nomor_kk",
                "whatsapp_number",
                "birth_date",
                "alamat",
                "username",
                "createdAt",
                "updatedAt",
            ],
            where,
            include,
        };

        try {
            const q = await Request_member.findAndCountAll(sql);
            const total = q.count;
            const data = q.rows.map((item) => {
                const row = item.toJSON();
                return {
                    id: row.id,
                    status: row.status,
                    tipe: row.tipe,
                    fullname: row.fullname,
                    nomor_ktp: row.nomor_ktp,
                    nomor_kk: row.nomor_kk,
                    whatsapp_number: row.whatsapp_number,
                    birth_date: row.birth_date,
                    alamat: row.alamat,
                    username: row.username,
                    nama_desa: row.Desa?.name || null,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                };
            });
            return {
                data,
                total,
            };
        } catch (error) {
            console.error("🔥 ERROR in daftar request member:", error);
            return {
                data: [],
                total: 0,
            };
        }
    }
}

module.exports = Model_r;

