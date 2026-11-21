import prisma_session_store from "@quixo3/prisma-session-store";
import express from "express";
import express_session from "express-session";
import { prisma } from "./lib/prisma.js";

const app = express();
app.use(
  express_session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (unit: ms)
    },
    secret: "a",
    resave: false,
    saveUninitialized: false,
    store: new prisma_session_store(prisma, {
      checkPeriod: 1000 * 60 * 2, // 2 minutes (unit: ms)
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
      sessionModelName: "user_sessions",
    }),
  }),
);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App listening on port 3000");
});
