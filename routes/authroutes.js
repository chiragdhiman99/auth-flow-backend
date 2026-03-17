const express = require("express");
const routes = express.Router();
const authcontroller = require("../controllers/authcontroller");
const passport = require("passport");
const jwt = require("jsonwebtoken");


routes.get("/me", authcontroller.getMe)

routes.post("/signup", authcontroller.signup);
routes.post("/login", authcontroller.login);

routes.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
}));

routes.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`)
    }
)

module.exports = routes;