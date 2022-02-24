import express from "express";
import routes from "./routes";
import "dotenv/config";
import passport from "passport";
import session from "express-session";
require("../src/middleware/auth");

const app = express();
app.use(express.json());

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || "development";

try {
  app.use("/auth/", routes);
  app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/protected",
      failureRedirect: "/auth/google/failure",
    })
  );

  app.get("/protected", isLoggedIn, (req, res) => {
    res.send(req.user);
  });

  app.get("/auth/google/failure", (req, res) => {
    res.send("Failed to authenticate..");
  });

  app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
