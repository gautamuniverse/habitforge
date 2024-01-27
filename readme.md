# Habit Forge - A Habit Tracker Web Application

Habit Forge is a habit tracking web application built with NodeJS, Express, Express-EJS-Layouts, and MongoDB (mongoose) for the database.

## Key Features

- **CRUD Operations:** Users can create, read, update, and delete their habits.
- **One Week View:** See a one-week view of all added habits.
- **Habit Status Update:** Mark each day as Done (Green), Not Done (Red), or None (Transparent). The status cycles through these states upon clicking.
- **Add Habit View:** Define the habit name, timing for the date and select dates within a one-week range to perform the habit.
- **Update Habit View:** Modify previously defined values including habit name, timing and dates.
- **Delete Habit:** Habits can be deleted from the homepage.

## API Details

- **Add New Habit View**
  - **GET** `/habits/add-habit`: Display the form to add a new habit

- **Update Habit View**
  - **GET** `/habits/update-habit/:id`: Display the form to update a habit

- **Add New Habit**
  - **POST** `/habits/add`: Add a new habit

- **One Week View**
  - **GET** `/habits/week`: Get a one-week view of all habits

- **Update Habit**
  - **PUT** `/habits/:id`: Update a specific habit

- **Update Habit from Week View**
  - **PUT** `/habits/week/:id`: Handle update requests from the week view

- **Delete Habit**
  - **GET** `/habits/delete/:id`: Delete a specific habit

## Additional Features

1. **Error Handling:** An error handler middleware efficiently handles errors displaying a 404 page with relevant error messages when needed.
2. **Environment Variables:** `.env` file used for defining environment variables such as DB URL.

## Folder Structure

HABIT-TRACKER
├── .env<br>
├── env.variables.js<br>
├── index.js<br>
├── package-lock.json<br>
├── package.json<br>
├── node_modules<br>
├── public <br>
│&nbsp; &nbsp; &nbsp; ├── css<br>
│&nbsp; &nbsp; &nbsp; │   └── layout.css<br>
│&nbsp; &nbsp; &nbsp; └── logo<br>
│&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   ├── favicon.ico<br>
│&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   └── output_image.png (Website logo)<br>
├── src<br>
│&nbsp; &nbsp; &nbsp;  ├── config<br>
│&nbsp; &nbsp; &nbsp;  │   └── mongoose.db.js<br>
│&nbsp; &nbsp; &nbsp;  ├── controller<br>
│&nbsp; &nbsp; &nbsp;  │   └── habits.controller.js<br>
│&nbsp; &nbsp; &nbsp;  ├── middlewares<br>
│&nbsp; &nbsp; &nbsp;  │   └── errorpage.middleware.js<br>
│&nbsp; &nbsp; &nbsp;  ├── model<br>
│&nbsp; &nbsp; &nbsp;  │  ├── habits.repository.js<br>
│&nbsp; &nbsp; &nbsp;  │  └── habits.schema.js<br>
│&nbsp; &nbsp; &nbsp;  ├── routes<br>
│&nbsp; &nbsp; &nbsp;  │   └── habits.routes.js<br>
│&nbsp; &nbsp; &nbsp;  └── views<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      ├── 404page.ejs<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      ├── addHabit.ejs<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      ├── homepage.ejs<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      ├── layout.ejs<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      ├── updateHabit.ejs<br>
│&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;      └── weekly.ejs<br>

## Live Website

[Habit Forge](https://habit-forge-habit-tracker-web-application.onrender.com)

## Getting Started

To get started with Habit Forge:

1. Clone the repository: `git clone https://github.com/gautamuniverse/habitforge/`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and navigate to `http://localhost:3200`

## Contact Information

- **Author:** Gautam
- **GitHub:** [gautamuniverse](https://github.com/gautamuniverse)
- **LinkedIn:** [Gautam](https://www.linkedin.com/in/gautam-116307bb/)
- **Instagram:** [@gautamuniverse.in](https://www.instagram.com/gautamuniverse.in/)
