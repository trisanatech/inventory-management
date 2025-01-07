"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("./prisma");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    const user = yield prisma.user.findUnique({
        where: { email },
        include: { role: true },
    });
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    if (!user || !(yield bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role.name }, process.env.JWT_SECRET_KEY, // Your secret key for signing the JWT
    { expiresIn: "1h" });
    res.json({ token });
});
exports.login = login;
