import "./env.variabls.js";
import connectionUsingMongoose from "./src/config/mongoose.db.js";
import { errorPage } from "./src/middlewares/errorPageMiddleware/errorpage.middleware.js";

import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import expressEjsLayouts from "express-ejs-layouts";
import habitRouter from "./src/routes/habits.routes.js";
import HabitController from "./src/controller/habits.controller.js";

const server = express();

//Set the view engine as ejs
server.set("view engine", "ejs");

//Set the expressEjsLayouts as a middleware
server.use(expressEjsLayouts);

//Mention the folder where views are present
server.set("views", path.join(path.resolve(), "src", "views"));

//Make the public folder available for the cleint
server.use(express.static("public"));

//Make the views available for rendering
server.use(express.static("src/views"));

// handle and parse URL-encoded bodies of incoming requests
server.use(express.urlencoded({ extended: true }));

//HabitController object
const habitController = new HabitController();

//Homepage
server.get("/", (req, res, next) => habitController.homepage(req, res, next));

server.use("/habits", habitRouter);

//error handler
server.use(errorPage);

server.listen(3200, () => {
  console.log("Server is listening on " + 3200);
  connectionUsingMongoose();
});
