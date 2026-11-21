import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App listening on port 3000");
});
