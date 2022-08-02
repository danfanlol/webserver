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

import routeinit from "./routes/route-init.js"

import findtutorsRouter from "./routes/findtutors.js";
import {tutorRouter, studentRouter} from "./routes/user.js"
import meRouter from "./routes/me.js"
import adminRouter from "./routes/admin.js";
import api from "./api/index.js"

import sendEmail from "./util/email.js";
import { baseViewParams } from "./util/base-view-objects.js";

import mongo_init from "./model/index.js";

import forms from "./routes/forms.js"
import bodyParser from "body-parser";

await mongo_init();

const app = express();
sendEmail.init();

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

import getSessionStoreConstructor from "connect-mongodb-session";

const MongoSessionStore = getSessionStoreConstructor(session);
const store = new MongoSessionStore({
  uri: process.env.MONGO_URL,
  collection: "authSessions",
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  // cookie: {
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // },
  saveUninitialized: false,
  store,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routeinit);

app.use(express.static('views'));
app.use(express.static('public'));
app.use("/bundle", express.static("pages/dist"));
app.use("/api", api);
app.use("/forms", forms);
app.use("/findtutors", findtutorsRouter);
app.use("/tutor", tutorRouter);
app.use("/student", studentRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);


app.listen(process.env.PORT ?? 3000, () => {
  console.log('Started the sourver');
});
