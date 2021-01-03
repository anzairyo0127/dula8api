import * as express from "express";
import passport from "passport";

const router = express.Router();
router.get("/", (req, res) => {
  res.render("index");
  return;
});

router.post("/login", passport.authenticate("local", {
  successRedirect: '/user',
  failureRedirect: '/',
}));

router.get("/user", (req, res) => {
  const user = req.user;
  console.log(user);
  res.send('ログイン完了！');
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});
export default router;