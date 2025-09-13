const { Running_text, sequelize } = require("../../../models");

class model_cud {
    async add_running_text(req) {
        try {
            console.log(
                "[model_cud.js] add_running_text called with:",
                req.body
            );

            const { content } = req.body;

            if (!content || !content.trim()) {
                console.error("[model_cud.js] Content is empty or null");
                return {
                    success: false,
                    message: "Konten tidak boleh kosong.",
                };
            }

            const trimmedContent = content.trim();

            if (trimmedContent.length < 5) {
                return {
                    success: false,
                    message: "Konten minimal 5 karakter.",
                };
            }

            if (trimmedContent.length > 500) {
                return {
                    success: false,
                    message: "Konten maksimal 500 karakter.",
                };
            }

            const existingText = await Running_text.findOne({
                where: { content: trimmedContent },
            });

            if (existingText) {
                return {
                    success: false,
                    message: "Teks dengan konten yang sama sudah ada.",
                };
            }

            // Buat record baru dengan status non-aktif dan order 0
            const newText = await Running_text.create({
                content: trimmedContent,
                is_active: false,
                order: 0,
            });

            console.log("[model_cud.js] New running text created:", {
                id: newText.id,
                content: newText.content,
                is_active: newText.is_active,
                order: newText.order,
            });

            return { success: true, data: newText };
        } catch (error) {
            console.error(
                "[model_cud.js] GAGAL menyimpan data ke database:",
                error
            );
            return {
                success: false,
                message:
                    error.message || "Terjadi kesalahan saat menyimpan data.",
            };
        }
    }

    async edit_running_text(id, req) {
        try {
            console.log(
                "[model_cud.js] edit_running_text called for ID:",
                id,
                "with data:",
                req.body
            );

            const { content } = req.body;

            if (!content || !content.trim()) {
                console.error("[model_cud.js] Content is empty or null");
                return {
                    success: false,
                    message: "Konten tidak boleh kosong.",
                };
            }

            const trimmedContent = content.trim();

            if (trimmedContent.length < 5) {
                return {
                    success: false,
                    message: "Konten minimal 5 karakter.",
                };
            }

            if (trimmedContent.length > 500) {
                return {
                    success: false,
                    message: "Konten maksimal 500 karakter.",
                };
            }

            // Cari data yang akan diedit
            const textToEdit = await Running_text.findByPk(id);
            if (!textToEdit) {
                console.error("[model_cud.js] Text not found for ID:", id);
                return { success: false, message: "Data tidak ditemukan." };
            }

            // Cek duplikasi konten
            const existingText = await Running_text.findOne({
                where: {
                    content: trimmedContent,
                    id: { [sequelize.Sequelize.Op.ne]: id },
                },
            });

            if (existingText) {
                return {
                    success: false,
                    message: "Teks dengan konten yang sama sudah ada.",
                };
            }

            // Update konten
            textToEdit.content = trimmedContent;
            await textToEdit.save();

            console.log("[model_cud.js] Running text updated:", {
                id: textToEdit.id,
                content: textToEdit.content,
                is_active: textToEdit.is_active,
                order: textToEdit.order,
            });

            return { success: true, data: textToEdit };
        } catch (error) {
            console.error("[model_cud.js] GAGAL mengupdate data:", error);
            return {
                success: false,
                message:
                    error.message || "Terjadi kesalahan saat mengupdate data.",
            };
        }
    }

    async toggle_status(id) {
        try {
            console.log("[model_cud.js] toggle_status called for ID:", id);

            const text = await Running_text.findByPk(id);
            if (!text) {
                console.error("[model_cud.js] Text not found for ID:", id);
                return { success: false, message: "Data tidak ditemukan." };
            }

            const oldStatus = text.is_active;
            text.is_active = !text.is_active;

            await text.save();

            console.log(
                "[model_cud.js] Status toggled for ID:",
                id,
                "from",
                oldStatus,
                "to",
                text.is_active
            );

            return { success: true, data: text };
        } catch (error) {
            console.error("[model_cud.js] GAGAL mengubah status:", error);
            return {
                success: false,
                message:
                    error.message || "Terjadi kesalahan saat mengubah status.",
            };
        }
    }

