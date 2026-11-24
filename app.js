import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from "bcrypt";
import express from "express";
import express_session from "express-session";
import { body, matchedData, validationResult } from "express-validator";
import multer from "multer";
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
  correct_values_for,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
import {
  check_signin,
  check_signup,
} from "./controllers/validate_controller.js";
import { prisma } from "./db/prisma.js";
import * as db from "./db/queries.js";

const customFields = {
  usernameField: "email",
};

passport.use(
  new LocalsStrategy(customFields, async (email, password, done) => {
    try {
      const user = await db.select_user({ email });
      if (!user)
        return done(null, false, {
          path: "email",
          msg: "No user exists with that email.",
        });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return done(null, false, {
          path: "password",
          msg: "Incorrect password.",
        });

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
const check_auth = (config) => (req, res, next) => {
  if (req.isAuthenticated()) next();
  else if (config?.on_fail) config.on_fail(req, res, next);
  else res.sendStatus(UNAUTHORIZED);
};
const upload = multer({ dest: "./uploads" });

app.set("view engine", "ejs");

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

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.locals.page = {};
  next();
});

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(
    check_signup,
    body("email").custom(async (_, { req }) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return true;
      try {
        const new_user = matchedData(req);
        new_user.password = await bcrypt.hash(new_user.password, SALT_LENGTH);
        req.user = await db.insert_user(new_user);
      } catch (error) {
        if (
          error.message.includes(
            "Unique constraint failed on the constraint: `users_email_key",
          )
        ) {
          error.message = "Email is already in use.";
        }
        throw error;
      }
      return true;
    }),
    correct_values_for("signup"),
    async (req, res, next) => {
      try {
        req.login(req.user, (error) => {
          if (error) next(error);
          res.redirect("/");
        });
      } catch (error) {
        next(error);
      }
    },
  );

app
  .route("/signin")
  .get((req, res) => {
    if (req.session?.locals_values) {
      res.locals.values = req.session.locals_values;
      delete req.session.locals_values;
    }
    res.render("signin");
    if (req.session?.auth_fail_info) delete req.session.auth_fail_info;
  })
  .post(check_signin, correct_values_for("signin"), (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        if (info) req.session.auth_fail_info = info;
        req.session.locals_values = matchedData(req, { onlyValidData: false });
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

app.route("/upload").post(check_auth(), upload.single("file"), (req, res) => {
  res.redirect("/");
});

app.route("/folders").get(check_auth(), async (req, res) => {
  const { email } = req.user;
  res.locals.folders = await db.select_all_user_folders({ email });
  res.render("folders");
});

app.route("/folders/insert").post(check_auth(), async (req, res) => {
  const { email: user_email } = req.user;
  const { name } = req.body;
  if (name.length > 0) await db.insert_folder({ name, user_email });
  res.redirect("/folders");
});

app.route("/folders/:id").get(check_auth(), async (req, res) => {
  res.send("select a folder");
});

app.route("/folders/update/:id").post(check_auth(), async (req, res) => {
  res.send("update folder");
});

app.route("/folders/delete/:id").post(check_auth(), async (req, res) => {
  res.send("delete folder");
});

app.use(missing_resource_response);
app.use(not_found_handler);
app.use(bad_request_handler);
app.use(server_error_handler);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App listening on port ${PORT}`);
});
