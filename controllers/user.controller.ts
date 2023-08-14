import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password, fullName } = req.body;

    // check if there is an existing user with this name
    const usernameExists = await User.findOne({ username });

    if (usernameExists)
      return res.status(400).json({
        errorCode: "USERNAME_TAKEN",
        message: "Username already taken",
      });

    // check if email is already registered with another user
    const emailExits = await User.findOne({ email });

    if (emailExits)
      return res.status(400).json({
        errorCode: "EMAIL_TAKEN",
        message: "Email is already registered with another user",
      });

    // All is good! hash the password then save record to db
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      fullName,
    });

    // save to database
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      message: "An error occurred while registering the user" + error.message,
    });
  }
}
