const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config();

const todoRoute = require("./routes/todoRoute");
const dbUrl = process.env.DB_URL;
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// mongoose
//   .connect(dbUrl)
//   .then(() => {
//     console.log("db connected sucessfu");
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

app.use("/", todoRoute);

const connectAndStartServer = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("DB is connected successfully");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

connectAndStartServer();
