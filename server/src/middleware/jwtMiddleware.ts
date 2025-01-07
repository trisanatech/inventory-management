import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("./prisma");

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const jwtMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const roleMiddleware = (requiredRole: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (req.user?.role !== requiredRole) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};