    async update_order(orderArray) {
        console.log("=== UPDATE ORDER MODEL START ===");
        console.log("Received orderArray:", orderArray);
        console.log("Type:", typeof orderArray);
        console.log("Is Array:", Array.isArray(orderArray));

        if (!orderArray || !Array.isArray(orderArray)) {
            console.error("Invalid orderArray - not an array");
            throw new Error("Data urutan tidak valid: harus berupa array.");
        }

        if (orderArray.length === 0) {
            console.log("Empty array, no updates needed");
            return { success: true, updatedCount: 0 };
        }

        try {
            console.log("Processing order updates...");
            let updatedCount = 0;

            for (let i = 0; i < orderArray.length; i++) {
                const id = parseInt(orderArray[i], 10);
                const newOrder = i + 1; // Urutan dimulai dari 1

                console.log(`Processing ID: ${id}, New Order: ${newOrder}`);

                if (isNaN(id)) {
                    console.warn(`Skipping invalid ID: ${orderArray[i]}`);
                    continue;
                }

                // Cek apakah record ada dan aktif
                const existingRecord = await Running_text.findByPk(id);
                if (!existingRecord) {
                    console.warn(`Record with ID ${id} not found, skipping`);
                    continue;
                }

                if (!existingRecord.is_active) {
                    console.warn(
                        `Record with ID ${id} is not active, skipping`
                    );
                    continue;
                }

                console.log(
                    `Current order for ID ${id}:`,
                    existingRecord.order
                );

                // Update order
                const [affectedRows] = await Running_text.update(
                    { order: newOrder },
                    {
                        where: { id: id },
                        logging: (sql, timing) => {
                            console.log(`SQL Executed: ${sql}`);
                            if (timing) console.log(`Timing: ${timing}ms`);
                        },
                    }
                );

                console.log(
                    `Update result for ID ${id}: ${affectedRows} rows affected`
                );

                if (affectedRows > 0) {
                    updatedCount++;
                    // Verifikasi update
                    const updatedRecord = await Running_text.findByPk(id);
                    console.log(
                        `Verified order for ID ${id} after update:`,
                        updatedRecord.order
                    );
                }
            }

            console.log("=== UPDATE ORDER MODEL SUCCESS ===");
            return { success: true, updatedCount };
        } catch (error) {
            console.error("=== UPDATE ORDER MODEL ERROR ===");
            console.error("Error details:", error);
            console.error("Stack trace:", error.stack);
            throw error;
        }
    }

    async delete_running_text(id) {
        try {
            console.log(
                "[model_cud.js] delete_running_text called for ID:",
                id
            );

            const text = await Running_text.findByPk(id);
            if (!text) {
                console.error("[model_cud.js] Text not found for ID:", id);
                return { success: false, message: "Data tidak ditemukan." };
            }

            // Simpan info untuk log
            const deletedInfo = {
                id: text.id,
                content:
                    text.content.substring(0, 50) +
                    (text.content.length > 50 ? "..." : ""),
                is_active: text.is_active,
            };

            await text.destroy();

            console.log(
                "[model_cud.js] Running text deleted successfully:",
                deletedInfo
            );

            return {
                success: true,
                message: "Data berhasil dihapus.",
                data: deletedInfo,
            };
        } catch (error) {
            console.error("[model_cud.js] GAGAL menghapus data:", error);
            return {
                success: false,
                message:
                    error.message || "Terjadi kesalahan saat menghapus data.",
            };
        }
    }

    response(success, message, data = null) {
        const responseObject = {
            success: success,
            message: message,
        };
        if (data !== null) {
            responseObject.data = data;
        }
        console.log("[model_cud.js] Generating response:", responseObject);
        return responseObject;
    }
}

module.exports = model_cud;