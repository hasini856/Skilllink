import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

const CLIENT_URL = "http://localhost:5173";

// ================= CORS =================
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors({ origin: CLIENT_URL, credentials: true }));

// ================= BODY =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= LOGGING =================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ================= HEALTH =================
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "SkillLink API running successfully",
  });
});

// ================= ROUTES =================
app.use("/api", routes);

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);

export default app;