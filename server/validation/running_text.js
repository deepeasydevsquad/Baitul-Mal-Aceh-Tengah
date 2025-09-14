const { Running_text } = require("../models");

const validation = {};

validation.content = async (value) => {
    
    // Cek apakah konten kosong
    if (!value || !value.trim()) {
        throw new Error("Konten tidak boleh kosong");
    }
    
    const trimmedContent = value.trim();
    
    // Validasi panjang minimal
    if (trimmedContent.length < 5) {
        throw new Error("Konten minimal 5 karakter");
    }
    
    // Validasi panjang maksimal
    if (trimmedContent.length > 500) {
        throw new Error("Konten maksimal 500 karakter");
    }
    
    return true;
};

// Validasi untuk konten unik (tidak duplikat)
validation.content_unique = async (value, { req }) => {
    if (!value || !value.trim()) {
        return true; // Skip jika kosong, akan ditangani oleh validasi content
    }
    
    const trimmedContent = value.trim();
    
    // Cek duplikasi dengan kondisi berbeda untuk add vs edit
    let whereCondition = { content: trimmedContent };
    
    if (req.body.id) {
        const { Op } = require("sequelize");
        whereCondition.id = { [Op.ne]: parseInt(req.body.id, 10) };
    }
    
    const existingText = await Running_text.findOne({
        where: whereCondition
    });
    
    if (existingText) {
        throw new Error("Teks dengan konten yang sama sudah ada");
    }
    
    return true;
};

// Validasi untuk ID yang valid
validation.id_exists = async (value) => {
    const id = parseInt(value, 10);
    
    if (isNaN(id) || id <= 0) {
        throw new Error("ID tidak valid");
    }
    
    const runningText = await Running_text.findByPk(id);
    if (!runningText) {
        throw new Error("Data tidak ditemukan");
    }
    
    return true;
};

// Validasi untuk ID yang aktif
validation.id_active = async (value) => {
    const id = parseInt(value, 10);
    
    if (isNaN(id) || id <= 0) {
        throw new Error("ID tidak valid");
    }
    
    const runningText = await Running_text.findByPk(id);
    if (!runningText) {
        throw new Error("Data tidak ditemukan");
    }
    
    if (!runningText.is_active) {
        throw new Error("Data tidak aktif");
    }
    
    return true;
};

// Validasi untuk array order
validation.order_array = async (value) => {
    if (!Array.isArray(value)) {
        throw new Error("Order harus berupa array");
    }
    
    if (value.length === 0) {
        throw new Error("Order tidak boleh kosong");
    }
    
    // Validasi setiap ID dalam array
    for (let i = 0; i < value.length; i++) {
        const id = parseInt(value[i], 10);
        if (isNaN(id) || id <= 0) {
            throw new Error(`ID pada posisi ${i + 1} tidak valid`);
        }
        
        // Cek apakah ID ada di database
        const runningText = await Running_text.findByPk(id);
        if (!runningText) {
            throw new Error(`Data dengan ID ${id} tidak ditemukan`);
        }
        
        // Cek apakah ID aktif (hanya yang aktif yang bisa diurutkan)
        if (!runningText.is_active) {
            throw new Error(`Data dengan ID ${id} tidak aktif dan tidak bisa diurutkan`);
        }
    }
    
    // Cek duplikasi ID dalam array
    const uniqueIds = [...new Set(value)];
    if (uniqueIds.length !== value.length) {
        throw new Error("Terdapat ID yang duplikat dalam array order");
    }
    
    return true;
};


// Validasi khusus untuk pencarian (search)
validation.search_query = async (value) => {
    // Search boleh kosong
    if (!value || value.trim() === '') {
        return true;
    }
    
    const trimmedValue = value.trim();
    
    // Validasi panjang search query
    if (trimmedValue.length > 100) {
        throw new Error("Query pencarian terlalu panjang (maksimal 100 karakter)");
    }
    
    // Validasi karakter yang tidak diizinkan (opsional, sesuai kebutuhan)
    // Misalnya mencegah SQL injection patterns
    const dangerousPatterns = [
        /(\bUNION\b)|(\bSELECT\b)|(\bINSERT\b)|(\bUPDATE\b)|(\bDELETE\b)|(\bDROP\b)/i,
        /[<>]/g // Mencegah XSS basic
    ];
    
    for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmedValue)) {
            throw new Error("Query pencarian mengandung karakter yang tidak diizinkan");
        }
    }
    
    return true;
};

module.exports = validation;