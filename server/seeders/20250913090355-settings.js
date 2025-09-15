"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Settings",
            [
                {
                    name: "api_key",
                    value: "4BQEL001HE7FCFFCSTYHFNNAS9D2FENS",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "device_key",
                    value: "VFAURD",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "whatsapp_number",
                    value: "62895330275849",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Settings", null, {});
    },
};

