const { Running_text } = require("../../../models");
const { Op } = require("sequelize");

class model_r {
    constructor(req) {
        this.req = req;
    }

    async content_text(search, perpage, pageNumber, activeOnly = false) {
        try {
            const page = parseInt(pageNumber, 10) || 1;
            const limit = parseInt(perpage, 10) || 100;
            const offset = (page - 1) * limit;

            const whereCondition = {};

            // Filter pencarian
            if (search) {
                whereCondition.content = {
                    [Op.like]: `%${search}%`,
                };
            }

            // Filter hanya yang aktif
            if (activeOnly) {
                whereCondition.is_active = true;
            }

            // urutkan berdasarkan ID terbaru untuk konsistensi tampilan tabel
            const order = activeOnly
                ? [
                      ["order", "ASC"],
                      ["id", "ASC"],
                  ]
                : [["id", "DESC"]];

            const { count, rows } = await Running_text.findAndCountAll({
                where: whereCondition,
                limit: limit,
                offset: offset,
                order: order,
            });

            return { data: rows, total: count };
        } catch (error) {
            console.error("Error in model_r.content_text:", error);
            throw error;
        }
    }

    async get_info_add() {
        try {
            return {
                success: true,
                message: "Info untuk form add berhasil diambil",
                data: {},
            };
        } catch (error) {
            console.error("Error in model_r.get_info_add:", error);
            throw error;
        }
    }

    async get_info_edit(id) {
        try {
            const runningText = await Running_text.findByPk(id);

            if (!runningText) {
                return {
                    success: false,
                    message: "Data tidak ditemukan",
                };
            }

            return {
                success: true,
                message: "Info untuk form edit berhasil diambil",
                data: runningText,
            };
        } catch (error) {
            console.error("Error in model_r.get_info_edit:", error);
            throw error;
        }
    }
}

module.exports = model_r;
