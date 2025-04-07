import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookierparser from "cookie-parser";
import bodyParser from "body-parser";

import authRoute from "./src/routes/authRoutes";
import { databaseConnection } from "./src/config/db";
import articleRoute from "./src/routes/articleRoutes";
import userRoute from "./src/routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

dotenv.config();

app.use(cookierparser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/article", articleRoute);

databaseConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
