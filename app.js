import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from "bcrypt";
import express from "express";
import express_session from "express-session";
import passport from "passport";
import { Strategy as LocalsStrategy } from "passport-local";
import {
  PORT,
  SALT_LENGTH,
  SESSION_COOKIE_MAX_AGE,
  SESSION_PRUNE_INTERVAL,
  SESSION_SECRET,
} from "./config.js";
import {
  bad_request_handler,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
import { prisma } from "./lib/prisma.js";

const customFields = {
  usernameField: "email",
};

passport.use(
  new LocalsStrategy(customFields, async (email, password, done) => {
    try {
      console.log({ email, password });
      const user = await db.get_user({ email });
      if (!user) return done(null, false, { message: "Incorrect email." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.locals.page = {};
  next();
});

app.use(
  express_session({
    cookie: {
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: SESSION_PRUNE_INTERVAL,
      dbRecordIdIsSessionId: true,
      sessionModelName: "user_sessions",
    }),
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(async (req, res, next) => {
    try {
      const new_user = req.body;
      new_user.password = await bcrypt.hash(new_user.password, SALT_LENGTH);
      const user = await db.insert_user(new_user);
      req.login(user, (error) => {
        if (error) next(error);
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  });

app
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post((req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        return res.redirect("/signin");
      }
      req.login(user, (error) => {
        if (error) return next(error);
        res.redirect("/");
      });
    })(req, res, next);
  });

app.route("/signout").get((req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect("/");
  });
});

app.use(missing_resource_response);
app.use(not_found_handler);
app.use(bad_request_handler);
app.use(server_error_handler);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App listening on port ${PORT}`);
});
