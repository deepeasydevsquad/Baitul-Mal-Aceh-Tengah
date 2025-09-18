const { Op, Setting, Otp } = require("../../../models");

class Model_r {
    constructor(req) {
        this.req = req;
    }

    async countOtp(startOfDay) {
        const { whatsappNumber } = this.req.body;
        return await Otp.count({
            where: {
                whatsapp_number: whatsappNumber,
                createdAt: { [Op.gte]: startOfDay },
            },
        });
    }

    async wapisender_api_device_key() {
        var data = {};
        await Setting.findAll({
            where: {
                name: { [Op.in]: ["api_key", "device_key"] },
            },
        }).then(async (value) => {
            await Promise.all(
                await value.map(async (e) => {
                    data[e.name] = e.value;
                })
            );
        });
        return data;
    }
}

module.exports = Model_r;

