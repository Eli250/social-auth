const express = require("express");

import welcomeRoutes from "./api/welcomeRoutes";

const routes = express.Router();

routes.use("/", welcomeRoutes);

export default routes;
