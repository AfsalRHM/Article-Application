import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();

import authRoute from "./src/routes/authRoutes";
import { databaseConnection } from "./src/config/db";
import articleRoute from "./src/routes/articleRoutes";
import userRoute from "./src/routes/userRoutes";

const app = express(); 

app.use(
  cors({
    origin: ["http://localhost:5173", "https://article-application-eight.vercel.app"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);


app.use(cookieparser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auths", authRoute);
app.use("/users", userRoute);
app.use("/articles", articleRoute);

databaseConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
