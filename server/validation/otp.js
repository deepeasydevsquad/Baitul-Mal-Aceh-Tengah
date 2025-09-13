const validation = {};

/* 
    Fungsi untuk mengecek nomor whatsapp
*/
validation.check_whatsappnumber = async (whatsappNumber) => {
    if (!/^(08)\d{8,10}$/.test(whatsappNumber)) {
        throw new Error(
            "Nomor WhatsApp harus berformat Indonesia (08) dan memiliki 10-12 digit."
        );
    }
    return true;
};

module.exports = validation;
