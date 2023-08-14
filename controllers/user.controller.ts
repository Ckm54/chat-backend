import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({
        errorCode: "INCOMPLETE_FIELDS",
        message: "Please ensure yo have entered a username, email and password",
      });

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

export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and/or password missing" });

    // try fetching user from database by username given
    const user = await User.findOne({ username });

    if (!user) {
      // no matching user found in db
      return res
        .status(400)
        .json({ message: "Incorrect username and/or password" });
    }

    // user exists so continue to check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Incorrect username and/or password" });

    const { password: passwordHash, ...userWithoutPassword } = user.toJSON();

    // login success!
    return res.status(200).json({ userWithoutPassword });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      message: "An error occurred while registering the user" + error.message,
    });
  }
}
