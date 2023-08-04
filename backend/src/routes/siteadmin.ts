// TODO: auth

import { Router } from "express";
import prisma from "../db";
import validation from "../middleware/validate";
import Joi from "joi";
import userAuth from "../middleware/auth";
import jwt from "jsonwebtoken";
import { transporter } from "../mailer";

const router = Router();

router.use(userAuth(["SITEADMIN"]));

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({
    users: users,
  });
});

router.post(
  "/user",
  validation(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    })
  ),
  async (req, res) => {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res.status(201).json({
      message: "User created successfully",
    });
  }
);

router.delete(
  "/user",
  validation(Joi.object({ id: Joi.string().required() })),
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.id,
      },
    });
    if (user == null)
      return res.status(404).json({
        message: "User not found",
      });
    const deleteHours = prisma.hour.deleteMany({
      where: {
        userId: user.id,
      },
    });
    const deleteUser = prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    const transaction = await prisma.$transaction([deleteHours, deleteUser]);
    res.status(202).json({
      message: "User deleted",
    });
  }
);

router.post("/password_reset/:user_id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.user_id,
    },
  });
  if (user == null) return res.status(401).json({ message: "User not found" });
  const token = jwt.sign(
    { hourid: user.id },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "1d",
    }
  );
  const url =
    (process.env.SERVER_URL || "http://localhost:3000/") +
    "/api/reset_password?id=" +
    token;

  // prettier-ignore
  const resp = await transporter.sendMail({
      from: `CSF Volunteer Tracking <${process.env.MAIL_USERNAME as string}>`,
      to: user.email,
      subject: `CSF Password Reset(${user.name})`,
      text: `\
Please click on the link below to reset your password \n

${url}
    `,
    });
});

export default router;
