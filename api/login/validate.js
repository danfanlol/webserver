import expressValidator from "express-validator";
const validationResult=expressValidator.validationResult;
export default function(req, res, next) {
  // console.log("Hello!");
  const errors = validationResult(req);
  // console.log(req.body);
  if (!errors.isEmpty()) {
    let error = {};
    errors.array().map((err) => (error[err.param] = err.msg));
    console.log("Error occurred", errors);

    return res.status(422).json({ message: "Invalid value" });
  }

  next();
};
