import mongoose from "mongoose";
import HabitRepository from "../model/habits.repository.js";
import expressEjsLayouts from "express-ejs-layouts";
import { ObjectId } from "mongodb";
import HabitModel from "../model/habits.schema.js";

export default class HabitController {
  constructor() {
    this.habitRepository = new HabitRepository();
  }

  //Function to handle the homepage
  async homepage(req, res, next) {
    try {
      const result = await this.habitRepository.homepage();
      if (result.success) return res.status(200).render("homepage", { result });
      else return res.status(404).render("homepage", { result });
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  //Function to handle the one week view
  async oneWeek(req, res, next) {
    try {
      const now = new Date();

      // (0-31)
      const presentDate = now.getDate();
      // (0-11)
      const month = now.getMonth();

      // Get the year (xxxx)
      const year = now.getFullYear();

      // Get month name
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = months[now.getMonth()];

      // Get day name
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const presentDay = days[now.getDay()];

      
      //Week start date
      let weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - 7);
      const weekStartDayName = days[weekStartDate.getDay()];
      weekStartDate = new Date(weekStartDate).getDate() + 1;

      // Get the month end date
      let monthEndDate = new Date(year, month + 1, 0).getDate();

      // Check if weekStartDate exceeds the month end date
      if (weekStartDate > monthEndDate) {
        weekStartDate = 1; // Reset to 1 if it exceeds
      }


      //Get all the habits
      const result = await this.habitRepository.getAllHabits();
      if (result.success)
        return res.status(200).render("weekly", {
          year: year,
          month: monthName,
          monthNumber: month,
          presentDate: presentDate,
          presentDay: presentDay,
          weekStartDate: weekStartDate,
          weekStartDayName: weekStartDayName,
          data: result.msg,
          totalHabits: result.msg.length,
        });
      else
        return res
          .status(404)
          .render("404page", { errorMsg: "No habits found, add some!" });
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  //Function to add a habit
  async addHabit(req, res, next) {
    try {
      const { habitTitle, timing, datesArray } = req.body;

      //Get the datesArray and convert each date to ISO date format and then map according to schema
      const actions = datesArray.map((date) => {
        return {
          date: new Date(date),
          action: "Done",
        };
      });
      const data = {
        habitTitle,
        timing,
        actions,
      };

      const result = await this.habitRepository.addHabit(data);

      // console.log(result);
      if (result.success) {
        return res.status(201).send(result);
      } else {
        return res.status(404).send(result);
      }
      // if (!habitTitle) return res.status.send();
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  //Function to handle the updateHabit View
  async updateHabitView(req, res, next) {
    try {
      const result = await this.habitRepository.getHabitDetails(req.params.id);

      //get the dates separately for showing in the update view
      let dates = [];
      result.msg.actions.forEach((i) => {
        let date;
        if (i && i.action === "Done") {
          date = i.date.toISOString().split("T")[0];
        }
        dates.push(date);
      });

      if (result.success) {
        return res
          .status(201)
          .render("updateHabit", { data: result.msg, dates });
      } else {
        return res.status(404).render("updateHabit", { updateMsg: result.msg });
      }
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  // Function to update a habit details
  async updateHabit(req, res, next) {
    try {
      const { habitTitle, timing, datesArray } = req.body;

      //Get the dates that are marked as action other than "Done"
      const findDoc = await HabitModel.findById(req.params.id);
      let foundDates = [];
      if (findDoc) {
        findDoc.actions.forEach((i) => {
          if (i && i.action === "Not Done") {
            foundDates.push({
              date: new Date(i.date).toISOString(),
              action: "Not Done",
            });
          }
        });
      }

      //Remove the existing actions array
      const habit = await HabitModel.findById(req.params.id);

      if (!habit) {
        throw new Error("Document not found");
      }

      // Remove the 'actions' field from the document
      habit.actions = undefined; 

      // Save the updated document
      const updatedHabit = await habit.save();

      //Get the datesArray and convert each date to ISO date format and then map according to schema
      const actions = datesArray.map((date) => {
        if (date !== "") {
          return {
            date: new Date(date),
            action: "Done",
          };
        }
      });
      const data = {
        habitTitle,
        timing,
        actions,
      };
      const result = await this.habitRepository.updateHabitDetails(
        req.params.id,
        data
      );
      //Now readd the dates we extracted in the starting
      const addDatesBack = await HabitModel.updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $push: {
            actions: {
              $each: foundDates,
            },
          },
        }
      );

      if (result.success) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send(result);
      }
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  // Function to handle the update habit requests coming from the week view
  async updateWeekHabit(req, res, next) {
    try {
      //Handle undefined body
      if (!req.body)
        return res.status(404).render("404page", {
          errorMsg: "The request body is undefined!",
        });

      //get the common data
      const { isNewDate, action, actionDate } = req.body;
      const habitId = req.params.id;

      //Validations
      if (!habitId || isNewDate === undefined || !action || !actionDate)
        return res.status(404).render("404page", {
          errorMsg: "Bad request!",
        });

      let data;
      let result;
      //Handle the newDate request
      if (isNewDate == "true") {
        //Check if there already is present an action field with "None" with the current date
        const findAction = await HabitModel.findOne({
          _id: new ObjectId(habitId),
          "actions.date": new Date(actionDate).toISOString(),
        });
        //an existing record found wiht the current date, mark it as "Done"
        if (findAction) {
          const query = {
            _id: new ObjectId(habitId),
            "actions.date": new Date(actionDate).toISOString(),
          };
          data = {
            $set: {
              "actions.$.action": "Done",
            },
          };

          result = await this.habitRepository.updateWeekHabitDetails(
            query,
            data
          );
          return;
        }

        //else We have to add a new action into the actions array of the habit with id habitId
        else {
          data = {
            $push: {
              actions: {
                date: new Date(actionDate),
                action: "Done",
              },
            },
          };
          const query = {
            _id: new ObjectId(habitId),
          };
          result = await this.habitRepository.updateWeekHabitDetails(
            query,
            data
          );
        }
      } else {
        //get the action id
        const actionId = req.body.actionId;
        const query = {
          _id: new ObjectId(habitId),
          "actions.date": new Date(actionDate).toISOString(),
        };
        data = {
          $set: {
            "actions.$.action": action,
          },
        };

        result = await this.habitRepository.updateWeekHabitDetails(query, data);
      }

      if (result.success) {
        return res.status(200).send(result.msg);
      } else {
        return res.status(404).render("404page", { errorMsg: null });
      }
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }

  // function to delete one habit
  async deleteHabit(req, res, next) {
    try {
      const result = await this.habitRepository.deleteHabit(req.params.id);
      if (result.success)
        return res.status(200).render("homepage", { deleteMsg: result.msg });
      else return res.status(404).render("homepage", { deleteMsg: result.msg });
    } catch (err) {
      next(err); //pass the error to the errorHandler
    }
  }
}
