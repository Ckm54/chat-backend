import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/allusers/:id", getAllUsers);

export default router;
