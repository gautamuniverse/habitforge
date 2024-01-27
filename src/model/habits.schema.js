import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema(
  {
    habitTitle: { type: String, required: true },
    timing: { type: String, required: true },
    actions: [
      {
        date: { type: Date }, 
        action: {
          type: String, 
          enum: ["Done", "Not done", "None"],
          default: "None",
        }
      },
    ],
  },
  {
    useTimezone: true,
    timezone: "Asia/Kolkata", 
  }
);


const HabitModel = mongoose.model("habits", HabitSchema);

export default HabitModel;

// Done - Mark the habit as done for a day
// Not done - Mark the habit as not done for a day
// None - User did not take any action on a habit for a day
