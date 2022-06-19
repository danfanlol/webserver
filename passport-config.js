import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "./model/schema/user.js";

function initializePassport(passport) {
  const authenticateUser = async (usern, pass, done) => {
    console.log(usern);
    const user = await User.findOne({ user: usern });
    if (user == null) {
      console.log("Uh oh!");
      return done(null, false, { message: "No user with that username" });
    }

    try {
      if (await bcrypt.compare(pass, user.pass)) {
        console.log("Successful login");
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "user", passwordField: "pass" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      if (user) {
        return done(null, user);
      }
      else{
        return done(err);
      }
    });
  });
  console.log("Initializing passport...");
}

export default initializePassport;
