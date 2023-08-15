import { NextFunction, Request, Response } from "express";
import Message from "../models/message.model";

// saves a message to database
export async function addMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get fields from request body
    const { from, to, message } = req.body;

    // validate the existence of these fields
    if (!from || !to || !message) {
      return res
        .status(400)
        .json({ message: "Invalid request: some fields are missing" });
    }

    // TODO:: ensure both users are existent on database else abort

    const response = await Message.create({
      message: { text: message },
      users: [from, to],
      from,
    });

    if (response)
      return res.status(201).json({ message: "message added successfully" });

    return res
      .status(400)
      .json({ message: "Failed to add message to database" });
  } catch (error) {
    next(error);
  }
}

export async function getAllMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { from, to } = req.body;

    // fetch these users' messages
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    // format chat messages to indicate sender and receiver for display in front end
    const conversationMessages = messages.map((message) => ({
      id: message._id,
      fromSelf: message.from.toString() === from,
      message: message.message.text,
    }));

    // return a response with the formatted messages
    return res.status(200).json(conversationMessages);
  } catch (error) {
    next(error);
  }
}
