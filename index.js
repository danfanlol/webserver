import dotenv from "dotenv";
dotenv.config();

import express from "express";
import flash from "express-flash";
import passport from "passport";
import session from "express-session";

import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import initializePassport from "./passport-config.js";

import routeinit from "./utils/route-init.js"

import findtutorsRouter from "./routes/findtutors.js";
import tutorRouter from "./routes/tutor.js"
import auth from "./login/index.js";
import api from "./api/index.js"

import sendEmail from "./utils/email.js";
import { baseViewParams } from "./utils/base-view-objects.js";

import mongo_init from "./model/index.js";

import forms from "./forms/index.js"
import bodyParser from "body-parser";

await mongo_init();

sendEmail.init();
const app=express();

console.log(process.env.SESSION_SECRET);

//app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: path.join(process.cwd(), 'tmp'),
  })
);

app.use(flash());
initializePassport(passport);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routeinit);

auth(app);

app.use(express.static('views'));
app.use(express.static('public'));
app.use("/api", api);
app.use("/forms", forms);
app.use("/findtutors", findtutorsRouter);
app.use("/tutor", tutorRouter);


app.listen(process.env.PORT ?? 3000, () => {
  console.log('Started the sourver');
});
