import express from "express";
import mongoose from "mongoose";
import User from "../model/schema/userschema.js";

const router = express.Router();

function standardroute(dn, fn) {
  router.get(dn, (req, res) => {
    const renderObject = {
      logged_in: false,
      user: '',
      bucket_name: process.env.AWS_BUCKET_NAME,
      dump_name: process.env.AWS_DUMP_NAME,
    };
    if (req.isAuthenticated()) {
      renderObject.logged_in = true;
      renderObject.user = req.user.user;
    }
    res.render(fn, renderObject);
  });
}

function filterLoggedIn(dn) {
  router.get(dn, (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  });
}
function filterLoggedOut(dn) {
  router.get(dn, (req, res, next) => {
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

standardroute('/', 'static/home/home.ejs');
standardroute('/login', 'login/login.ejs');
standardroute('/register', 'login/register.ejs');
standardroute('/resetpassword', 'login/resetpassword.ejs');
standardroute('/emailsent', 'login/emailsent.ejs');
standardroute('/resetpasswordsent', 'login/resetpasswordsent.ejs');
standardroute('/resetpasswordsuccess', 'login/resetpasswordsuccess.ejs');
standardroute('/accountcreated', 'login/accountcreated.ejs');
standardroute('/test', 'static/test.ejs');
standardroute('/create', 'main/main.ejs');

router.get('/logout', (req, res) => {
  const renderObject = {
    logged_in: false,
    user: '',
  };
  if (req.isAuthenticated()) {
    req.logOut();
  }
  res.render('login/logout.ejs', renderObject);
});

export default router;