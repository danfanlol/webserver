import express from "express"
import * as expressvalidator from "express-validator";
import validate from "./validate.js";
import authcore from "./auth-core.js";
import bcrypt from "bcrypt";
import passport from "passport";
import Password from "../../model/password-core.js";
import User from "../../model/schema/user.js";

const {body}=expressvalidator;
const router=express.Router();
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to authentication!',
  });
});
router.post(
  '/register',

  [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('pass')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Must be at least 6 chars long'),
  ],
  validate,
  authcore.register
);
router.get('/verify/:token', authcore.verify);
router.post(
  '/login',
  [body('email').not().isEmpty(), body('pass').not().isEmpty()],
  validate,
  checkNotAuthenticated,
  
  async (req,res,next) => {
    passport.authenticate('local', function(err, user, info) {
      console.log(err,user,info);
      if (err) { return res.status(401).json({message:err}); }
      if (!user) { return res.status(401).json(info); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  }
);

router.post(
  '/recover',
  [body('email').isEmail().withMessage('Enter a valid email address')],
  validate,
  Password.recover
);

router.get('/reset/:token', Password.reset);

router.post("/edit/",
    [
        body("pass").notEmpty(),
        body('email').isEmail().withMessage('Enter a valid email address'),
    ],
    validate,
    async (request, response, next) => {
        if (!await bcrypt.compare(request.body.pass, request.user.pass)) {
            return response.status(403).json({message: "Incorrect password"});
        }

        if (request.body.name && (!request.body.name.first || !request.body.name.last)) {
            return response.status(400).json({message: "Name field specified but first or last name is missing"});
        }

        const user = request.user;
        const nonalphanumeric = /([^a-z0-9-_]+)/gi;
        if (request.body.name.first.match(nonalphanumeric)
            || request.body.name.last.match(nonalphanumeric)) {
          return response.status(401).json({
            message: 'Your name can only contain alphanumeric characters',
          });
        }
        if (await User.findOne({ email: request.body.email }) === user) {
          return response.status(401).json({
            message:
              'The email address you have entered is already associated with another account.',
          });
        }
 

        const {first, last} = request.body.name;
        Object.assign(user.name, {first, last});
        user.email = request.body.email;
        user.save();

        return response.status(200).json({});
    },
);

router.post(
  '/reset/:token',
  (res, req, next) => {
    console.log('POSTING!!!');
    next();
  },
  body('pass').not().isEmpty(),

  validate,
  (res, req, next) => {
    console.log('POSTING222!!!');
    next();
  },
  Password.resetPassword
);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  console.log('Going to authentication!!!11!!!');
  next();
}
function redirector(url) {
  return (req, res) => {
    res.redirect(url);
  };
}
export default router;