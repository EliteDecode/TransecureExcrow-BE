const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { deleteUserTokenIfDelayed } = require("./utils/utils");

const app = express();
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://transecureescrow.vercel.app");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// })
app.use(morgan("common"));
// app.use(cors());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH",
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "token",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "Access-Control-Allow-Credentials",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ limit: "1000000mb", extended: true }));
app.use(express.json({ limit: "1000000mb", extended: true }));

const db = require("./configs/constants").mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//routes
app.use("/api/v1/auth", require("./api-routes/auths"));
app.use("/api/v1/admin", require("./api-routes/admin"));
app.use("/api/v1/products", require("./api-routes/products"));
app.use("/api/v1/users", require("./api-routes/users"));
app.use("/api/v1/message", require("./api-routes/message-route"));
app.use("/api/v1/support", require("./api-routes/support"));
app.use("/api/v1/referrals", require("./api-routes/referrals"));
app.use("/api/v1/transactions", require("./api-routes/transactions"));

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
  });
}

//for testing of file uploads in base64
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

setInterval(deleteUserTokenIfDelayed, 60 * 1000); // Run every minute

const PORT = process.env.PORT || 5005;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("Server Running on port " + PORT);
});
