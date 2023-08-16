import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import messagesRoute from "./routes/message.route";
import http from "http";
import { ServerSocket } from "./socket";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

//start the socket
new ServerSocket(server);

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

if (!process.env.MONGODB_URI) {
  throw new Error("Database uri not found in env file");
}

// try connecting to mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to mongodb");
  })
  .catch((error: any) => {
    console.log(`Error connecting to mongodb ${error.message}`);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Chat App Server");
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
