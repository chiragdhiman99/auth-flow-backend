const express = require("express");
const app = express();
const connectdb = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes/authroutes");
const dns = require("dns");
const passport = require("passport");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();
require("./config/passport");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use("/api/auth", routes);

connectdb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});