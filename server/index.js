  import express from "express";
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  import cookieParser from "cookie-parser";
  import cors from "cors";
  import authRoutes from "./routes/AuthRoutes.js";
  import contactRoutes from "./routes/contactRoutes.js";
  import setupSocket from "./socket.js";
  import messagesRoutes from "./routes/messagesRoutes.js";
  import channelRoutes from "./routes/channelRoutes.js";

  dotenv.config();

  const app = express();
  const port = process.env.PORT;
  const dbUrl = process.env.DATABASE_URL;

  app.use(
    cors({
      origin: [process.env.ORIGIN],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );

  app.use("/uploads/profiles", express.static("uploads/profiles"));
  app.use("/uploads/files", express.static("uploads/files"));

  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/messages", messagesRoutes);
  app.use("/api/channel", channelRoutes);

  app.get("/", (req, res) => res.send("Server is running"));

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Db connected successfully...");
      const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });

      setupSocket(server);
    })
    .catch((err) => {
      console.log(err.message);
    });
