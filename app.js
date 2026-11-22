import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from "bcrypt";
import express from "express";
import express_session from "express-session";
import passport from "passport";
import { Strategy as LocalsStrategy } from "passport-local";
import { prisma } from "./lib/prisma.js";

passport.use(new LocalsStrategy(async (username, password, done) => {}));
passport.serializeUser((user, done) => {});
passport.deserializeUser((user, done) => {});

const app = express();
app.use(
  express_session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (unit: ms)
    },
    secret: "a",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 1000 * 60 * 2, // 2 minutes (unit: ms)
      dbRecordIdIsSessionId: true,
      sessionModelName: "user_sessions",
    }),
  }),
);

app.set("view engine", "ejs");

app.route("/").get((req, res) => {
  res.render("home");
});
app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post((req, res) => {
    res.send("post signup");
  });
app
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post((req, res) => {
    res.send("post signin");
  });
app.route("/signout").get((req, res) => {
  res.send("get signout");
});

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App listening on port 3000");
});
