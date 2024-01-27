import mongoose from "mongoose";
import HabitModel from "./habits.schema.js";
import { ObjectId } from "mongodb";

export default class HabitRepository {
  //Function to display habits on the homepage
  async homepage() {
    try {
      const getAllHabits = await HabitModel.find({});
      if (getAllHabits.length > 0) return { success: true, msg: getAllHabits };
      else return { success: false, msg: "No habits found, add some!" };
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong with the database");
    }
  }

  //Function to add a new habit
  async addHabit(habit) {
    try {
      const addNewHabit = new HabitModel(habit);
      await addNewHabit.save();
      return { success: true, msg: addNewHabit };
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong with the database");
    }
  }

  //Function to get all the habits
  async getAllHabits() {
    try {
      const habits = await HabitModel.find({})
        .sort({ "actions.date": "desc" })
        .exec(); //getting all the habits in the descending order of dates

      if (habits.length > 0) return { success: true, msg: habits };
      else
        return { success: false, msg: "No habits found, please add a habit!" };
    } catch (err) {
      throw new Error("Something went wrong with the database");
    }
  }

  //function to get one specific habit by id
  async getHabitDetails(_id) {
    try {
      const getHabit = await HabitModel.findById(_id);
      if (getHabit) return { success: true, msg: getHabit };
      else return { success: false, msg: "Habit not found!" };
    } catch (err) {
      throw new Error("Something went wrong with the database");
    }
  }

  //function to get delete one habit
  async deleteHabit(_id) {
    try {
      const getHabit = await HabitModel.deleteOne({ _id: new ObjectId(_id) });
      if (getHabit.deletedCount > 0)
        return { success: true, msg: "Habit delete successfully!" };
      else
        return {
          success: false,
          msg: "Habit not found or could not be deleted!!",
        };
    } catch (err) {
      throw new Error("Something went wrong with the database");
    }
  }

  //Function to update a specific habit's details
  async updateHabitDetails(_id, data) {
    try {
      const updateHabit = await HabitModel.updateOne(
        { _id: new ObjectId(_id) },
        data,
        {upsert: true}
      );
      if (updateHabit.modifiedCount >0) {
        // Document was updated
        return { success: true, msg: "Habit updated successfully" };
      } else {
        // Document not found or not updated
        return { success: false, msg: "Document not found or not updated" };
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong with the database");
    }
  }

  //Function to update a habit details request coming from the week view
  async updateWeekHabitDetails(_id, data) {
    try {
      const updateHabit = await HabitModel.updateOne(
        _id,
        data
      );
      if (updateHabit.modifiedCount >0) {
        // Document was updated
        return { success: true, msg: "Habit updated successfully" };
      } else {
        // Document not found or not updated
        return { success: false, msg: "Document not found or not updated" };
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong with the database");
    }
  }
}
