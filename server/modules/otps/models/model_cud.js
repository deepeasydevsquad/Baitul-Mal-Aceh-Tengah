const moment = require("moment");
const { sequelize, Otp } = require("../../../models");

class Model_cud {
    constructor(req) {
        this.req = req;
        this.t;
        this.state;
    }

    async initialize() {
        // initialize transaction
        this.t = await sequelize.transaction();
        this.state = true;
    }

    async savedOtp(i) {
        // initialize general property
        await this.initialize();
        // insert process
        try {
            // inactive where mobile number
            await Otp.update(
                { otp_status: "inactive" },
                {
                    where: {
                        whatsapp_number: i.whatsapp_number,
                        otp_status: "active",
                        // expired_time: { [Op.gt]: new Date() }, // Masih berlaku
                    },
                },
                {
                    transaction: this.t,
                }
            );

            const myNextDate = moment(new Date())
                .add(1, "days")
                .format("YYYY-MM-DD HH:mm:ss");

            // insert to database new oTP
            await Otp.create(
                {
                    otp: i.otp_code,
                    otp_time: i.expired_time,
                    whatsapp_number: i.whatsapp_number,
                    otp_status: "active",
                },
                {
                    transaction: this.t,
                }
            );
        } catch (error) {
            this.state = false;
        }
    }

    async response() {
        if (this.state) {
            // commit
            await this.t.commit();
            return true;
        } else {
            // rollback
            await this.t.rollback();
            return false;
        }
    }
}

module.exports = Model_cud;

