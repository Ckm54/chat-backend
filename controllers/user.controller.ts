import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
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

    // save to database
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: passwordHash,
      fullName,
    });

    // filter our password field from user
    const { password: userPass, ...userWithoutPassword } = user.toJSON();

    // create token
    const token = jwt.sign(
      {
        ...userWithoutPassword,
      },
      process.env.JWT_KEY!,
      { expiresIn: "2h" }
    );

    const userToReturn = {
      ...userWithoutPassword,
      token,
    };

    return res
      .status(201)
      .json({ message: "User created successfully", userToReturn });
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

    const token = jwt.sign(
      {
        ...userWithoutPassword,
      },
      process.env.JWT_KEY!,
      { expiresIn: "2h" }
    );

    const userToReturn = {
      ...userWithoutPassword,
      token,
    };
    // login success!
    return res.status(200).json({ userToReturn });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      message: "An error occurred while registering the user" + error.message,
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const { id: userID } = req.params;

    if (!userID) {
      return res.status(400).json({ message: "user id missing" });
    }

    // ensure this userId exists in database
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // fetch all users excluding the current user
    const allUsers = await User.find({ _id: { $ne: userID } }).select([
      "username",
      "email",
      "_id",
      "fullName",
    ]);

    return res.status(200).json(allUsers);
  } catch (error: any) {
    console.log(`Error fetching users ${error.message}`);
  }
}
