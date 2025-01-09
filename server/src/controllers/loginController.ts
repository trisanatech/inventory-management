import e, { Request, Response } from "express";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("./prisma");

interface User {
  id: string;
  email: string;
  password: string;
  role: {
    name: string;
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role.name },
    process.env.JWT_SECRET_KEY, // Your secret key for signing the JWT
    { expiresIn: "1h" }
  );

  res.json({ token });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: { connect: { name: "user" } },
    },
  });
  res.json({ user });
  // catch
  // (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};
