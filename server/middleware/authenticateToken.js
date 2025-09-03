const jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token sudah kadaluwarsa" });
        } else {
          return res.status(403).json({ message: "Token tidak valid" });
        }
      }
      req.user = user;
      next();
    });
  },
};
