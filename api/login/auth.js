import express from "express"
import expressvalidator from "express-validator";
import validate from "./validate.js";
import authcore from "../../model/auth-core.js";
import passport from "passport";
import Password from "../../model/password-core.js";

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
    body('user').not().isEmpty().withMessage('Username is required'),
  ],
  validate,
  authcore.register
);
router.get('/verify/:token', authcore.verify);
router.post(
  '/login',
  [body('user').not().isEmpty(), body('pass').not().isEmpty()],
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