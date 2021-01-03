import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { verifyUser } from "../functions/auth";

const createPassport = (db) => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    // https://blog.capilano-fw.com/?p=5655
    // ユーザー認証
    const [userInfo, isSuccess] = await verifyUser(db, { username, password });
    if (isSuccess) {
      return done(null, userInfo); // req.user: userInfo;
    } else {
      return done(null, false, { message: "Not Authentication." });
    };
  }));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  return passport;
};

export default createPassport;