const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config({
  path: "./.env",
});
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
const todoSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: String,
  },
  { timestamps: true }
);
const todo = mongoose.model("todo", todoSchema);

app.get("/", async(req, res, next) => {
  try {
    const todos= await todo.find({})
    res.render("index", { title: "List todo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/add-todo", (req, res) => {
  try {
    res.render("newTodo", { title: "Add todo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/update-todo", (req, res) => {
  try {
    res.render("updateTodo", { title: "Update todo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/delete-todo", (req, res, next) => {
  try {
    res.render("deleteTodo", { title: "Delete todo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/add-todo", async (req, res, next) => {
  try {
    const { title, desc } = req.body;

    if (!title || title === null) {
      return res.status(400).send({ message: "Title is required " });
    }
    const newTodo = new todo({ title, desc });
    await newTodo.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

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
