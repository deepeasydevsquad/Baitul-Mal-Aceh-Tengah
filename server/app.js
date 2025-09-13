const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const process = require("process");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS dinamis, izinkan semua origin yang datang
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // untuk Postman, curl, dll.
            return callback(null, origin); // izinkan semua origin
        },
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionDuration = 3600000; // 1 jam

app.use(
    session({
        secret: "OutletTacob4",
        name: "amra_sessid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: new Date(Date.now() + sessionDuration),
            maxAge: sessionDuration,
        },
    })
);

app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Load router dinamis
const arr_router = [
    "auth",
    "administrator",
    "register",
    "request_keanggotaan",
    "otp",
    "running_text",
];

const arr = {};
arr_router.forEach((e) => {
    if (typeof e === "object" && Object.keys(e.list).length > 0) {
        for (let x in e.list) {
            arr[
                "router_" + e.list[x]
            ] = require(`./router/${e.folder}/${e.list[x]}/index`);
        }
    } else {
        arr["router_" + e] = require(`./router/router_${e}`);
    }
});

// Load model dan sync
const db = require("./models");

(async () => {
    await db.sequelize.sync();
})();

// Gunakan semua router yang sudah dimuat
for (let x in arr) {
    app.use(arr[x]);
}

// Middleware untuk error handler
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
    console.log("Server Running On Port " + port);
});

// module.exports = app;

