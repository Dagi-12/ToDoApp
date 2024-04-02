const express = require("express");
const router = express.Router();
const todo = require("../models/todo");
const moment = require("moment");

router.get("/", async (req, res, next) => {
  try {
    //for acceding order we use 1
    const todos = await todo.find({}).sort({ createdAt: 1 });

    res.locals.moment = moment;

    res.render("index", { title: "List todo", todos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/add-todo", (req, res) => {
  try {
    res.render("newTodo", { title: "Add todo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/update-todo", async (req, res) => {
  try {
    const { id } = req.query;
    const todoo = await todo.findById(id);
    res.render("updateTodo", { title: "Update todo", todoo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/delete-todo", (req, res, next) => {
  try {
    const { id } = req.query;
    res.render("deleteTodo", { title: "Delete todo", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add-todo", async (req, res, next) => {
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

router.post("/update-todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    const findTodo = await todo.findById(id);
    if (!findTodo) {
      res.status(404).send({ message: "Todo not found" });
    }

    findTodo.title = title;
    findTodo.desc = desc;
    await findTodo.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/confirm-delete", async (req, res) => {
  try {
    const { id, confirm } = req.query;
    if (confirm === "yes") {
      await todo.findByIdAndDelete(id);
    }
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
