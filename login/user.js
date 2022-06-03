import express from "express";
import validate from "./validate.js";

const router = express.Router();


router.get('/', (req, res) => {
  var returnObj = { user: '' };
  if (req.isAuthenticated()) {
    returnObj.user = req.user.user;
  }
  return res.status(200).json(returnObj);
});

export default router;