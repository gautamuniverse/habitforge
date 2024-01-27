import express from "express";
import HabitController from "../controller/habits.controller.js";

const habitRouter = express.Router();

const habitController = new HabitController();

//Add Habit view
habitRouter.get("/add-habit", (req, res, next) => {
  res.render("addHabit");
});

//Update Habit view
habitRouter.get("/update-habit/:id", (req, res, next) =>
  habitController.updateHabitView(req, res, next)
);

// Add habit
habitRouter.post("/add", (req, res, next) =>
  habitController.addHabit(req, res, next)
);

// One Week View of the habits
habitRouter.get("/week", (req, res, next) =>
  habitController.oneWeek(req, res, next)
);

// Update habit details by habit Id
habitRouter.put("/:id", (req, res, next) =>
  habitController.updateHabit(req, res, next)
);

//Handle update habit requests coming from the habits weekly view
habitRouter.put("/week/:id", (req, res, next) =>
  habitController.updateWeekHabit(req, res, next)
);

//Delete a habit by habit id
habitRouter.get("/delete/:id", (req, res, next) =>
  habitController.deleteHabit(req, res, next)
);

export default habitRouter;
