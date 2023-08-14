import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// extend request type to accomodate user
export interface AuthenticationRequest extends Request {
  user: any;
}

const verifyToken = (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Auth token required");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY!);
    req.user = decodedToken;
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

export default verifyToken;
