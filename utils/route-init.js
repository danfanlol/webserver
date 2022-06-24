import express from "express";
import mongoose from "mongoose";
import User from "../model/schema/user.js";
import path from "path"
import { baseViewParams } from "./base-view-objects.js";

const router = express.Router();

function standardroute(routePath, viewPath) {
  router.get(routePath, (req, res) => {
    res.render(viewPath, baseViewParams(req));
    // res.sendFile(path.join(process.cwd(),"views",fn));
  });
}

function filterLoggedIn(routePath) {
  router.get(routePath, (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  });
}
function filterLoggedOut(routePath) {
  router.get(routePath, (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  });
}
filterLoggedIn('/logout');
filterLoggedIn('/upload');

filterLoggedOut('/login');
filterLoggedOut('/register');
filterLoggedOut('/resetpassword');
filterLoggedOut('/emailsent');
filterLoggedOut('/registersuccess');
filterLoggedOut('/resetpasswordsent');

standardroute('/', 'home/index.ejs');
standardroute('/login', 'login/login.ejs');
standardroute('/register', 'login/register.ejs');
standardroute('/resetpassword', 'login/resetpassword.ejs');
standardroute('/emailsent', 'login/emailsent.ejs');
standardroute('/resetpasswordsent', 'login/resetpasswordsent.ejs');
standardroute('/resetpasswordsuccess', 'login/resetpasswordsuccess.ejs');
standardroute('/accountcreated', 'login/accountcreated.ejs');
standardroute('/test', 'static/test.ejs');
standardroute('/create', 'main/main.ejs');

standardroute('/tutor', 'tutor/index.ejs');

router.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logOut();
  }
  res.render('login/logout.ejs', baseViewParams(req));
});

export default router;