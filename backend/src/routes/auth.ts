import { Router } from "express";
import validation from "../middleware/validate";
import Joi from "joi";
import prisma from "../db";
import bcrypt from "bcrypt";

const router = Router();

router.post(
  "/login",
  validation(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
  ),
  async (req, res) => {
    if (req.session.userId) {
      return res.json({ message: "Already Signed In" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (user == null) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (user.password == null) {
      return res.status(400).json({
        message: "Password not set",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(402).json({
        message: "Incorrect Email/Password",
      });
    }

    req.session.userId = user.id;
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
);

router.delete("/logout", (req, res) => {
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(400).json({ message: "Error" });
      } else {
        return res.json({ message: "Logged out" });
      }
    });
  } else {
    res.end();
  }
});

router.get("/user", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: "Not Logged In" });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.session.userId,
    },
  });
  if (user == null) return res.status(400).json({ message: "Not Logged In" });

  console.log(user);
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export default router;
