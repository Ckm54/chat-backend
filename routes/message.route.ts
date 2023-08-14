import express from "express";
import { addMessage, getAllMessages } from "../controllers/messages.controller";

const router = express.Router();

router.post("/addmsg/", addMessage);
router.get("/get-messages/", getAllMessages);

export default router;
